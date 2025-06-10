/**
 * This file defines the EmergencyContact entity, which represents a person to contact
 * in case of an emergency involving a driver.
 */

/**
 * EmergencyContact entity represents a person who should be contacted
 * in case of an emergency involving the driver.
 */
export class EmergencyContact {
  /**
   * Unique identifier for the emergency contact
   */
  id?: number;

  /**
   * Name of the emergency contact person
   */
  name: string;

  /**
   * Relationship of the contact to the driver (e.g., spouse, parent, friend)
   */
  relationship: string;

  /**
   * Phone number of the emergency contact
   */
  phone: string;

  /**
   * ID of the driver this emergency contact is associated with
   */
  driverId?: string;

  /**
   * Creates a new EmergencyContact entity
   * 
   * @param name Name of the emergency contact person
   * @param relationship Relationship to the driver
   * @param phone Phone number of the emergency contact
   * @param id Optional unique identifier
   * @param driverId Optional ID of the associated driver
   */
  constructor(
    name: string,
    relationship: string,
    phone: string,
    id?: number,
    driverId?: string,
  ) {
    this.name = name;
    this.relationship = relationship;
    this.phone = phone;
    
    if (id) {
      this.id = id;
    }
    
    if (driverId) {
      this.driverId = driverId;
    }
  }

  /**
   * Factory method to create an EmergencyContact from raw data
   * 
   * @param data Raw data to create the emergency contact from
   * @returns A new EmergencyContact instance
   */
  static create(data: {
    name: string;
    relationship: string;
    phone: string;
    id?: number;
    driverId?: string;
  }): EmergencyContact {
    return new EmergencyContact(
      data.name,
      data.relationship,
      data.phone,
      data.id,
      data.driverId,
    );
  }

  /**
   * Validates that the emergency contact has all required information
   * 
   * @returns True if the emergency contact is valid, false otherwise
   */
  isValid(): boolean {
    return Boolean(
      this.name && 
      this.relationship && 
      this.phone && 
      this.phone.length >= 10
    );
  }

  /**
   * Updates the emergency contact information
   * 
   * @param data New data for the emergency contact
   */
  update(data: Partial<EmergencyContact>): void {
    if (data.name) {
      this.name = data.name;
    }
    
    if (data.relationship) {
      this.relationship = data.relationship;
    }
    
    if (data.phone) {
      this.phone = data.phone;
    }
  }
}