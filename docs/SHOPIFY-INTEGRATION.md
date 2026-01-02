# Shopify Integration Guide

This guide explains how to integrate the Body Shape Analysis application with your Shopify store to sell it as a digital service.

## Overview

The application is prepared for Shopify integration with:
- Access token system in database
- Token validation logic
- Email delivery of access links
- Tier-based access control

## Integration Architecture

```
Customer Purchase (Shopify)
    ↓
Webhook Triggered
    ↓
Generate Access Token
    ↓
Send Email with Access Link
    ↓
Customer Clicks Link
    ↓
Token Validated
    ↓
Questionnaire Access Granted
```

## Prerequisites

- Shopify store (any plan)
- Admin access to Shopify
- Body Shape Analysis app deployed
- Basic understanding of webhooks

---

## Step 1: Create Shopify Products

### 1.1 Product Setup

Create three products in Shopify:

**Product 1: Basic Body Shape Analysis**
- Price: $9.99
- Type: Digital
- SKU: `BSA-BASIC`
- Description: Basic body shape classification and styling tips

**Product 2: Standard Body Shape Analysis**
- Price: $19.99
- Type: Digital
- SKU: `BSA-STANDARD`
- Description: Detailed styling recommendations with PDF report

**Product 3: Premium Body Shape Analysis**
- Price: $29.99
- Type: Digital
- SKU: `BSA-PREMIUM`
- Description: Complete analysis with extended recommendations

### 1.2 Product Metadata

Add metafields to each product:

```
Namespace: custom
Key: service_tier
Value: basic | standard | premium
Type: Single line text
```

---

## Step 2: Set Up Webhook Handler

### 2.1 Create API Endpoint

Create a new file: `src/api/shopify-webhook.ts`

```typescript
import { supabaseAdmin } from '@/lib/supabase';
import { sendAccessEmail } from '@/lib/email-access';
import crypto from 'crypto';

export async function handleShopifyWebhook(request: Request) {
  // Verify webhook authenticity
  const hmac = request.headers.get('X-Shopify-Hmac-SHA256');
  const body = await request.text();
  
  const hash = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET!)
    .update(body)
    .digest('base64');

  if (hash !== hmac) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Parse order data
  const order = JSON.parse(body);
  
  // Process each line item
  for (const item of order.line_items) {
    const sku = item.sku;
    
    // Determine tier based on SKU
    let tier: 'basic' | 'standard' | 'premium' = 'basic';
    if (sku === 'BSA-STANDARD') tier = 'standard';
    if (sku === 'BSA-PREMIUM') tier = 'premium';

    // Generate access token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

    // Save to database
    const { data: accessToken, error } = await supabaseAdmin
      .from('access_tokens')
      .insert({
        token,
        email: order.email,
        tier,
        is_used: false,
        expires_at: expiresAt.toISOString(),
        shopify_order_id: order.id.toString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating access token:', error);
      continue;
    }

    // Send access email
    const accessLink = `${process.env.VITE_APP_URL}/access/${token}`;
    await sendAccessEmail(order.email, tier, accessLink);
  }

  return new Response('OK', { status: 200 });
}
```

### 2.2 Create Access Email Function

Create `src/lib/email-access.ts`:

```typescript
import { resend } from './resend';

export async function sendAccessEmail(
  to: string,
  tier: string,
  accessLink: string
) {
  if (!resend) {
    console.error('Resend not configured');
    return;
  }

  const tierNames = {
    basic: 'Basic',
    standard: 'Standard',
    premium: 'Premium',
  };

  await resend.emails.send({
    from: 'Body Shape Analysis <noreply@yourdomain.com>',
    to: [to],
    subject: 'Your Body Shape Analysis Access Link',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #8B5CF6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: bold; }
          .tier-badge { background: #EC4899; color: white; padding: 6px 12px; border-radius: 4px; display: inline-block; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Body Shape Analysis!</h1>
          </div>
          <div class="content">
            <span class="tier-badge">${tierNames[tier]} Plan</span>
            
            <p>Thank you for your purchase! You now have access to your personalized body shape analysis.</p>
            
            <p><strong>What's included in your ${tierNames[tier]} plan:</strong></p>
            <ul>
              <li>Complete body shape questionnaire</li>
              <li>Personalized body shape classification</li>
              <li>Detailed styling recommendations</li>
              <li>Downloadable PDF report</li>
              ${tier === 'premium' ? '<li>Extended premium recommendations</li>' : ''}
            </ul>

            <p>Click the button below to start your analysis:</p>
            
            <a href="${accessLink}" class="button">Start Your Analysis</a>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              This link is valid for 30 days and can be used once. 
              If you need assistance, reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
```

---

## Step 3: Configure Shopify Webhook

### 3.1 In Shopify Admin

1. Go to **Settings** → **Notifications**
2. Scroll to **Webhooks**
3. Click **Create webhook**

**Webhook Configuration:**
- Event: `Order payment`
- Format: `JSON`
- URL: `https://your-app.vercel.app/api/shopify-webhook`
- Webhook API version: `Latest`

### 3.2 Get Webhook Secret

After creating the webhook:
1. Copy the webhook signing secret
2. Add to your environment variables:

```env
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret_here
```

3. Redeploy your application

---

## Step 4: Implement Token Validation

### 4.1 Create Access Page

Create `src/pages/Access.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function Access() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    if (!token || !supabase) {
      toast.error('Invalid access link');
      navigate('/');
      return;
    }

    try {
      // Fetch token from database
      const { data: accessToken, error } = await supabase
        .from('access_tokens')
        .select('*')
        .eq('token', token)
        .single();

      if (error || !accessToken) {
        toast.error('Invalid or expired access link');
        navigate('/');
        return;
      }

      // Check if already used
      if (accessToken.is_used) {
        toast.error('This access link has already been used');
        navigate('/');
        return;
      }

      // Check if expired
      if (new Date(accessToken.expires_at) < new Date()) {
        toast.error('This access link has expired');
        navigate('/');
        return;
      }

      // Store token in session
      sessionStorage.setItem('access_token', token);
      sessionStorage.setItem('user_email', accessToken.email);
      sessionStorage.setItem('service_tier', accessToken.tier);

      // Redirect to questionnaire
      toast.success('Access granted! Starting your analysis...');
      navigate('/questionnaire');
    } catch (error) {
      console.error('Error validating token:', error);
      toast.error('An error occurred. Please try again.');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
        <p className="text-gray-600">Validating your access...</p>
      </div>
    </div>
  );
}
```

### 4.2 Update Questionnaire to Mark Token as Used

In `src/pages/Questionnaire.tsx`, after successful submission:

```typescript
const handleSubmit = async () => {
  // ... existing submission code ...

  // Mark token as used
  const accessToken = sessionStorage.getItem('access_token');
  if (accessToken && supabase) {
    await supabase
      .from('access_tokens')
      .update({ 
        is_used: true, 
        used_at: new Date().toISOString() 
      })
      .eq('token', accessToken);
  }

  // ... rest of code ...
};
```

### 4.3 Add Route to App.tsx

```typescript
import Access from './pages/Access';

// In Routes:
<Route path="/access/:token" element={<Access />} />
```

---

## Step 5: Testing

### 5.1 Test Webhook Locally

Use ngrok for local testing:

```bash
# Install ngrok
npm install -g ngrok

# Start your app
pnpm run dev

# In another terminal, expose port 3000
ngrok http 3000

# Use the ngrok URL in Shopify webhook settings
```

### 5.2 Create Test Order

1. In Shopify, create a test order
2. Use a real email you can access
3. Complete the checkout
4. Check if:
   - Webhook was received
   - Token was created in database
   - Email was sent
   - Access link works

### 5.3 Test Token Flow

1. Click access link in email
2. Verify redirect to questionnaire
3. Complete questionnaire
4. Verify token is marked as used
5. Try using link again (should fail)

---

## Step 6: Production Deployment

### 6.1 Environment Variables

Ensure all variables are set in Vercel:

```env
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
VITE_APP_URL=https://yourdomain.com
# ... other variables
```

### 6.2 Update Webhook URL

In Shopify, update webhook URL to production:
```
https://yourdomain.com/api/shopify-webhook
```

### 6.3 Security Checklist

- [ ] Webhook signature verification enabled
- [ ] HTTPS enforced
- [ ] Token expiry implemented
- [ ] Single-use tokens enforced
- [ ] Email verification working
- [ ] Error logging configured

---

## Troubleshooting

### Webhook Not Firing

- Check webhook is active in Shopify
- Verify URL is correct and accessible
- Check Shopify webhook logs
- Ensure endpoint returns 200 status

### Token Not Created

- Check database permissions
- Verify Supabase connection
- Review server logs
- Check for SQL errors

### Email Not Sent

- Verify Resend API key
- Check domain verification
- Review Resend logs
- Ensure from address is verified

---

## Advanced Features

### Multiple Products per Order

The webhook handler already supports multiple products. Each product creates a separate token.

### Refunds

Add webhook for `Order refund`:

```typescript
// Mark token as invalid on refund
await supabaseAdmin
  .from('access_tokens')
  .update({ is_used: true, expires_at: new Date().toISOString() })
  .eq('shopify_order_id', order.id.toString());
```

### Analytics

Track conversions:

```typescript
// In Access.tsx after successful validation
await supabaseAdmin
  .from('analytics')
  .insert({
    event: 'access_granted',
    token_id: accessToken.id,
    tier: accessToken.tier,
  });
```

---

## Support

For integration issues:
- Check Shopify webhook logs
- Review application logs in Vercel
- Verify database records in Supabase
- Test with Shopify's webhook tester

---

**Congratulations!** Your Body Shape Analysis app is now integrated with Shopify and ready to sell as a digital service.