/**
 * This file contains the DriverService, which implements the application logic
 * for managing drivers. It acts as a bridge between the API controllers and the domain layer.
 */

import { Injectable, Inject } from '@nestjs/common';
import { Driver, DriverStatus, DriverType, EmploymentStatus, EmergencyContact, Endorsement, Document, HoursOfService } from '../../domain/models';
import { IDriverRepository } from '../../domain/repositories';
import { DRIVER_REPOSITORY } from '../../infrastructure/persistence/persistence.module';
import { Express } from 'express';

/**
 * DriverService implements the application logic for managing drivers.
 * It uses the driver repository to interact with the database and applies
 * business rules before performing operations.
 */
@Injectable()
export class DriverService {
  /**
   * Constructor injects the driver repository
   *
   * @param driverRepository Repository for driver data access
   */
  constructor(
    @Inject(DRIVER_REPOSITORY)
    private readonly driverRepository: IDriverRepository
  ) {}

  /**
   * Gets all drivers in the system
   * 
   * @returns A list of all drivers
   */
  async getAllDrivers(): Promise<Driver[]> {
    return this.driverRepository.findAll();
  }

  /**
   * Gets a driver by their ID
   * 
   * @param id The driver's unique identifier
   * @returns The driver if found, or null if not found
   */
  async getDriverById(id: string): Promise<Driver | null> {
    return this.driverRepository.findById(id);
  }

  /**
   * Gets a driver by their email address
   * 
   * @param email The driver's email address
   * @returns The driver if found, or null if not found
   */
  async getDriverByEmail(email: string): Promise<Driver | null> {
    return this.driverRepository.findByEmail(email);
  }

  /**
   * Creates a new driver
   * 
   * @param driverData The data for the new driver
   * @param files Optional uploaded files
   * @returns The newly created driver
   */
  async createDriver(driverData: {
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
    emergencyContacts?: Array<{
      name: string;
      relationship: string;
      phone: string;
    }>;
    endorsements?: Array<{
      type: string;
      expiryDate?: Date;
    }>;
    tempPassword?: string;
    role?: string;
    notes?: string;
  }, files?: Express.Multer.File[]): Promise<Driver> {
    // Check if a driver with the same email already exists
    const existingDriver = await this.driverRepository.findByEmail(driverData.email);
    if (existingDriver) {
      throw new Error(`A driver with email ${driverData.email} already exists`);
    }

    // Extract nested data
    const { emergencyContacts, endorsements, ...driverBaseData } = driverData;

    // Create a new Driver entity
    const driver = Driver.create({
      ...driverBaseData,
      status: DriverStatus.AVAILABLE,
    });

    // Process emergency contacts
    if (driverData.emergencyContacts && driverData.emergencyContacts.length > 0) {
      driver.emergencyContacts = driverData.emergencyContacts.map(contact => 
        EmergencyContact.create({
          name: contact.name,
          relationship: contact.relationship,
          phone: contact.phone
        })
      );
    }

    // Process endorsements
    if (driverData.endorsements && driverData.endorsements.length > 0) {
      driver.endorsements = driverData.endorsements.map(endorsement =>
        Endorsement.create({
          type: endorsement.type,
          expiryDate: endorsement.expiryDate
        })
      );
    }

    // Initialize HoursOfService with default values
    driver.hoursOfService = HoursOfService.create({
      drivingHoursToday: 0,
      dutyHoursToday: 0,
      timeUntilBreakRequired: 0
    });

    // Process uploaded files
    if (files && files.length > 0) {
      driver.documents = files.map(file => 
        Document.create({
          fileName: file.originalname,
          fileUrl: file.path || file.filename, // This would be the actual storage path/URL
          fileType: file.mimetype
        })
      );
    }

    // Save the driver to the database
    return this.driverRepository.create(driver);
  }

  /**
   * Updates an existing driver
   * 
   * @param id The driver's unique identifier
   * @param driverData The updated driver data
   * @param files Optional uploaded files
   * @returns The updated driver
   */
  async updateDriver(id: string, driverData: Partial<{
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
    emergencyContacts?: Array<{
      name: string;
      relationship: string;
      phone: string;
    }>;
    endorsements?: Array<{
      type: string;
      expiryDate?: Date;
    }>;
    notes?: string;
  }>, files?: Express.Multer.File[]): Promise<Driver> {
    // Get the existing driver
    const existingDriver = await this.driverRepository.findById(id);
    if (!existingDriver) {
      throw new Error(`Driver with ID ${id} not found`);
    }

    // If email is being updated, check if it's already in use
    if (driverData.email && driverData.email !== existingDriver.email) {
      const driverWithEmail = await this.driverRepository.findByEmail(driverData.email);
      if (driverWithEmail && driverWithEmail.id !== id) {
        throw new Error(`A driver with email ${driverData.email} already exists`);
      }
    }

    // Extract nested data
    const { emergencyContacts, endorsements, ...driverBaseData } = driverData;

    // Update the driver entity with base data only
    existingDriver.update(driverBaseData);

    // Update emergency contacts if provided
    if (emergencyContacts) {
      existingDriver.emergencyContacts = emergencyContacts.map(contact =>
        EmergencyContact.create({
          name: contact.name,
          relationship: contact.relationship,
          phone: contact.phone
        })
      );
    }

    // Update endorsements if provided
    if (endorsements) {
      existingDriver.endorsements = endorsements.map(endorsement =>
        Endorsement.create({
          type: endorsement.type,
          expiryDate: endorsement.expiryDate
        })
      );
    }

    // Process new uploaded files
    if (files && files.length > 0) {
      const newDocuments = files.map(file => 
        Document.create({
          fileName: file.originalname,
          fileUrl: file.path || file.filename,
          fileType: file.mimetype
        })
      );
      existingDriver.documents = [...(existingDriver.documents || []), ...newDocuments];
    }

    // Save the updated driver to the database
    return this.driverRepository.update(existingDriver);
  }

  /**
   * Deletes a driver
   * 
   * @param id The driver's unique identifier
   * @returns The deleted driver
   */
  async deleteDriver(id: string): Promise<Driver> {
    // Check if the driver exists
    const existingDriver = await this.driverRepository.findById(id);
    if (!existingDriver) {
      throw new Error(`Driver with ID ${id} not found`);
    }

    // Delete the driver from the database
    return this.driverRepository.delete(id);
  }

  /**
   * Updates a driver's status
   * 
   * @param id The driver's unique identifier
   * @param status The new status
   * @returns The updated driver
   */
  async updateDriverStatus(id: string, status: DriverStatus): Promise<Driver> {
    // Get the existing driver
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw new Error(`Driver with ID ${id} not found`);
    }

    // Update the status
    driver.updateStatus(status);

    // Save the updated driver to the database
    return this.driverRepository.update(driver);
  }

  /**
   * Assigns a load to a driver
   * 
   * @param driverId The driver's unique identifier
   * @param loadId The load's unique identifier
   * @returns The updated driver
   */
  async assignLoad(driverId: string, loadId: string): Promise<Driver> {
    // Get the existing driver
    const driver = await this.driverRepository.findById(driverId);
    if (!driver) {
      throw new Error(`Driver with ID ${driverId} not found`);
    }

    // Check if the driver is available
    if (!driver.isAvailable()) {
      throw new Error(`Driver ${driver.getFullName()} is not available for assignment`);
    }

    // Assign the load
    driver.assignLoad(loadId);

    // Save the updated driver to the database
    return this.driverRepository.update(driver);
  }

  /**
   * Marks a load as completed for a driver
   * 
   * @param driverId The driver's unique identifier
   * @returns The updated driver
   */
  async completeLoad(driverId: string): Promise<Driver> {
    // Get the existing driver
    const driver = await this.driverRepository.findById(driverId);
    if (!driver) {
      throw new Error(`Driver with ID ${driverId} not found`);
    }

    // Check if the driver has a load assigned
    if (!driver.loadId) {
      throw new Error(`Driver ${driver.getFullName()} does not have a load assigned`);
    }

    // Complete the load
    driver.completeLoad();

    // Save the updated driver to the database
    return this.driverRepository.update(driver);
  }

  /**
   * Gets all available drivers
   * 
   * @returns A list of all available drivers
   */
  async getAvailableDrivers(): Promise<Driver[]> {
    const drivers = await this.driverRepository.findAll();
    return drivers.filter(driver => driver.isAvailable());
  }

  /**
   * Terminates a driver's employment
   * 
   * @param id The driver's unique identifier
   * @param notes Optional notes about the termination
   * @returns The updated driver
   */
  async terminateDriver(id: string, notes?: string): Promise<Driver> {
    // Get the existing driver
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw new Error(`Driver with ID ${id} not found`);
    }

    // Terminate the driver
    driver.terminate(notes);

    // Save the updated driver to the database
    return this.driverRepository.update(driver);
  }

  /**
   * Puts a driver on leave
   * 
   * @param id The driver's unique identifier
   * @param notes Optional notes about the leave
   * @returns The updated driver
   */
  async putDriverOnLeave(id: string, notes?: string): Promise<Driver> {
    // Get the existing driver
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw new Error(`Driver with ID ${id} not found`);
    }

    // Put the driver on leave
    driver.putOnLeave(notes);

    // Save the updated driver to the database
    return this.driverRepository.update(driver);
  }

  /**
   * Returns a driver from leave
   * 
   * @param id The driver's unique identifier
   * @returns The updated driver
   */
  async returnDriverFromLeave(id: string): Promise<Driver> {
    // Get the existing driver
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw new Error(`Driver with ID ${id} not found`);
    }

    // Check if the driver is on leave
    if (driver.employmentStatus !== EmploymentStatus.LEAVE) {
      throw new Error(`Driver ${driver.getFullName()} is not on leave`);
    }

    // Return the driver from leave
    driver.returnFromLeave();

    // Save the updated driver to the database
    return this.driverRepository.update(driver);
  }

  /**
   * Checks if any of a driver's credentials are expired or about to expire
   * 
   * @param id The driver's unique identifier
   * @param daysThreshold Number of days to consider as "about to expire"
   * @returns The credential status
   */
  async checkDriverCredentialStatus(id: string, daysThreshold: number = 30): Promise<{
    licenseExpired: boolean;
    licenseExpiringSoon: boolean;
    medCertExpired: boolean;
    medCertExpiringSoon: boolean;
    twicExpired: boolean;
    twicExpiringSoon: boolean;
  }> {
    // Get the existing driver
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw new Error(`Driver with ID ${id} not found`);
    }

    // Check the credential status
    return driver.checkCredentialStatus(daysThreshold);
  }
}