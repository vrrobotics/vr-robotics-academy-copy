# Email Service Setup Guide - Gmail SMTP

## Overview
The email service is now configured to send real emails using **Gmail SMTP**. This uses your own Gmail account and is much more reliable than third-party APIs.

## Prerequisites
- Gmail account (abhinavneeraj.bade@gmail.com)
- 2-Step Verification enabled on your Google Account

## Step 1: Generate Gmail App Password

1. Go to **https://myaccount.google.com** and sign in
2. Click **Security** in the left menu
3. Scroll down and find **App passwords** (if you don't see it, enable 2-Step Verification first)
4. Select **Mail** and **Windows Computer** (or your device type)
5. Click **Generate**
6. Copy the 16-character password (looks like: `xxxx xxxx xxxx xxxx`)

> **⚠️ Important**: This is a temporary password just for this app. Never share it!

## Step 2: Configure Environment Variables

1. In your project root, open or create `.env.local` file
2. Add your Gmail credentials:
   ```
   GMAIL_USER=abhinavneeraj.bade@gmail.com
   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
   ADMIN_EMAIL=abhinavneeraj.bade@gmail.com
   ```

Replace `xxxx xxxx xxxx xxxx` with the 16-character password you generated.

3. Save the file

## Step 3: Install Dependencies

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

## Step 4: Restart Dev Server

```bash
npm run dev
```

## Step 5: Test Email Sending

1. Go to your demo booking page
2. Fill out the form and submit
3. Check your email at `abhinavneeraj.bade@gmail.com` within seconds
4. Open browser **Console (F12)** to see detailed logs

### Expected Success Logs
```
[EmailService] ===== EMAIL SEND ATTEMPT (GMAIL SMTP) =====
[EmailService] To: abhinavneeraj.bade@gmail.com
[EmailService] Subject: 🎉 New Demo Booking...
[EmailService] ✓✓✓ Email sent successfully via Gmail SMTP!
[EmailService] Message ID: ...
```

## Security Notes

- ✅ App passwords are Gmail-specific and only work for this app
- ✅ Stored securely in `.env.local` (never committed to git)
- ✅ Can be revoked anytime from your Google Account
- ✅ Credentials stay on the server (not sent to clients)

## Email Limits

- **No daily limit** - Send as many emails as you want
- **No API key needed** - Uses your existing Gmail account
- **No external service** - Everything stays within your infrastructure

## Troubleshooting

### ❌ "Gmail credentials not configured"
- Ensure `.env.local` exists with both `GMAIL_USER` and `GMAIL_APP_PASSWORD`
- Check spelling and format
- Restart dev server after adding credentials

### ❌ "Invalid login credentials"
- Make sure you're using the **16-character App Password**, not your regular password
- Verify 2-Step Verification is enabled
- Generate a new App Password from your Google Account

### ❌ "Less secure app access"
- You don't need to enable this with App Passwords
- If you see this error, use an App Password instead

### ❌ Email not received
- Check spam/junk folder first
- Verify the email address is correct
- Check Gmail SMTP logs in the console (F12)
- Make sure server is running (`npm run dev`)

## What Gets Emailed

### 1. Demo Booking Notification
**When**: Student books a demo
**To**: Admin email (abhinavneeraj.bade@gmail.com)
**Includes**: Parent info, student name/age, preferred date/time, interests

### 2. Student Registration Notification
**When**: Student signs up
**To**: Admin email
**Includes**: Full name, email, phone, age, gender

## Support

- Google Account Help: [https://support.google.com](https://support.google.com)
- Gmail Security: [https://myaccount.google.com/security](https://myaccount.google.com/security)

