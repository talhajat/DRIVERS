/**
 * This file defines the Endorsement entity, which represents a special qualification
 * or permission on a driver's commercial license.
 */

/**
 * Error thrown when an invalid endorsement type is provided
 */
export class InvalidEndorsementTypeError extends Error {
  constructor(type: string) {
    super(`Invalid endorsement type: ${type}`);
    this.name = 'InvalidEndorsementTypeError';
  }
}

/**
 * Endorsement entity represents a special qualification or permission
 * that a driver has on their commercial driver's license.
 * 
 * Examples of endorsements include:
 * - H: Hazardous Materials
 * - N: Tank Vehicles
 * - P: Passenger Transport
 * - S: School Bus
 * - T: Double/Triple Trailers
 * - X: Combination of Tank Vehicle and Hazardous Materials
 */
export class Endorsement {
  /**
   * List of valid endorsement types according to CDL standards
   */
  static readonly VALID_TYPES = ['H', 'N', 'P', 'S', 'T', 'X'];

  /**
   * Descriptions of each endorsement type
   */
  static readonly TYPE_DESCRIPTIONS: Record<string, string> = {
    'H': 'Hazardous Materials',
    'N': 'Tank Vehicles',
    'P': 'Passenger Transport',
    'S': 'School Bus',
    'T': 'Double/Triple Trailers',
    'X': 'Combination of Tank Vehicle and Hazardous Materials',
  };

  /**
   * Unique identifier for the endorsement
   */
  id?: number;

  /**
   * Type of endorsement (e.g., H, N, P, S, T, X)
   */
  type: string;

  /**
   * Date when the endorsement expires (if applicable)
   */
  expiryDate?: Date;

  /**
   * ID of the driver this endorsement is associated with
   */
  driverId?: string;

  /**
   * Creates a new Endorsement entity
   * 
   * @param type Type of endorsement
   * @param expiryDate Optional date when the endorsement expires
   * @param id Optional unique identifier
   * @param driverId Optional ID of the associated driver
   */
  private constructor(
    type: string,
    expiryDate?: Date,
    id?: number,
    driverId?: string,
  ) {
    this.type = type;
    
    if (expiryDate) {
      this.expiryDate = expiryDate;
    }
    
    if (id) {
      this.id = id;
    }
    
    if (driverId) {
      this.driverId = driverId;
    }
  }

  /**
   * Validates that the endorsement type is valid
   * 
   * @param type The endorsement type to validate
   * @throws InvalidEndorsementTypeError if the type is invalid
   */
  private static validateType(type: string): void {
    // Convert to uppercase for case-insensitive comparison
    const upperType = type.toUpperCase();
    
    if (!Endorsement.VALID_TYPES.includes(upperType)) {
      throw new InvalidEndorsementTypeError(type);
    }
  }

  /**
   * Factory method to create an Endorsement from raw data
   * 
   * @param data Raw data to create the endorsement from
   * @returns A new Endorsement instance
   * @throws InvalidEndorsementTypeError if the endorsement type is invalid
   */
  static create(data: {
    type: string;
    expiryDate?: Date;
    id?: number;
    driverId?: string;
  }): Endorsement {
    // Validate the endorsement type
    this.validateType(data.type);
    
    // Convert to uppercase for consistency
    const upperType = data.type.toUpperCase();
    
    return new Endorsement(
      upperType,
      data.expiryDate,
      data.id,
      data.driverId,
    );
  }

  /**
   * Checks if the endorsement is expired
   * 
   * @returns True if the endorsement is expired, false otherwise or if no expiry date
   */
  isExpired(): boolean {
    if (!this.expiryDate) {
      return false;
    }
    
    return new Date() > this.expiryDate;
  }

  /**
   * Gets the description of the endorsement type
   * 
   * @returns A human-readable description of the endorsement
   */
  getDescription(): string {
    return Endorsement.TYPE_DESCRIPTIONS[this.type] || `Endorsement ${this.type}`;
  }

  /**
   * Updates the endorsement information
   * 
   * @param data New data for the endorsement
   * @throws InvalidEndorsementTypeError if the new type is invalid
   */
  update(data: Partial<Endorsement>): void {
    if (data.type) {
      // Validate the new type
      Endorsement.validateType(data.type);
      this.type = data.type.toUpperCase();
    }
    
    if (data.expiryDate) {
      this.expiryDate = data.expiryDate;
    }
  }
}