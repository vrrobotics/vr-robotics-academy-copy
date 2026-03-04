import type { APIRoute } from 'astro';

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: string; // base64 encoded
    contentType?: string;
  }>;
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

    if (!emailData.to || !emailData.subject || !emailData.html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || 'VR Robotics Academy';

    if (!brevoApiKey || !senderEmail) {
      console.error('[EmailAPI] Brevo credentials not configured');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email service not configured',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[EmailAPI] Sending email to:', emailData.to);
    const brevoPayload: Record<string, any> = {
      sender: {
        email: senderEmail,
        name: senderName,
      },
      to: [{ email: emailData.to }],
      subject: emailData.subject,
      htmlContent: emailData.html,
    };

    const mappedAttachments = (emailData.attachments || []).map((attachment) => ({
      name: attachment.filename,
      content: attachment.content,
    }));

    if (mappedAttachments.length > 0) {
      brevoPayload.attachment = mappedAttachments;
    }

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify(brevoPayload),
    });

    const brevoData = await brevoResponse.json().catch(() => ({}));
    if (!brevoResponse.ok) {
      console.error('[EmailAPI] Brevo API error:', brevoData);
      return new Response(
        JSON.stringify({
          success: false,
          error: brevoData?.message || 'Failed to send email via Brevo',
          details: brevoData,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[EmailAPI] Email sent successfully via Brevo');
    console.log('[EmailAPI] Message ID:', brevoData?.messageId);

    return new Response(
      JSON.stringify({
        success: true,
        messageId: brevoData?.messageId,
        message: 'Email sent successfully',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[EmailAPI] Error sending email:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
