# Google Sheets Auto-Update Integration - Complete Setup Guide

You now have a fully automated system where:
1. **Form Submission** → Data saves to Supabase ✅
2. **Auto Google Sheets Update** → Data appends to your Google Sheet in real-time ✨
3. **Email Notification** → Admin gets notified

## Quick Setup (5 minutes)

### Step 1: Create Google Cloud Credentials
1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: `VR Robotics`
3. Enable Google Sheets API
4. Create Service Account
5. Download JSON credentials

### Step 2: Create Google Apps Script
1. Open [Google Apps Script](https://script.google.com/)
2. Create new project
3. Copy entire code from `GOOGLE_APPS_SCRIPT.gs` file
4. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID
5. Save the project
6. Deploy as Web App:
   - Click "Deploy" → "New Deployment"
   - Select "Type" → "Web app"
   - Execute as: Your account
   - Who has access: Anyone
   - Copy the Deployment URL

### Step 3: Create Your Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create new sheet: `Demo Class Registrations`
3. Add headers in row 1:
   - A: `Registration Date`
   - B: `Parent Name`
   - C: `Parent Email`
   - D: `Parent Phone`
   - E: `Student Name`
   - F: `Student Age`
   - G: `Preferred Date`
   - H: `Preferred Time`
   - I: `Interests`
   - J: `Message`
   - K: `Status`
   - L: `Booking ID`

4. Copy Sheet ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
   ```

### Step 4: Share Sheet with Service Account
1. Open your Google Sheet
2. Click "Share"
3. Find service account email in downloaded JSON (`client_email`)
4. Add with Editor access

### Step 5: Configure Environment Variable
Edit `.env.local` in project root:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb
```

Get `{DEPLOYMENT_ID}` from step 2's Deployment URL.

### Step 6: Test It!
1. Go to `http://localhost:3001/demo-booking`
2. Fill form and submit
3. Open your Google Sheet
4. **New row should appear automatically!** ✨

## What Happens on Form Submission

```
Student fills form
      ↓
    Submit
      ↓
[1] Save to Supabase ✅
      ↓
[2] Send email to admin ✅
      ↓
[3] Append to Google Sheet ✅
      ↓
Success page shown
```

## Troubleshooting

### Error: "Script parameter missing"
- Copy the full deployment URL including `userweb`
- Format should be: `https://script.google.com/macros/d/YOUR_ID/useweb`

### Error: "Sheet not found"
- Verify sheet name in Google Apps Script matches actual sheet tab
- Default: `Sheet1`

### No rows appearing in Google Sheet
1. Check browser console (F12 → Console)
2. Look for `[GoogleSheets]` messages
3. Verify service account has Editor access to sheet
4. Run test in Apps Script: Go to "testAppendRow" function and click Run

### Integration Not Configured Warning
- Verify `.env.local` has `VITE_GOOGLE_SCRIPT_URL` set
- Restart dev server after updating `.env.local`

## Files Created

- `GOOGLE_APPS_SCRIPT.gs` - Deploy this as a web app
- `src/services/googleSheetsService.ts` - Frontend integration service
- `.env.local` - Configuration file (create this)
- `GOOGLE_SHEETS_SETUP.md` - Detailed setup guide

## Important Security Notes

**For Production:**
- Store Google Apps Script URL in backend only
- Use OAuth2 instead of service account for production
- Implement rate limiting on the Apps Script
- Validate all incoming data

**Current Setup (Development):**
- Google Apps Script deployment is anonym public (anyone can POST)
- Add validation in Google Apps Script as shown
- Restrict Sheet sharing to trusted emails only

## Next Steps

After confirming it works:
1. ✅ Real-time Google Sheet tracking enabled
2. ✅ Export CSV backup still available
3. Optional: Add more columns to track additional data
4. Optional: Set up Google Sheet filters and pivot tables to analyze data

## Testing Checklist

- [ ] Created Google Cloud project
- [ ] Enabled Google Sheets API
- [ ] Created service account
- [ ] Downloaded JSON credentials
- [ ] Created/configured Google Sheet with headers
- [ ] Shared sheet with service account
- [ ] Created Google Apps Script project
- [ ] Copied code and set Sheet ID
- [ ] Deployed as Web App
- [ ] Added deployment URL to `.env.local`
- [ ] Restarted dev server
- [ ] Tested form submission
- [ ] Verified new row appears in Google Sheet

---

**Need help?** Check the browser console for detailed error messages when form is submitted.
