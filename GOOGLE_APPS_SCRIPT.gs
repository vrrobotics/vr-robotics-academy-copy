// ============================================
// GOOGLE APPS SCRIPT CODE
// Copy this entire code into Google Apps Script
// ============================================

// Configure these variables:
const SHEET_ID = "1juut8EDbgAkMgnE8uK9Z4Jffi8L21IRYbfns4bN6A5g"; // Replace with your Sheet ID
const SHEET_NAME = "Sheet1"; // The sheet tab name (default is "Sheet1")

/**
 * Handle GET requests (for testing/validation)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Google Apps Script is deployed and working correctly'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Main doPost function - receives data from the frontend
 * This allows POST requests from your website
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    
    if (payload.action === 'appendRow') {
      const result = appendBookingRow(payload.data);
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Append a single booking row to the Google Sheet
 */
function appendBookingRow(bookingData) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return {
        success: false,
        error: 'Sheet not found: ' + SHEET_NAME
      };
    }

    // Prepare the row data in the correct order
    const rowData = [
      bookingData.registrationDate || new Date().toLocaleDateString(),
      bookingData.parentName || '',
      bookingData.parentEmail || '',
      bookingData.parentPhone || '',
      bookingData.studentName || '',
      bookingData.studentAge || '',
      bookingData.preferredDate || '',
      bookingData.preferredTime || '',
      bookingData.interests || '',
      bookingData.message || '',
      bookingData.status || 'scheduled',
      bookingData.bookingId || ''
    ];

    // Append the row
    sheet.appendRow(rowData);

    Logger.log('Successfully appended row:', rowData);
    return {
      success: true,
      message: 'Booking appended successfully'
    };
  } catch (error) {
    Logger.log('Error appending row:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test function - run this in Apps Script editor to verify setup
 * Go to Run → Run function → testAppendRow
 */
function testAppendRow() {
  const testData = {
    registrationDate: new Date().toLocaleDateString(),
    parentName: 'Test Parent',
    parentEmail: 'test@example.com',
    parentPhone: '+91 98765 43210',
    studentName: 'Test Student',
    studentAge: 12,
    preferredDate: '2026-02-20',
    preferredTime: 'Afternoon (12PM - 3PM)',
    interests: 'Robotics, AI',
    message: 'This is a test booking',
    status: 'scheduled',
    bookingId: 'test1234'
  };

  const result = appendBookingRow(testData);
  Logger.log('Test result:', result);
  return result;
}

/**
 * Optional: Get all bookings from the sheet
 */
function getAllBookings() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  return {
    headers: data[0],
    rows: data.slice(1),
    total: data.length - 1
  };
}
