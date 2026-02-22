# Google Sheets Integration Setup Guide

## Overview
This guide will help you set up automatic Google Sheets updates when students register for demo classes.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Name it: `VR Robotics Demo Bookings`
4. Click "Create"

## Step 2: Enable Google Sheets API

1. In the Google Cloud Console, search for "Google Sheets API"
2. Click on it and select "Enable"
3. Wait for it to enable (takes a few seconds)

## Step 3: Create a Service Account

1. Go to "APIs & Services" → "Credentials" (left sidebar)
2. Click "Create Credentials" → "Service Account"
3. Fill in:
   - Service account name: `demo-bookings-service`
   - Service account ID: (auto-filled)
   - Description: `Automatic demo booking Google Sheets updates`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 4: Create and Download Service Account Key

1. In Credentials page, find your newly created service account
2. Click on it
3. Go to "Keys" tab → "Add Key" → "Create new key"
4. Select "JSON" format
5. Click "Create"
6. **The JSON file will download** - SAVE THIS SAFELY (you'll need it)

## Step 5: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "+" to create a new sheet
3. Name it: `Demo Class Registrations`
4. **Add these headers in row 1:**
   - A1: `Registration Date`
   - B1: `Parent Name`
   - C1: `Parent Email`
   - D1: `Parent Phone`
   - E1: `Student Name`
   - F1: `Student Age`
   - G1: `Preferred Date`
   - H1: `Preferred Time`
   - I1: `Interests`
   - J1: `Message`
   - K1: `Status`
   - L1: `Booking ID`

5. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
   ```

## Step 6: Share Google Sheet with Service Account

1. Open your Google Sheet (Demo Class Registrations)
2. Click "Share" button (top right)
3. Get the service account email (looks like: `demo-bookings-service@project-id.iam.gserviceaccount.com`)
   - Find it in the downloaded JSON file, look for `"client_email"`
4. Paste the email in the Share dialog
5. Give it "Editor" access
6. Click "Share"

## Step 7: Configure Environment Variables

Create or update `.env.local` in your project root:

```env
# Google Sheets API
VITE_GOOGLE_SHEET_ID=your_sheet_id_here
VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
VITE_GOOGLE_API_KEY=your_api_key_here
```

**Note:** For production, you should:
- Use a backend service instead of exposing credentials in frontend
- Store credentials securely on your server

## Step 8: Update Your Application

The application will now:
1. Save demo bookings to Supabase (existing)
2. **Automatically append to your Google Sheet** (new!)

When a student submits the form:
- ✅ Data saves to Supabase database
- ✅ Data appends to Google Sheet in real-time
- ✅ You can view all bookings live in Google Sheets

## Verification

1. Submit a test demo booking
2. Check your Google Sheet
3. New row should appear automatically!

## Troubleshooting

**Error: "Unable to find sheet"**
- Verify Sheet ID is correct
- Check that service account has Editor access
- Ensure API is enabled in Google Cloud Console

**Error: "Permission denied"**
- Grant Editor access to service account email
- Wait a few minutes for permissions to propagate

**No new rows appearing**
- Check browser console for errors (F12 → Console)
- Verify Google Sheet headers match expected format
- Test with a simple data-writing curl request
