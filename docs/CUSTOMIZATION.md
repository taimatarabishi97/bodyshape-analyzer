# Customization Guide

This guide explains how to customize the Body Shape Analysis application to match your brand and requirements.

## Table of Contents

1. [Styling Recommendations](#styling-recommendations)
2. [Body Shape Classification Rules](#body-shape-classification-rules)
3. [Colors and Branding](#colors-and-branding)
4. [Email Templates](#email-templates)
5. [Questionnaire Questions](#questionnaire-questions)
6. [Pricing Tiers](#pricing-tiers)

---

## Styling Recommendations

Styling recommendations are stored in a JSON configuration file for easy editing without touching code.

### Location

`src/config/stylingRecommendations.json`

### Structure

```json
{
  "body-shape-name": {
    "name": "Display Name",
    "description": "Body shape description",
    "recommendations": [
      {
        "category": "Category Name",
        "recommendations": ["What works..."],
        "avoid": ["What to avoid..."]
      }
    ],
    "colorTips": ["Color tip 1", "Color tip 2"],
    "fitTips": ["Fit tip 1", "Fit tip 2"]
  }
}
```

### How to Modify

1. Open `src/config/stylingRecommendations.json`
2. Find the body shape you want to modify
3. Edit the recommendations, avoid lists, or tips
4. Save the file
5. Rebuild the application: `pnpm run build`

### Example: Adding a New Category

```json
{
  "category": "Accessories",
  "recommendations": [
    "Statement necklaces to draw attention upward",
    "Wide belts to define waist",
    "Long scarves for vertical lines"
  ],
  "avoid": [
    "Chunky belts that add bulk",
    "Short necklaces that cut the neckline"
  ]
}
```

### Guidelines

- Keep language GDPR-friendly (no medical claims)
- Use positive, empowering language
- Be specific with recommendations
- Provide actionable advice
- Keep "avoid" lists constructive

---

## Body Shape Classification Rules

The classification algorithm is rules-based and can be adjusted to match your criteria.

### Location

`src/lib/analysis/bodyShapeClassifier.ts`

### How It Works

The algorithm assigns scores to each body shape based on questionnaire answers:

```typescript
const scores = {
  pear: 0,
  hourglass: 0,
  apple: 0,
  rectangle: 0,
  'inverted-triangle': 0,
};
```

### Adjusting Scoring

To modify how body shapes are classified:

1. Open `src/lib/analysis/bodyShapeClassifier.ts`
2. Find the `classifyBodyShape` function
3. Adjust score weights for different answers

**Example: Make waist definition more important for hourglass**

```typescript
// Before
if (answers.waistDefinition === 'very-defined') {
  scores.hourglass += 3;
}

// After (stronger weight)
if (answers.waistDefinition === 'very-defined') {
  scores.hourglass += 5;
}
```

### Measurement-Based Classification

If measurements are provided, additional scoring is applied:

```typescript
// Hourglass: balanced bust and hips, defined waist
if (bustToWaist >= 1.25 && hipsToWaist >= 1.25 && Math.abs(bust - hips) <= 5) {
  scores.hourglass += 3;
}
```

Adjust these thresholds to change sensitivity:
- `1.25`: Minimum ratio for defined waist
- `5`: Maximum difference between bust and hips (in cm)

### Testing Changes

After modifying classification rules:

1. Test with various input combinations
2. Verify results make sense
3. Document your changes
4. Consider edge cases

---

## Colors and Branding

### Primary Colors

Located in multiple files. Update consistently:

#### 1. Tailwind Configuration

`tailwind.config.ts` (if you need custom colors):

```javascript
theme: {
  extend: {
    colors: {
      brand: {
        purple: '#8B5CF6',
        pink: '#EC4899',
      }
    }
  }
}
```

#### 2. Component Styles

Search and replace in all component files:

**Current colors:**
- Primary Purple: `#8B5CF6` / `purple-600`
- Secondary Pink: `#EC4899` / `pink-600`

**Find and replace:**
```bash
# Example: Change to blue theme
find ./src -type f -name "*.tsx" -exec sed -i 's/purple-600/blue-600/g' {} +
find ./src -type f -name "*.tsx" -exec sed -i 's/pink-600/indigo-600/g' {} +
```

### Logo

Replace the icon in the header:

1. **Index.tsx** - Welcome page icon
2. **AdminLogin.tsx** - Admin login icon

Replace `<Sparkles>` or `<Lock>` with your logo component or image:

```tsx
// Before
<Sparkles className="w-8 h-8 text-white" />

// After
<img src="/logo.png" alt="Logo" className="w-8 h-8" />
```

### Favicon

Replace in `index.html`:

```html
<link rel="icon" href="/your-favicon.png" type="image/png">
```

Place your favicon in the `public` folder.

### Fonts

Current font: **Inter** (loaded from Google Fonts via Tailwind)

To change:

1. Update `tailwind.config.ts`:

```javascript
theme: {
  extend: {
    fontFamily: {
      sans: ['Your Font', 'sans-serif'],
    }
  }
}
```

2. Import font in `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font:wght@400;500;600;700&display=swap');
```

---

## Email Templates

### Location

`src/lib/resend.ts` - `sendResultsEmail` function

### Customizing Email Content

```typescript
html: `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      /* Your custom styles */
    </style>
  </head>
  <body>
    <!-- Your custom content -->
  </body>
  </html>
`
```

### Email Styling Tips

1. **Use inline styles** (better email client support)
2. **Test in multiple clients** (Gmail, Outlook, Apple Mail)
3. **Keep it simple** (complex CSS often breaks)
4. **Use tables for layout** (better compatibility)

### Changing Sender Information

```typescript
from: 'Your Brand <noreply@yourdomain.com>',
subject: 'Your Custom Subject Line',
```

**Important**: The `from` address must use a verified domain in Resend.

### Adding Custom Variables

```typescript
export async function sendResultsEmail(
  to: string,
  bodyShape: string,
  pdfBuffer: Buffer,
  userName?: string  // Add custom parameter
) {
  // Use in template
  html: `<p>Hi ${userName || 'there'},</p>`
}
```

---

## Questionnaire Questions

### Location

`src/pages/Questionnaire.tsx`

### Adding a New Question

1. **Update TypeScript types** in `src/types/index.ts`:

```typescript
export interface QuestionnaireAnswers {
  // ... existing fields
  newQuestion: 'option1' | 'option2' | 'option3';
}
```

2. **Add question to form** in `Questionnaire.tsx`:

```tsx
<div className="space-y-3">
  <Label>Your New Question?</Label>
  <RadioGroup 
    value={answers.newQuestion} 
    onValueChange={(v) => updateAnswer('newQuestion', v)}
  >
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option1" id="new-option1" />
      <Label htmlFor="new-option1">Option 1</Label>
    </div>
    {/* More options... */}
  </RadioGroup>
</div>
```

3. **Update validation** in `isStepComplete()`:

```typescript
case 1:
  return answers.shoulderWidth && 
         answers.hipWidth && 
         answers.newQuestion;  // Add new field
```

4. **Update classification logic** in `bodyShapeClassifier.ts`:

```typescript
// Add scoring logic for new question
if (answers.newQuestion === 'option1') {
  scores.pear += 2;
}
```

### Removing a Question

1. Remove from TypeScript types
2. Remove from form UI
3. Remove from validation
4. Update classification logic
5. Test thoroughly

### Changing Question Order

Rearrange the JSX in the appropriate step section. Make sure to update step validation accordingly.

---

## Pricing Tiers

Currently prepared for three tiers: basic, standard, premium.

### Database Schema

Already supports tiers in `access_tokens` table:

```sql
tier VARCHAR(50) CHECK (tier IN ('basic', 'standard', 'premium'))
```

### Adding Tier-Specific Features

1. **Update TypeScript types** if needed:

```typescript
export type ServiceTier = 'basic' | 'standard' | 'premium' | 'enterprise';
```

2. **Add tier-based logic** in Results page:

```typescript
// Example: Show different content based on tier
const tier = submission?.access_token?.tier;

{tier === 'premium' && (
  <Card>
    <CardHeader>
      <CardTitle>Premium Bonus Content</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Premium-only recommendations */}
    </CardContent>
  </Card>
)}
```

3. **Update PDF generation** for tier-specific content:

```typescript
export function generatePDF(
  email: string,
  result: AnalysisResult,
  tier: ServiceTier = 'basic'
) {
  // Add tier-specific sections
  if (tier === 'premium') {
    addText('Premium Styling Tips', 16, true);
    // ... premium content
  }
}
```

### Tier Feature Matrix

**Basic:**
- Body shape classification
- Basic styling recommendations
- PDF download

**Standard:**
- Everything in Basic
- Detailed recommendations for all categories
- Email delivery
- Color and fit tips

**Premium:**
- Everything in Standard
- Extended recommendations
- Seasonal styling guide
- Personal shopping tips
- Priority support

---

## Testing Your Changes

After making customizations:

```bash
# 1. Run linter
pnpm run lint

# 2. Build for production
pnpm run build

# 3. Test locally
pnpm run dev

# 4. Test all user flows
# - Complete questionnaire
# - View results
# - Download PDF
# - Admin dashboard
```

---

## Best Practices

1. **Version Control**: Commit before making major changes
2. **Test Thoroughly**: Test all affected features
3. **Document Changes**: Keep notes on customizations
4. **Backup Data**: Export database before schema changes
5. **Gradual Changes**: Make one change at a time
6. **User Feedback**: Gather feedback after changes

---

## Need Help?

- Review the code comments for guidance
- Check TypeScript types for data structures
- Refer to component documentation
- Test in development before deploying

---

**Next Steps**: See [SHOPIFY-INTEGRATION.md](./SHOPIFY-INTEGRATION.md) for e-commerce integration