import { Resend } from 'resend';

const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;

if (!resendApiKey) {
  console.warn('VITE_RESEND_API_KEY is not set. Email functionality will not work.');
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendResultsEmail(
  to: string,
  bodyShape: string,
  pdfBuffer: Buffer
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    return { success: false, error: 'Email service not configured' };
  }

  try {
    await resend.emails.send({
      from: 'Body Shape Analysis <noreply@yourdomain.com>', // Update with your domain
      to: [to],
      subject: 'Your Body Shape Analysis Results',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .result-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B5CF6; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Body Shape Analysis Results</h1>
            </div>
            <div class="content">
              <p>Thank you for completing your body shape analysis!</p>
              
              <div class="result-box">
                <h2 style="color: #8B5CF6; margin-top: 0;">Your Body Shape: ${bodyShape}</h2>
                <p>We've analyzed your responses and created personalized styling recommendations just for you.</p>
              </div>

              <p>Your complete analysis report is attached to this email as a PDF. It includes:</p>
              <ul>
                <li>Detailed description of your body shape</li>
                <li>Personalized styling recommendations for tops, bottoms, dresses, and more</li>
                <li>Color and fit tips tailored to your shape</li>
                <li>What to avoid to ensure the most flattering looks</li>
              </ul>

              <p>Use these insights to make confident fashion choices that celebrate your unique shape!</p>

              <div class="footer">
                <p>This analysis is based on fashion industry standards and styling principles.</p>
                <p>Questions? Contact us at support@yourdomain.com</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: 'body-shape-analysis.pdf',
          content: pdfBuffer,
        },
      ],
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}