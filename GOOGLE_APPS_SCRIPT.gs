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

function doPost(e) {
  try {
    Logger.log('[GAS] ===== POST REQUEST RECEIVED =====');
    Logger.log('[GAS] Raw payload:', e.postData.contents);
    
    const payload = JSON.parse(e.postData.contents);
    Logger.log('[GAS] Parsed payload:', payload);
    Logger.log('[GAS] Action:', payload.action);
    
    if (payload.action === 'appendRow') {
      Logger.log('[GAS] Processing appendRow action');
      const result = appendBookingRow(payload.data);
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (payload.action === 'appendPricingEnrollment') {
      Logger.log('[GAS] Processing appendPricingEnrollment action');
      Logger.log('[GAS] Enrollment data:', payload.data);
      const result = appendPricingEnrollment(payload.data);
      Logger.log('[GAS] Result:', result);
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    Logger.log('[GAS] Unknown action:', payload.action);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('[GAS] ERROR in doPost:', error);
    Logger.log('[GAS] Error message:', error.toString());
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
 * Append a pricing program enrollment to a dedicated sheet
 * Creates/appends to "Session Enrollments" sheet
 */
function appendPricingEnrollment(enrollmentData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName('Session Enrollments');
    
    // Create the sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Session Enrollments');
      
      // Add headers
      const headers = [
        'Enrollment Date',
        'Student Name',
        'Student Email',
        'Student Phone',
        'Plan Name',
        'Billing Mode',
        'Amount (USD)',
        'Payment ID',
        'Status'
      ];
      sheet.appendRow(headers);
    }

    // Prepare the row data
    const rowData = [
      enrollmentData.enrollmentDate || new Date().toLocaleDateString(),
      enrollmentData.studentName || '',
      enrollmentData.studentEmail || '',
      enrollmentData.studentPhone || '',
      enrollmentData.planName || '',
      enrollmentData.billingMode || '',
      enrollmentData.amount || 0,
      enrollmentData.paymentId || '',
      enrollmentData.status || 'completed'
    ];

    // Append the row
    sheet.appendRow(rowData);

    Logger.log('Successfully appended pricing enrollment:', rowData);
    return {
      success: true,
      message: 'Pricing enrollment appended successfully'
    };
  } catch (error) {
    Logger.log('Error appending pricing enrollment:', error);
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
