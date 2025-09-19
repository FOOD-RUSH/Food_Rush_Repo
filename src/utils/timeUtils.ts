/**
 * Utility functions for handling time in Cameroon timezone (WAT - UTC+1)
 * and ISO 8601 formatting for backend communication
 */

export const CAMEROON_TIMEZONE = 'Africa/Douala';

/**
 * Get current time in Cameroon timezone
 */
export const getCurrentCameroonTime = (): Date => {
  try {
    const now = new Date();
    const cameroonTime = new Date(now.toLocaleString("en-US", { timeZone: CAMEROON_TIMEZONE }));
    
    // Validate the created date
    if (isNaN(cameroonTime.getTime())) {
      console.warn('Invalid Cameroon time created, falling back to current time');
      return now;
    }
    
    return cameroonTime;
  } catch (error) {
    console.error('Error getting Cameroon time:', error);
    return new Date(); // Fallback to current time
  }
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
 * Safely extract hour and minute from a Date object
 */
export const safeExtractTime = (date: Date): { hour: number; minute: number } | null => {
  try {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return null;
    }
    
    const hour = date.getHours();
    const minute = date.getMinutes();
    
    // Validate extracted values
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return null;
    }
    
    return { hour, minute };
  } catch (error) {
    console.error('Error extracting time from date:', error);
    return null;
  }
};

/**
 * Create ISO string for daily scheduling with a future date and specified time
 * Backend expects format like: 2025-08-13T06:00:00Z
 */
export const createDailyScheduleISO = (hour: number, minute: number): string => {
  // Validate input parameters
  if (typeof hour !== 'number' || typeof minute !== 'number') {
    throw new Error('Hour and minute must be numbers');
  }
  
  if (isNaN(hour) || isNaN(minute)) {
    throw new Error('Hour and minute cannot be NaN');
  }
  
  if (hour < 0 || hour > 23) {
    throw new Error('Hour must be between 0 and 23');
  }
  
  if (minute < 0 || minute > 59) {
    throw new Error('Minute must be between 0 and 59');
  }
  
  try {
    // Create a date in the future (next year) to ensure it's valid for scheduling
    const currentYear = new Date().getFullYear();
    const futureYear = currentYear + 1;
    
    // Use August 13th as a standard date (like the example: 2025-08-13T06:00:00Z)
    const scheduleDate = new Date(Date.UTC(futureYear, 7, 13, hour, minute, 0, 0)); // Month 7 = August
    
    // Validate the created date
    if (isNaN(scheduleDate.getTime())) {
      throw new Error('Invalid date created');
    }
    
    return scheduleDate.toISOString();
  } catch (error) {
    console.error('Error creating daily schedule ISO:', { hour, minute, error });
    throw new Error(`Failed to create daily schedule: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Create ISO string for daily scheduling from a Date object (safer version)
 * This creates a standardized future date with the time from the input date
 */
export const createDailyScheduleISOFromDate = (date: Date): string | null => {
  const timeData = safeExtractTime(date);
  if (!timeData) {
    return null;
  }
  
  try {
    return createDailyScheduleISO(timeData.hour, timeData.minute);
  } catch (error) {
    console.error('Error creating daily schedule ISO from date:', error);
    return null;
  }
};

/**
 * Create ISO string for time-only scheduling (for menu item availability)
 * Creates a standardized date with the specified time for backend compatibility
 */
export const createTimeOnlyISO = (hour: number, minute: number): string => {
  // Validate input parameters
  if (typeof hour !== 'number' || typeof minute !== 'number') {
    throw new Error('Hour and minute must be numbers');
  }
  
  if (isNaN(hour) || isNaN(minute)) {
    throw new Error('Hour and minute cannot be NaN');
  }
  
  if (hour < 0 || hour > 23) {
    throw new Error('Hour must be between 0 and 23');
  }
  
  if (minute < 0 || minute > 59) {
    throw new Error('Minute must be between 0 and 59');
  }
  
  try {
    // Create a standardized UTC date for time representation
    // Using a fixed date (2025-08-13) to match backend expectations
    const scheduleDate = new Date(Date.UTC(2025, 7, 13, hour, minute, 0, 0)); // Month 7 = August
    
    // Validate the created date
    if (isNaN(scheduleDate.getTime())) {
      throw new Error('Invalid date created');
    }
    
    return scheduleDate.toISOString();
  } catch (error) {
    console.error('Error creating time-only ISO:', { hour, minute, error });
    throw new Error(`Failed to create time ISO: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Create time-only ISO string from a Date object
 */
export const createTimeOnlyISOFromDate = (date: Date): string | null => {
  const timeData = safeExtractTime(date);
  if (!timeData) {
    return null;
  }
  
  try {
    return createTimeOnlyISO(timeData.hour, timeData.minute);
  } catch (error) {
    console.error('Error creating time-only ISO from date:', error);
    return null;
  }
};

/**
 * Test function to verify time format generation
 * This will log examples of the generated format
 */
export const testTimeFormat = () => {
  console.log('Testing time format generation:');
  
  // Test with 6:00 AM (like the example: 2025-08-13T06:00:00Z)
  const morning = createTimeOnlyISO(6, 0);
  console.log('6:00 AM =>', morning);
  
  // Test with 2:30 PM
  const afternoon = createTimeOnlyISO(14, 30);
  console.log('2:30 PM =>', afternoon);
  
  // Test with 11:59 PM
  const night = createTimeOnlyISO(23, 59);
  console.log('11:59 PM =>', night);
  
  return { morning, afternoon, night };
};