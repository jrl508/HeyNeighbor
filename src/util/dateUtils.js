import { format, formatDistanceToNow, isToday, isYesterday, isThisYear, parseISO } from 'date-fns';

/**
 * Returns a human-readable relative or absolute string for messages.
 * Standards:
 * - < 1 min: "Just now"
 * - Today: "4:30 PM"
 * - Yesterday: "Yesterday"
 * - This week: "Tuesday"
 * - This year: "May 15"
 * - Older: "May 15, 2025"
 */
export const formatMessageTimestamp = (dateInput) => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;

  if (isToday(date)) {
    return format(date, 'p'); // e.g., 4:30 PM
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  if (isThisYear(date)) {
    return format(date, 'MMM d'); // e.g., May 15
  }
  return format(date, 'MMM d, yyyy'); // e.g., May 15, 2025
};

/**
 * Formats a date for display in lists/forms (e.g., May 18, 2026)
 */
export const formatDisplayDate = (dateInput) => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  return format(date, 'PP'); // May 18, 2026
};

/**
 * Formats a date for API consumption (YYYY-MM-DD)
 */
export const formatApiDate = (dateInput) => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  return format(date, 'yyyy-MM-dd');
};

/**
 * Returns relative time (e.g., "5 minutes ago")
 */
export const formatRelativeTime = (dateInput) => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  return formatDistanceToNow(date, { addSuffix: true });
};

/**
 * Formats date and time for activity logs (e.g., May 18, 4:30 PM)
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  return format(date, 'MMM d, p');
};
