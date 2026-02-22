/**
 * Date Normalization Utilities - Meeting Date Handling
 * 
 * STRATEGY:
 * - Store: User-selected date → UTC midnight (00:00:00 UTC)
 * - Display: UTC midnight → User's local date
 * 
 * This ensures meetings always appear on the correct calendar day
 * regardless of the user's timezone (IST, UTC, PST, etc.)
 */

/**
 * Convert user-selected local date to UTC midnight for storage
 * 
 * Example:
 * - User selects: December 8, 2025 (in IST)
 * - Stored as: 2025-12-08T00:00:00Z (UTC midnight)
 * - When displayed in IST: Shows as December 8 ✓
 * - When displayed in UTC: Shows as December 8 ✓
 * - When displayed in PST: Shows as December 8 ✓
 * 
 * @param localDate - User-selected date (in local timezone)
 * @returns ISO DateTime string at UTC midnight
 */
export function convertLocalDateToUTCMidnight(localDate: Date | string | undefined): string {
  if (!localDate) {
    return new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())).toISOString();
  }

  const date = typeof localDate === 'string' ? new Date(localDate) : localDate;
  
  if (isNaN(date.getTime())) {
    console.warn('[convertLocalDateToUTCMidnight] Invalid date provided:', localDate);
    return new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())).toISOString();
  }

  // Get the local date components
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // Create UTC midnight for that local date
  const utcMidnight = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

  return utcMidnight.toISOString();
}

/**
 * Convert UTC midnight to user's local date for display
 * 
 * @param utcDateTime - ISO DateTime string (stored as UTC midnight)
 * @returns Local Date object representing the calendar day
 */
export function convertUTCToLocalDate(utcDateTime: Date | string | undefined): Date | null {
  if (!utcDateTime) return null;

  const dateObj = typeof utcDateTime === 'string' ? new Date(utcDateTime) : utcDateTime;
  
  if (isNaN(dateObj.getTime())) {
    console.warn('[convertUTCToLocalDate] Invalid date provided:', utcDateTime);
    return null;
  }

  // The stored date is UTC midnight, but we need to display it as the local date
  // Create a new date with the UTC components interpreted as local time
  const utcYear = dateObj.getUTCFullYear();
  const utcMonth = dateObj.getUTCMonth();
  const utcDay = dateObj.getUTCDate();
  const utcHours = dateObj.getUTCHours();
  const utcMinutes = dateObj.getUTCMinutes();
  const utcSeconds = dateObj.getUTCSeconds();

  // Return as local date (browser will interpret UTC components as local)
  return new Date(utcYear, utcMonth, utcDay, utcHours, utcMinutes, utcSeconds);
}

/**
 * Combine local date and time, then convert to UTC midnight for storage
 * 
 * @param dateStr - Date string (YYYY-MM-DD) in local timezone
 * @param timeStr - Time string (HH:mm) in local timezone
 * @returns ISO DateTime string at UTC midnight (date only, time ignored for storage)
 */
export function combineDateAndTimeToUTC(dateStr: string, timeStr: string): string {
  if (!dateStr) {
    return convertLocalDateToUTCMidnight(new Date());
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);

  // Store as UTC midnight (time is ignored for meeting date storage)
  return convertLocalDateToUTCMidnight(localDate);
}

/**
 * Extract date portion from stored UTC DateTime
 * Returns the local date that was stored
 * 
 * @param utcDateTime - ISO DateTime string (UTC midnight)
 * @returns Date string (YYYY-MM-DD)
 */
export function extractLocalDateFromUTC(utcDateTime: Date | string | undefined): string {
  if (!utcDateTime) return '';

  const localDate = convertUTCToLocalDate(utcDateTime);
  if (!localDate) return '';

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Extract time portion from DateTime
 * 
 * @param dateTime - ISO DateTime string
 * @returns Time string (HH:mm)
 */
export function extractTimeFromDateTime(dateTime: Date | string | undefined): string {
  if (!dateTime) return '';

  const dateObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  
  if (isNaN(dateObj.getTime())) {
    console.warn('[extractTimeFromDateTime] Invalid date provided:', dateTime);
    return '';
  }

  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

/**
 * Format UTC date for display (shows the local date)
 * 
 * @param utcDateTime - ISO DateTime string (UTC midnight)
 * @param format - Format type ('full', 'short', 'date-only')
 * @returns Formatted date string
 */
export function formatDateForDisplay(
  utcDateTime: Date | string | undefined,
  format: 'full' | 'short' | 'date-only' = 'full'
): string {
  const localDate = convertUTCToLocalDate(utcDateTime);
  if (!localDate) return '';

  switch (format) {
    case 'full':
      return localDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'short':
      return localDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    case 'date-only':
      return localDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    default:
      return localDate.toISOString();
  }
}

/**
 * Check if two UTC dates represent the same calendar day
 * 
 * @param utcDate1 - First UTC DateTime string
 * @param utcDate2 - Second UTC DateTime string
 * @returns True if both represent the same local calendar day
 */
export function isSameDay(
  utcDate1: Date | string | undefined,
  utcDate2: Date | string | undefined
): boolean {
  const d1 = convertUTCToLocalDate(utcDate1);
  const d2 = convertUTCToLocalDate(utcDate2);

  if (!d1 || !d2) return false;

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Check if a UTC date is in the future (compared to now)
 * 
 * @param utcDateTime - ISO DateTime string (UTC midnight)
 * @returns True if the date is in the future
 */
export function isDateInFuture(utcDateTime: Date | string | undefined): boolean {
  const localDate = convertUTCToLocalDate(utcDateTime);
  if (!localDate) return false;

  const now = new Date();
  return localDate > now;
}

/**
 * Check if a UTC date is in the past (compared to now)
 * 
 * @param utcDateTime - ISO DateTime string (UTC midnight)
 * @returns True if the date is in the past
 */
export function isDateInPast(utcDateTime: Date | string | undefined): boolean {
  const localDate = convertUTCToLocalDate(utcDateTime);
  if (!localDate) return false;

  const now = new Date();
  return localDate < now;
}

/**
 * Get today's date as UTC midnight
 * 
 * @returns ISO DateTime string at UTC midnight for today
 */
export function getTodayAsUTC(): string {
  return convertLocalDateToUTCMidnight(new Date());
}

/**
 * Compare two UTC dates
 * Returns: -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 * 
 * @param utcDate1 - First UTC DateTime string
 * @param utcDate2 - Second UTC DateTime string
 * @returns Comparison result
 */
export function compareDates(
  utcDate1: Date | string | undefined,
  utcDate2: Date | string | undefined
): number {
  const d1 = convertUTCToLocalDate(utcDate1);
  const d2 = convertUTCToLocalDate(utcDate2);

  if (!d1 || !d2) return 0;

  const time1 = d1.getTime();
  const time2 = d2.getTime();

  if (time1 < time2) return -1;
  if (time1 > time2) return 1;
  return 0;
}
