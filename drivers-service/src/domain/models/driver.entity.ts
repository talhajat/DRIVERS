/**
 * This file defines the Driver entity, which is the core business object in our domain.
 * It represents a truck driver with all their personal and professional information.
 */

import { DriverStatus } from './driver-status.enum';
import { EmergencyContact } from './emergency-contact.entity';
import { Endorsement } from './endorsement.entity';
import { Document } from './document.entity';
import { HoursOfService } from './hours-of-service.entity';

/**
 * Error thrown when driver data is invalid
 */
export class InvalidDriverDataError extends Error {
  constructor(message: string) {
    super(`Invalid driver data: ${message}`);
    this.name = 'InvalidDriverDataError';
  }
}

/**
 * Represents the different types of drivers in the system
 */
export enum DriverType {
  COMPANY = 'company',
  OWNER_OPERATOR = 'owner_operator',
  LEASE_PURCHASE = 'lease_purchase',
}

/**
 * Represents the different employment statuses a driver can have
 */
export enum EmploymentStatus {
  ACTIVE = 'active',
  LEAVE = 'leave',
  TERMINATED = 'terminated',
}

/**
 * Driver entity represents a truck driver in our system.
 * It contains all the driver's information and business rules related to drivers.
 */
export class Driver {
  /**
   * Unique identifier for the driver
   */
  id: string;

  /**
   * Driver's first name
   */
  firstName: string;

  /**
   * Driver's last name
   */
  lastName: string;

  /**
   * Employee ID (can be auto-generated)
   */
  driverId?: string;

  /**
   * Driver's date of birth
   */
  dob: Date;

  /**
   * Driver's Social Security Number (optional for privacy/security)
   */
  ssn?: string;

  /**
   * Driver's primary phone number
   */
  phonePrimary: string;

  /**
   * Driver's secondary phone number (optional)
   */
  phoneSecondary?: string;

  /**
   * Driver's email address (must be unique)
   */
  email: string;

  /**
   * Street number of driver's address
   */
  streetNumber?: string;

  /**
   * Street name of driver's address
   */
  streetName?: string;

  /**
   * City of driver's address
   */
  city?: string;

  /**
   * State or province of driver's address
   */
  stateProvince?: string;

  /**
   * Country of driver's address
   */
  country?: string;

  /**
   * Postal code of driver's address
   */
  postalCode?: string;

  /**
   * Driver's license number
   */
  licenseNumber: string;

  /**
   * State that issued the driver's license
   */
  licenseState: string;

  /**
   * Class of the driver's license (e.g., A, B, C)
   */
  licenseClass: string;

  /**
   * Additional details about license class if needed
   */
  licenseClassOther?: string;

  /**
   * Date when the driver's license expires
   */
  licenseExpiry: Date;

  /**
   * Date when the driver's medical certificate expires
   */
  medCertExpiry: Date;

  /**
   * Date when the driver's TWIC (Transportation Worker Identification Credential) expires
   */
  twicExpiry?: Date;

  /**
   * Date when the driver was hired
   */
  hireDate: Date;

  /**
   * Type of driver (company, owner_operator, lease_purchase)
   */
  driverType: DriverType;

  /**
   * Current employment status (active, leave, terminated)
   */
  employmentStatus: EmploymentStatus;

  /**
   * City where the driver is based for operations
   */
  operatingBaseCity?: string;

  /**
   * State where the driver is based for operations
   */
  operatingBaseState?: string;

  /**
   * Vehicle assigned to the driver
   */
  assignedVehicle?: string;

  /**
   * Current status of the driver (available, driving, on_break, etc.)
   */
  status: DriverStatus;

  /**
   * ID of the load the driver is currently handling
   */
  loadId?: string;

  /**
   * Additional notes about the driver
   */
  notes?: string;

  /**
   * URL to the driver's profile picture
   */
  avatarUrl?: string;

  /**
   * Emergency contacts for the driver
   */
  emergencyContacts: EmergencyContact[];

  /**
   * Driver's license endorsements
   */
  endorsements: Endorsement[];

  /**
   * Documents related to the driver (license, medical certificate, etc.)
   */
  documents: Document[];

  /**
   * Driver's hours of service information
   */
  hoursOfService?: HoursOfService;

  /**
   * Date and time when the driver record was created
   */
  createdAt: Date;

  /**
   * Date and time when the driver record was last updated
   */
  updatedAt: Date;

  /**
   * Creates a new Driver entity
   * 
   * @param props Properties to initialize the driver with
   */
  private constructor(props: Partial<Driver>) {
    // Set default values for collections
    this.emergencyContacts = [];
    this.endorsements = [];
    this.documents = [];
    
    // Set default values for dates
    this.createdAt = new Date();
    this.updatedAt = new Date();
    
    // Apply provided properties
    Object.assign(this, props);
  }

  /**
   * Validates driver data
   * 
   * @param data Driver data to validate
   * @throws InvalidDriverDataError if the data is invalid
   */
  private static validateDriverData(data: Partial<Driver>): void {
    // Required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'dob',
      'phonePrimary',
      'email',
      'licenseNumber',
      'licenseState',
      'licenseClass',
      'licenseExpiry',
      'medCertExpiry',
      'hireDate',
      'driverType',
    ];
    
    for (const field of requiredFields) {
      if (!(data as any)[field]) {
        throw new InvalidDriverDataError(`Missing required field: ${field}`);
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      throw new InvalidDriverDataError('Invalid email format');
    }
    
    // Validate phone number format (simple validation)
    const phoneRegex = /^\d{10,15}$/;
    if (data.phonePrimary && !phoneRegex.test(data.phonePrimary.replace(/[^0-9]/g, ''))) {
      throw new InvalidDriverDataError('Invalid primary phone number format');
    }
    
    if (data.phoneSecondary && !phoneRegex.test(data.phoneSecondary.replace(/[^0-9]/g, ''))) {
      throw new InvalidDriverDataError('Invalid secondary phone number format');
    }
    
    // Validate dates
    const now = new Date();
    const minBirthYear = now.getFullYear() - 80; // Assuming drivers are between 21 and 80 years old
    const maxBirthYear = now.getFullYear() - 21; // Minimum age for CDL is typically 21
    
    if (data.dob) {
      const birthYear = data.dob.getFullYear();
      if (birthYear < minBirthYear || birthYear > maxBirthYear) {
        throw new InvalidDriverDataError('Invalid date of birth (driver must be between 21 and 80 years old)');
      }
    }
    
    if (data.licenseExpiry && data.licenseExpiry < now) {
      throw new InvalidDriverDataError('License is already expired');
    }
    
    if (data.medCertExpiry && data.medCertExpiry < now) {
      throw new InvalidDriverDataError('Medical certificate is already expired');
    }
    
    // Validate driver type
    if (data.driverType && !Object.values(DriverType).includes(data.driverType)) {
      throw new InvalidDriverDataError(`Invalid driver type: ${data.driverType}`);
    }
    
    // Validate employment status
    if (data.employmentStatus && !Object.values(EmploymentStatus).includes(data.employmentStatus)) {
      throw new InvalidDriverDataError(`Invalid employment status: ${data.employmentStatus}`);
    }
  }

  /**
   * Factory method to create a Driver from raw data
   * 
   * @param data Raw data to create the driver from
   * @returns A new Driver instance
   * @throws InvalidDriverDataError if the data is invalid
   */
  static create(data: {
    id?: string;
    firstName: string;
    lastName: string;
    driverId?: string;
    dob: Date;
    ssn?: string;
    phonePrimary: string;
    phoneSecondary?: string;
    email: string;
    streetNumber?: string;
    streetName?: string;
    city?: string;
    stateProvince?: string;
    country?: string;
    postalCode?: string;
    licenseNumber: string;
    licenseState: string;
    licenseClass: string;
    licenseClassOther?: string;
    licenseExpiry: Date;
    medCertExpiry: Date;
    twicExpiry?: Date;
    hireDate: Date;
    driverType: DriverType;
    employmentStatus?: EmploymentStatus;
    operatingBaseCity?: string;
    operatingBaseState?: string;
    assignedVehicle?: string;
    status?: DriverStatus;
    loadId?: string;
    notes?: string;
    avatarUrl?: string;
    emergencyContacts?: EmergencyContact[];
    endorsements?: Endorsement[];
    documents?: Document[];
    hoursOfService?: HoursOfService;
  }): Driver {
    // Set default values for optional fields
    const driverData = {
      ...data,
      employmentStatus: data.employmentStatus || EmploymentStatus.ACTIVE,
      status: data.status || DriverStatus.AVAILABLE,
      emergencyContacts: data.emergencyContacts || [],
      endorsements: data.endorsements || [],
      documents: data.documents || [],
    };
    
    // Validate the driver data
    this.validateDriverData(driverData);
    
    // Create the driver
    return new Driver(driverData);
  }

  /**
   * Gets the driver's full name
   * 
   * @returns The driver's full name (first name + last name)
   */
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Checks if the driver's license is expired
   * 
   * @returns True if the license is expired, false otherwise
   */
  isLicenseExpired(): boolean {
    return new Date() > this.licenseExpiry;
  }

  /**
   * Checks if the driver's medical certificate is expired
   * 
   * @returns True if the medical certificate is expired, false otherwise
   */
  isMedCertExpired(): boolean {
    return new Date() > this.medCertExpiry;
  }

  /**
   * Checks if the driver is available for assignment
   * 
   * @returns True if the driver is available, false otherwise
   */
  isAvailable(): boolean {
    return this.status === DriverStatus.AVAILABLE;
  }

  /**
   * Updates the driver's status
   * 
   * @param status The new status for the driver
   */
  updateStatus(status: DriverStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  /**
   * Assigns a load to the driver
   * 
   * @param loadId The ID of the load to assign
   */
  assignLoad(loadId: string): void {
    this.loadId = loadId;
    this.status = DriverStatus.DRIVING;
    this.updatedAt = new Date();
  }

  /**
   * Completes a load assignment
   */
  completeLoad(): void {
    this.loadId = undefined;
    this.status = DriverStatus.AVAILABLE;
    this.updatedAt = new Date();
  }

  /**
   * Gets the driver's full address
   * 
   * @returns The driver's full address as a string, or null if no address is available
   */
  getFullAddress(): string | null {
    const addressParts = [
      this.streetNumber,
      this.streetName,
      this.city,
      this.stateProvince,
      this.postalCode,
      this.country,
    ].filter(Boolean); // Remove any undefined or empty values
    
    return addressParts.length > 0 ? addressParts.join(', ') : null;
  }

  /**
   * Adds an emergency contact for the driver
   * 
   * @param contact The emergency contact to add
   */
  addEmergencyContact(contact: EmergencyContact): void {
    this.emergencyContacts.push(contact);
    this.updatedAt = new Date();
  }

  /**
   * Removes an emergency contact
   * 
   * @param contactId The ID of the emergency contact to remove
   * @returns True if the contact was removed, false if not found
   */
  removeEmergencyContact(contactId: number): boolean {
    const initialLength = this.emergencyContacts.length;
    this.emergencyContacts = this.emergencyContacts.filter(contact => contact.id !== contactId);
    
    const wasRemoved = initialLength > this.emergencyContacts.length;
    
    if (wasRemoved) {
      this.updatedAt = new Date();
    }
    
    return wasRemoved;
  }

  /**
   * Adds an endorsement to the driver's license
   * 
   * @param endorsement The endorsement to add
   */
  addEndorsement(endorsement: Endorsement): void {
    this.endorsements.push(endorsement);
    this.updatedAt = new Date();
  }

  /**
   * Removes an endorsement
   * 
   * @param endorsementId The ID of the endorsement to remove
   * @returns True if the endorsement was removed, false if not found
   */
  removeEndorsement(endorsementId: number): boolean {
    const initialLength = this.endorsements.length;
    this.endorsements = this.endorsements.filter(endorsement => endorsement.id !== endorsementId);
    
    const wasRemoved = initialLength > this.endorsements.length;
    
    if (wasRemoved) {
      this.updatedAt = new Date();
    }
    
    return wasRemoved;
  }

  /**
   * Adds a document to the driver's records
   * 
   * @param document The document to add
   */
  addDocument(document: Document): void {
    this.documents.push(document);
    this.updatedAt = new Date();
  }

  /**
   * Removes a document
   * 
   * @param documentId The ID of the document to remove
   * @returns True if the document was removed, false if not found
   */
  removeDocument(documentId: string): boolean {
    const initialLength = this.documents.length;
    this.documents = this.documents.filter(document => document.id !== documentId);
    
    const wasRemoved = initialLength > this.documents.length;
    
    if (wasRemoved) {
      this.updatedAt = new Date();
    }
    
    return wasRemoved;
  }

  /**
   * Sets the hours of service for the driver
   * 
   * @param hoursOfService The hours of service information
   */
  setHoursOfService(hoursOfService: HoursOfService): void {
    this.hoursOfService = hoursOfService;
    this.updatedAt = new Date();
  }

  /**
   * Updates the driver's information
   * 
   * @param data New data for the driver
   * @throws InvalidDriverDataError if the new data is invalid
   */
  update(data: Partial<Driver>): void {
    // Create a merged object with the current data and the updates
    const mergedData = { ...this, ...data };
    
    // Validate the merged data
    Driver.validateDriverData(mergedData);
    
    // Apply the updates
    Object.assign(this, data);
    
    // Update the updatedAt timestamp
    this.updatedAt = new Date();
  }

  /**
   * Terminates the driver's employment
   * 
   * @param notes Optional notes about the termination
   */
  terminate(notes?: string): void {
    this.employmentStatus = EmploymentStatus.TERMINATED;
    this.status = DriverStatus.OFF_DUTY;
    
    if (notes) {
      this.notes = this.notes ? `${this.notes}\n\nTermination: ${notes}` : `Termination: ${notes}`;
    }
    
    this.updatedAt = new Date();
  }

  /**
   * Puts the driver on leave
   * 
   * @param notes Optional notes about the leave
   */
  putOnLeave(notes?: string): void {
    this.employmentStatus = EmploymentStatus.LEAVE;
    this.status = DriverStatus.AWAY;
    
    if (notes) {
      this.notes = this.notes ? `${this.notes}\n\nLeave: ${notes}` : `Leave: ${notes}`;
    }
    
    this.updatedAt = new Date();
  }

  /**
   * Returns the driver from leave to active status
   */
  returnFromLeave(): void {
    this.employmentStatus = EmploymentStatus.ACTIVE;
    this.status = DriverStatus.AVAILABLE;
    this.updatedAt = new Date();
  }

  /**
   * Checks if any of the driver's credentials are expired or about to expire
   * 
   * @param daysThreshold Number of days to consider as "about to expire"
   * @returns An object with the expiration status of each credential
   */
  checkCredentialStatus(daysThreshold: number = 30): {
    licenseExpired: boolean;
    licenseExpiringSoon: boolean;
    medCertExpired: boolean;
    medCertExpiringSoon: boolean;
    twicExpired: boolean;
    twicExpiringSoon: boolean;
  } {
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    
    return {
      licenseExpired: now > this.licenseExpiry,
      licenseExpiringSoon: now <= this.licenseExpiry && this.licenseExpiry <= thresholdDate,
      medCertExpired: now > this.medCertExpiry,
      medCertExpiringSoon: now <= this.medCertExpiry && this.medCertExpiry <= thresholdDate,
      twicExpired: this.twicExpiry ? now > this.twicExpiry : false,
      twicExpiringSoon: this.twicExpiry ? now <= this.twicExpiry && this.twicExpiry <= thresholdDate : false,
    };
  }
}