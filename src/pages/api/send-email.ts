import type { APIRoute } from 'astro';

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

export const POST: APIRoute = async ({ request }) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const emailData: EmailRequest = await request.json();

    // Validate email data
    if (!emailData.to || !emailData.subject || !emailData.html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get Gmail credentials from environment
    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPassword) {
      console.error('[EmailAPI] Gmail credentials not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Email service not configured',
          success: false 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use dynamic import for nodemailer (server-side only)
    const nodemailer = await import('nodemailer');

    // Create transporter
    const transporter = nodemailer.default.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    });

    // Send email
    console.log('[EmailAPI] Sending email to:', emailData.to);
    const info = await transporter.sendMail({
      from: gmailUser,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    });

    console.log('[EmailAPI] ✓ Email sent successfully');
    console.log('[EmailAPI] Message ID:', info.messageId);

    return new Response(
      JSON.stringify({
        success: true,
        messageId: info.messageId,
        message: 'Email sent successfully',
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('[EmailAPI] Error sending email:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
