/**
 * This file defines the HoursOfService entity, which tracks a driver's working hours
 * to ensure compliance with safety regulations.
 */

/**
 * Error thrown when hours of service values are invalid
 */
export class InvalidHoursOfServiceError extends Error {
  constructor(message: string) {
    super(`Invalid hours of service: ${message}`);
    this.name = 'InvalidHoursOfServiceError';
  }
}

/**
 * HoursOfService entity tracks a driver's working hours to ensure compliance
 * with Department of Transportation (DOT) regulations.
 * 
 * These regulations limit the number of hours a commercial driver can work
 * to prevent fatigue-related accidents.
 */
export class HoursOfService {
  /**
   * Maximum allowed driving hours in a day according to regulations
   */
  static readonly MAX_DRIVING_HOURS_PER_DAY = 11;

  /**
   * Maximum allowed duty hours in a day according to regulations
   */
  static readonly MAX_DUTY_HOURS_PER_DAY = 14;

  /**
   * Required break time in hours
   */
  static readonly REQUIRED_BREAK_TIME = 0.5; // 30 minutes

  /**
   * Unique identifier for the hours of service record
   */
  id?: number;

  /**
   * Number of hours the driver has been driving today
   */
  drivingHoursToday: number;

  /**
   * Number of hours the driver has been on duty today (includes driving)
   */
  dutyHoursToday: number;

  /**
   * Time in hours until the driver needs to take a break
   */
  timeUntilBreakRequired: number;

  /**
   * ID of the driver these hours of service are associated with
   */
  driverId?: string;

  /**
   * Creates a new HoursOfService entity
   * 
   * @param drivingHoursToday Number of hours the driver has been driving today
   * @param dutyHoursToday Number of hours the driver has been on duty today
   * @param timeUntilBreakRequired Time until the driver needs to take a break
   * @param id Optional unique identifier
   * @param driverId Optional ID of the associated driver
   */
  private constructor(
    drivingHoursToday: number,
    dutyHoursToday: number,
    timeUntilBreakRequired: number,
    id?: number,
    driverId?: string,
  ) {
    this.drivingHoursToday = drivingHoursToday;
    this.dutyHoursToday = dutyHoursToday;
    this.timeUntilBreakRequired = timeUntilBreakRequired;
    
    if (id) {
      this.id = id;
    }
    
    if (driverId) {
      this.driverId = driverId;
    }
  }

  /**
   * Validates hours of service values
   * 
   * @param drivingHours Number of driving hours
   * @param dutyHours Number of duty hours
   * @param timeUntilBreak Time until break required
   * @throws InvalidHoursOfServiceError if any values are invalid
   */
  private static validateHours(
    drivingHours: number,
    dutyHours: number,
    timeUntilBreak: number
  ): void {
    if (drivingHours < 0) {
      throw new InvalidHoursOfServiceError('Driving hours cannot be negative');
    }
    
    if (dutyHours < 0) {
      throw new InvalidHoursOfServiceError('Duty hours cannot be negative');
    }
    
    if (timeUntilBreak < 0) {
      throw new InvalidHoursOfServiceError('Time until break cannot be negative');
    }
    
    if (drivingHours > dutyHours) {
      throw new InvalidHoursOfServiceError('Driving hours cannot exceed duty hours');
    }
    
    if (drivingHours > HoursOfService.MAX_DRIVING_HOURS_PER_DAY) {
      throw new InvalidHoursOfServiceError(`Driving hours cannot exceed ${HoursOfService.MAX_DRIVING_HOURS_PER_DAY} hours per day`);
    }
    
    if (dutyHours > HoursOfService.MAX_DUTY_HOURS_PER_DAY) {
      throw new InvalidHoursOfServiceError(`Duty hours cannot exceed ${HoursOfService.MAX_DUTY_HOURS_PER_DAY} hours per day`);
    }
  }

  /**
   * Factory method to create a HoursOfService from raw data
   * 
   * @param data Raw data to create the hours of service from
   * @returns A new HoursOfService instance
   * @throws InvalidHoursOfServiceError if any values are invalid
   */
  static create(data: {
    drivingHoursToday: number;
    dutyHoursToday: number;
    timeUntilBreakRequired: number;
    id?: number;
    driverId?: string;
  }): HoursOfService {
    // Validate the hours
    this.validateHours(
      data.drivingHoursToday,
      data.dutyHoursToday,
      data.timeUntilBreakRequired
    );
    
    return new HoursOfService(
      data.drivingHoursToday,
      data.dutyHoursToday,
      data.timeUntilBreakRequired,
      data.id,
      data.driverId,
    );
  }

  /**
   * Creates a new HoursOfService with default values (all zeros)
   * 
   * @param driverId ID of the driver
   * @returns A new HoursOfService instance with default values
   */
  static createDefault(driverId: string): HoursOfService {
    return new HoursOfService(
      0, // drivingHoursToday
      0, // dutyHoursToday
      HoursOfService.REQUIRED_BREAK_TIME, // timeUntilBreakRequired
      undefined, // id
      driverId,
    );
  }

  /**
   * Checks if the driver has reached the maximum allowed driving hours
   * 
   * @returns True if the driver has reached the maximum driving hours, false otherwise
   */
  hasReachedMaxDrivingHours(): boolean {
    return this.drivingHoursToday >= HoursOfService.MAX_DRIVING_HOURS_PER_DAY;
  }

  /**
   * Checks if the driver has reached the maximum allowed duty hours
   * 
   * @returns True if the driver has reached the maximum duty hours, false otherwise
   */
  hasReachedMaxDutyHours(): boolean {
    return this.dutyHoursToday >= HoursOfService.MAX_DUTY_HOURS_PER_DAY;
  }

  /**
   * Checks if the driver needs to take a break
   * 
   * @returns True if the driver needs to take a break, false otherwise
   */
  needsBreak(): boolean {
    return this.timeUntilBreakRequired <= 0;
  }

  /**
   * Gets the remaining driving hours for the day
   * 
   * @returns The number of driving hours remaining for the day
   */
  getRemainingDrivingHours(): number {
    return Math.max(0, HoursOfService.MAX_DRIVING_HOURS_PER_DAY - this.drivingHoursToday);
  }

  /**
   * Gets the remaining duty hours for the day
   * 
   * @returns The number of duty hours remaining for the day
   */
  getRemainingDutyHours(): number {
    return Math.max(0, HoursOfService.MAX_DUTY_HOURS_PER_DAY - this.dutyHoursToday);
  }

  /**
   * Updates the hours of service with time spent driving
   * 
   * @param hours Number of hours spent driving
   * @throws InvalidHoursOfServiceError if the update would result in invalid values
   */
  addDrivingTime(hours: number): void {
    if (hours < 0) {
      throw new InvalidHoursOfServiceError('Cannot add negative driving time');
    }
    
    const newDrivingHours = this.drivingHoursToday + hours;
    const newDutyHours = this.dutyHoursToday + hours;
    const newTimeUntilBreak = Math.max(0, this.timeUntilBreakRequired - hours);
    
    // Validate the new values
    HoursOfService.validateHours(newDrivingHours, newDutyHours, newTimeUntilBreak);
    
    this.drivingHoursToday = newDrivingHours;
    this.dutyHoursToday = newDutyHours;
    this.timeUntilBreakRequired = newTimeUntilBreak;
  }

  /**
   * Updates the hours of service with time spent on duty but not driving
   * 
   * @param hours Number of hours spent on duty but not driving
   * @throws InvalidHoursOfServiceError if the update would result in invalid values
   */
  addOnDutyTime(hours: number): void {
    if (hours < 0) {
      throw new InvalidHoursOfServiceError('Cannot add negative duty time');
    }
    
    const newDutyHours = this.dutyHoursToday + hours;
    
    // Validate the new values
    HoursOfService.validateHours(this.drivingHoursToday, newDutyHours, this.timeUntilBreakRequired);
    
    this.dutyHoursToday = newDutyHours;
  }

  /**
   * Records that the driver has taken a break
   * 
   * @param hours Length of the break in hours
   */
  takeBreak(hours: number): void {
    if (hours < 0) {
      throw new InvalidHoursOfServiceError('Break time cannot be negative');
    }
    
    // Reset the time until break is required
    this.timeUntilBreakRequired = HoursOfService.REQUIRED_BREAK_TIME;
  }

  /**
   * Resets the hours of service for a new day
   */
  resetForNewDay(): void {
    this.drivingHoursToday = 0;
    this.dutyHoursToday = 0;
    this.timeUntilBreakRequired = HoursOfService.REQUIRED_BREAK_TIME;
  }
}