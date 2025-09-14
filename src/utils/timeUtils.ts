/**
 * Utility functions for handling time in Cameroon timezone (WAT - UTC+1)
 * and ISO 8601 formatting for backend communication
 */

export const CAMEROON_TIMEZONE = 'Africa/Douala';

/**
 * Get current time in Cameroon timezone
 */
export const getCurrentCameroonTime = (): Date => {
  const now = new Date();
  const cameroonTime = new Date(now.toLocaleString("en-US", { timeZone: CAMEROON_TIMEZONE }));
  return cameroonTime;
};

/**
 * Convert a date to ISO 8601 string format for backend
 */
export const toISOString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Format date for display in Cameroon timezone
 */
export const formatCameroonTime = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: CAMEROON_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  return date.toLocaleString('fr-FR', { ...defaultOptions, ...options });
};

/**
 * Format time only for display
 */
export const formatTimeOnly = (date: Date): string => {
  return date.toLocaleString('fr-FR', {
    timeZone: CAMEROON_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

/**
 * Format date only for display
 */
export const formatDateOnly = (date: Date): string => {
  return date.toLocaleString('fr-FR', {
    timeZone: CAMEROON_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Create a date with specific time in Cameroon timezone
 */
export const createCameroonDateTime = (year: number, month: number, day: number, hour: number, minute: number): Date => {
  // Create date in local time first
  const date = new Date(year, month - 1, day, hour, minute);
  
  // Adjust for Cameroon timezone (UTC+1)
  const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
  const cameroonTime = new Date(utcTime + (1 * 3600000)); // UTC+1
  
  return cameroonTime;
};

/**
 * Parse ISO string and convert to Cameroon time for display
 */
export const parseISOToCameroonTime = (isoString: string): Date => {
  const date = new Date(isoString);
  return new Date(date.toLocaleString("en-US", { timeZone: CAMEROON_TIMEZONE }));
};

/**
 * Get minimum delivery time (30 minutes from now in Cameroon time)
 */
export const getMinimumDeliveryTime = (): Date => {
  const now = getCurrentCameroonTime();
  return new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes ahead
};

/**
 * Check if a time is in the past (Cameroon timezone)
 */
export const isTimeInPast = (date: Date): boolean => {
  const now = getCurrentCameroonTime();
  return date < now;
};

/**
 * Convert time to 24-hour format string for backend
 */
export const timeToString = (date: Date): string => {
  return date.toLocaleTimeString('en-GB', {
    timeZone: CAMEROON_TIMEZONE,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Create ISO string for daily scheduling (today's date with specified time)
 */
export const createDailyScheduleISO = (hour: number, minute: number): string => {
  const today = getCurrentCameroonTime();
  const scheduleDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minute);
  return scheduleDate.toISOString();
};