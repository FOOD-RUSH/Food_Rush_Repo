import {
  formatCameroonTime,
  formatDateOnly,
  formatTimeOnly,
  parseISOToDate,
  parseISOToCameroonTime,
  getCurrentCameroonTime,
} from './timeUtils';

/**
 * Format a date string to a more readable format
 * @param dateString The date string to format
 * @param format The format to apply (defaults to MMM DD, h:mm a)
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, format?: string): string => {
  try {
    const date = parseISOToDate(dateString);

    // If no specific format is provided, use a default format
    if (!format) {
      return formatCameroonTime(date, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }

    // For custom formats, we'll use a combination of utilities
    // or implement custom formatting based on the requested format
    switch (format) {
      case 'MMM DD, h:mm a':
        return formatCameroonTime(date, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      case 'YYYY-MM-DD':
        return formatDateOnly(date).split('/').reverse().join('-'); // Convert DD/MM/YYYY to YYYY-MM-DD
      case 'DD/MM/YYYY':
        return formatDateOnly(date);
      case 'HH:mm':
        return formatTimeOnly(date);
      default:
        return formatCameroonTime(date);
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if formatting fails
  }
};

/**
 * Format a date object to a readable string
 * @param date The date object to format
 * @param options Intl.DateTimeFormatOptions for custom formatting
 * @returns Formatted date string
 */
export const formatDateFromObject = (
  date: Date,
  options?: Intl.DateTimeFormatOptions,
): string => {
  try {
    return formatCameroonTime(date, options);
  } catch (error) {
    console.error('Error formatting date from object:', error);
    return date.toString();
  }
};

/**
 * Get the current date string in Cameroon timezone
 * @returns Current date string in ISO format
 */
export const getCurrentDateISOString = (): string => {
  return getCurrentCameroonTime().toISOString();
};

/**
 * Check if a date string is today
 * @param dateString The date string to check
 * @returns True if the date is today, false otherwise
 */
export const isToday = (dateString: string): boolean => {
  try {
    const date = parseISOToDate(dateString);
    const today = getCurrentCameroonTime();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    console.error('Error checking if date is today:', error);
    return false;
  }
};

/**
 * Calculate the time difference between two dates
 * @param startDate The start date
 * @param endDate The end date
 * @returns Object with days, hours, minutes, and seconds difference
 */
export const getTimeDifference = (startDate: Date, endDate: Date) => {
  const diffMs = endDate.getTime() - startDate.getTime();

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

/**
 * Format a date to show time ago (e.g., "2 hours ago", "3 days ago")
 * @param dateString The date string to format
 * @returns Formatted "time ago" string
 */
export const formatTimeAgo = (dateString: string): string => {
  try {
    const date = parseISOToDate(dateString);
    const now = getCurrentCameroonTime();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) {
      return 'Just now';
    } else if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffSeconds / 86400);
      return `${days}d ago`;
    }
  } catch (error) {
    console.error('Error formatting time ago:', error);
    return dateString;
  }
};
