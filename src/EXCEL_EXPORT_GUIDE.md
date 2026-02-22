# Demo Bookings Excel Export - Setup Guide

## Overview
Automatically export demo class registrations to Excel. All data is private to your personal use.

## How It Works

### Manual Export
1. Go to **`http://localhost:3001/demo-bookings-export`** (or your deployed site)
2. Click **"Download Excel (CSV)"**
3. Opens in Microsoft Excel, Google Sheets, or any spreadsheet application
4. File is downloaded with today's date: `Demo-Bookings-2026-02-14.csv`

### Auto-Export (Optional)
1. On the export page, toggle **"Enable automatic exports"**
2. Select frequency:
   - Every 1 hour
   - Every 4 hours
   - Every 8 hours
   - Every 24 hours (recommended)
   - Every 3 days

3. Your browser will automatically export data at the selected interval
4. Files are saved locally in your downloads folder

## What Data Is Exported?

Each row contains:
- **Date Registered** - When they signed up
- **Parent Name** - Guardian/parent name
- **Parent Email** - Contact email
- **Parent Phone** - Contact phone
- **Student Name** - Child's name
- **Student Age** - Child's age
- **Preferred Date** - Requested demo date
- **Preferred Time** - Requested time slot
- **Interests** - Student's interests (robotics, AI, etc)
- **Message** - Any additional notes
- **Assigned Teacher** - Teacher ID (if assigned)
- **Status** - Booking status (pending/completed)
- **Booking ID** - Unique identifier

## Using the Exported File

### Open in Excel
1. Download the CSV file
2. Right-click → "Open with" → Microsoft Excel
3. OR: File → Open → Select CSV file

### Open in Google Sheets
1. Download the CSV file
2. Go to [Google Sheets](https://sheets.google.com)
3. Click **"+ New"** → **"File upload"**
4. Select your CSV file
5. Data auto-imports into a spreadsheet

### Open in Excel Online
1. Download the CSV file
2. Go to [Excel Online](https://office.com)
3. Click **"Upload"** in the toolbar
4. Select your CSV file

## Privacy & Security

✅ **For Personal Use Only**
- Data is not shared with anyone
- Exports are stored locally on your device
- No cloud upload unless you choose to share

✅ **Automatic Backups**
- Browser auto-saves to localStorage
- Available even if offline
- Syncs when reconnected

## Features

### Status Cards
Shows:
- Total number of bookings
- Last export date/time
- Auto-export status

### Recent Bookings Preview
- View latest 10 bookings in table format
- Shows Student, Parent, Email, Date, Status
- Download to see all records

### Auto-Export Settings
- Enable/disable with toggle
- Adjust frequency anytime
- Settings persist in browser storage

## Troubleshooting

### Not seeing any bookings?
- Sign up for a demo first at `/demo-booking`
- Wait a few seconds then refresh the export page
- Check browser console for errors (F12)

### File not downloading?
- Check browser download settings
- Ensure pop-ups aren't blocked for your site
- Try a different browser
- Check file permissions on your device

### Auto-export not working?
- Keep the browser/tab open during export
- Check browser's background task settings
- Verify localStorage is enabled
- Check if there's a notification about background activity

## Next Steps

### Manually Add to Excel Workbook
1. Download CSV from export page
2. Open your Excel template/workbook
3. Go to **"Data"** tab
4. Click **"From Text/CSV"**
5. Select downloaded file
6. Click **"Load"** or **"Transform"**

### Set Up Scheduled Downloads
1. Enable auto-export on the page
2. Select **"Every 24 hours"** (daily)
3. Keep browser tab open in background
4. Or use browser's scheduled tasks extension

### Integrate with External Tools
The CSV can be imported into:
- **Zapier** - Automate workflows
- **Make.com** - Connect to CRM
- **Airtable** - Sync to database
- **Power Automate** - Microsoft automation
- **IFTTT** - Simple automations

## Chrome Extension Setup (Advanced)

For hands-off automation, use a browser extension:
1. Install [Web Scraper](https://chrome.google.com/webstore) or [Scheduled Tab Opener](https://chrome.google.com/webstore)
2. Configure to visit `/dem o-bookings-export` hourly
3. Script automatically downloads file
4. Files sync to Google Drive with another extension

## Support

For issues or feature requests:
- Check browser console (F12) for errors
- Ensure JavaScript is enabled
- Clear browser cache and reload
- Try incognito/private mode
- Check if localStorage quota is exceeded

---

**Last Updated:** Feb 14, 2026
**Version:** 1.0
