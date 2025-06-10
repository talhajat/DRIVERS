/**
 * This file defines the DriverStatus enum, which represents the current operational
 * status of a driver in the system.
 */

/**
 * DriverStatus represents the current operational status of a driver.
 * This helps dispatchers and managers know what each driver is currently doing
 * and whether they are available for new assignments.
 */
export enum DriverStatus {
  /**
   * Driver is available for new assignments
   */
  AVAILABLE = 'available',

  /**
   * Driver is currently driving a vehicle
   */
  DRIVING = 'driving',

  /**
   * Driver is taking a break (meal, rest, etc.)
   */
  ON_BREAK = 'on-break',

  /**
   * Driver is loading cargo
   */
  LOADING = 'loading',

  /**
   * Driver is unloading cargo
   */
  UNLOADING = 'unloading',

  /**
   * Driver is dealing with vehicle maintenance
   */
  MAINTENANCE = 'maintenance',

  /**
   * Driver is away (vacation, sick leave, etc.)
   */
  AWAY = 'away',

  /**
   * Driver is off duty (not working)
   */
  OFF_DUTY = 'off-duty',
}

/**
 * Helper functions for working with driver statuses
 */
export class DriverStatusHelper {
  /**
   * Checks if a driver status allows the driver to be assigned to a new load
   * 
   * @param status The driver status to check
   * @returns True if the driver can be assigned to a new load, false otherwise
   */
  static canBeAssigned(status: DriverStatus): boolean {
    return status === DriverStatus.AVAILABLE;
  }

  /**
   * Gets a human-readable description of a driver status
   * 
   * @param status The driver status
   * @returns A human-readable description of the status
   */
  static getDescription(status: DriverStatus): string {
    const descriptions: Record<DriverStatus, string> = {
      [DriverStatus.AVAILABLE]: 'Available for assignment',
      [DriverStatus.DRIVING]: 'Currently driving',
      [DriverStatus.ON_BREAK]: 'Taking a break',
      [DriverStatus.LOADING]: 'Loading cargo',
      [DriverStatus.UNLOADING]: 'Unloading cargo',
      [DriverStatus.MAINTENANCE]: 'Handling maintenance',
      [DriverStatus.AWAY]: 'Away (not working)',
      [DriverStatus.OFF_DUTY]: 'Off duty',
    };
    
    return descriptions[status] || 'Unknown status';
  }

  /**
   * Gets all available driver statuses
   * 
   * @returns An array of all driver statuses
   */
  static getAllStatuses(): DriverStatus[] {
    return Object.values(DriverStatus);
  }

  /**
   * Gets all active driver statuses (statuses where the driver is working)
   * 
   * @returns An array of active driver statuses
   */
  static getActiveStatuses(): DriverStatus[] {
    return [
      DriverStatus.AVAILABLE,
      DriverStatus.DRIVING,
      DriverStatus.LOADING,
      DriverStatus.UNLOADING,
      DriverStatus.MAINTENANCE,
    ];
  }

  /**
   * Gets all inactive driver statuses (statuses where the driver is not working)
   * 
   * @returns An array of inactive driver statuses
   */
  static getInactiveStatuses(): DriverStatus[] {
    return [
      DriverStatus.ON_BREAK,
      DriverStatus.AWAY,
      DriverStatus.OFF_DUTY,
    ];
  }
}