/**
 * This file contains the actual implementation of how we interact with the driver data in the database.
 * It uses Prisma (our database toolkit) to perform operations like creating, reading, updating, and deleting drivers.
 */

import { Injectable } from '@nestjs/common';
import { IDriverRepository } from '../../../domain/repositories/driver.repository.interface';
import { PrismaService } from '../prisma.service';
import {
  Driver,
  EmergencyContact,
  Endorsement,
  Document,
  HoursOfService,
  DriverType,
  EmploymentStatus,
  DriverStatus
} from '../../../domain/models';

/**
 * PrismaDriverRepository is responsible for all database operations related to drivers.
 * It implements the IDriverRepository interface, which means it must provide all the
 * methods defined in that interface.
 */
@Injectable()
export class PrismaDriverRepository implements IDriverRepository {
  /**
   * The constructor receives the PrismaService, which is our connection to the database.
   * This is called dependency injection - the repository depends on the PrismaService to work.
   */
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Maps a Prisma driver record to our domain Driver entity
   *
   * @param prismaDriver The driver record from Prisma
   * @returns A domain Driver entity
   */
  private mapToDomainModel(prismaDriver: any): Driver {
    // Map emergency contacts
    const emergencyContacts = prismaDriver.emergencyContacts?.map((contact: any) =>
      EmergencyContact.create({
        id: contact.id,
        name: contact.name,
        relationship: contact.relationship,
        phone: contact.phone,
        driverId: contact.driverId
      })
    ) || [];

    // Map endorsements
    const endorsements = prismaDriver.endorsements?.map((endorsement: any) =>
      Endorsement.create({
        id: endorsement.id,
        type: endorsement.type,
        expiryDate: endorsement.expiryDate,
        driverId: endorsement.driverId
      })
    ) || [];

    // Map documents
    const documents = prismaDriver.documents?.map((document: any) =>
      Document.create({
        id: document.id,
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        fileType: document.fileType,
        driverId: document.driverId,
        createdAt: document.createdAt
      })
    ) || [];

    // Map hours of service
    let hoursOfService: HoursOfService | undefined = undefined;
    if (prismaDriver.hoursOfService) {
      hoursOfService = HoursOfService.create({
        id: prismaDriver.hoursOfService.id,
        drivingHoursToday: prismaDriver.hoursOfService.drivingHoursToday,
        dutyHoursToday: prismaDriver.hoursOfService.dutyHoursToday,
        timeUntilBreakRequired: prismaDriver.hoursOfService.timeUntilBreakRequired,
        driverId: prismaDriver.hoursOfService.driverId
      });
    }

    // Create and return the domain Driver entity
    return Driver.create({
      id: prismaDriver.id,
      firstName: prismaDriver.firstName,
      lastName: prismaDriver.lastName,
      driverId: prismaDriver.driverId || undefined,
      dob: prismaDriver.dob,
      ssn: prismaDriver.ssn || undefined,
      phonePrimary: prismaDriver.phonePrimary,
      phoneSecondary: prismaDriver.phoneSecondary || undefined,
      email: prismaDriver.email,
      streetNumber: prismaDriver.streetNumber || undefined,
      streetName: prismaDriver.streetName || undefined,
      city: prismaDriver.city || undefined,
      stateProvince: prismaDriver.stateProvince || undefined,
      country: prismaDriver.country || undefined,
      postalCode: prismaDriver.postalCode || undefined,
      licenseNumber: prismaDriver.licenseNumber,
      licenseState: prismaDriver.licenseState,
      licenseClass: prismaDriver.licenseClass,
      licenseClassOther: prismaDriver.licenseClassOther || undefined,
      licenseExpiry: prismaDriver.licenseExpiry,
      medCertExpiry: prismaDriver.medCertExpiry,
      twicExpiry: prismaDriver.twicExpiry || undefined,
      hireDate: prismaDriver.hireDate,
      driverType: prismaDriver.driverType as DriverType,
      employmentStatus: prismaDriver.employmentStatus as EmploymentStatus,
      operatingBaseCity: prismaDriver.operatingBaseCity || undefined,
      operatingBaseState: prismaDriver.operatingBaseState || undefined,
      assignedVehicle: prismaDriver.assignedVehicle || undefined,
      status: prismaDriver.status as DriverStatus,
      loadId: prismaDriver.loadId || undefined,
      notes: prismaDriver.notes || undefined,
      avatarUrl: prismaDriver.avatarUrl || undefined,
      emergencyContacts,
      endorsements,
      documents,
      hoursOfService
    });
  }

  /**
   * Maps a domain Driver entity to a Prisma driver record
   *
   * @param driver The domain Driver entity
   * @returns A Prisma driver record
   */
  private mapToPrismaModel(driver: Driver): any {
    // Extract the basic driver data (excluding relationships and auto-managed fields)
    const {
      id,
      emergencyContacts,
      endorsements,
      documents,
      hoursOfService,
      createdAt,
      updatedAt,
      ...driverData
    } = driver;

    // Convert undefined values to null for Prisma and explicitly exclude auto-managed fields
    const result: any = {};
    const excludedFields = ['id', 'createdAt', 'updatedAt', 'emergencyContacts', 'endorsements', 'documents', 'hoursOfService', 'role'];
    
    Object.keys(driverData).forEach(key => {
      // Skip auto-managed fields and relationships
      if (excludedFields.includes(key)) {
        return;
      }
      
      const value = (driverData as any)[key];
      
      // Convert enum values to strings for driverType and employmentStatus
      // but keep status as enum value for Prisma
      if (key === 'driverType' && value) {
        result[key] = value.toString();
      } else if (key === 'employmentStatus' && value) {
        result[key] = value.toString();
      } else if (key === 'status' && value) {
        // Keep status as enum value, not string
        result[key] = value;
      } else {
        result[key] = value === undefined ? null : value;
      }
    });

    return result;
  }

  /**
   * Retrieves all drivers from the database.
   *
   * @returns A list of all drivers in the system
   */
  async findAll(): Promise<Driver[]> {
    // Use Prisma to fetch all driver records
    const prismaDrivers = await this.prismaService.driver.findMany({
      // Include related data like emergency contacts
      include: {
        emergencyContacts: true,
        endorsements: true,
        documents: true,
        hoursOfService: true,
      },
    });

    // Map Prisma records to domain entities
    return prismaDrivers.map(driver => this.mapToDomainModel(driver));
  }

  /**
   * Finds a specific driver by their unique ID.
   *
   * @param id The unique identifier of the driver
   * @returns The driver if found, or null if not found
   */
  async findById(id: string): Promise<Driver | null> {
    // Use Prisma to find a driver by ID
    const prismaDriver = await this.prismaService.driver.findUnique({
      where: { id },
      // Include related data
      include: {
        emergencyContacts: true,
        endorsements: true,
        documents: true,
        hoursOfService: true,
      },
    });

    // If no driver found, return null
    if (!prismaDriver) {
      return null;
    }

    // Map Prisma record to domain entity
    return this.mapToDomainModel(prismaDriver);
  }

  /**
   * Finds a driver by their email address.
   *
   * @param email The email address to search for
   * @returns The driver if found, or null if not found
   */
  async findByEmail(email: string): Promise<Driver | null> {
    // Use Prisma to find a driver by email
    const prismaDriver = await this.prismaService.driver.findUnique({
      where: { email },
      // Include related data
      include: {
        emergencyContacts: true,
        endorsements: true,
        documents: true,
        hoursOfService: true,
      },
    });

    // If no driver found, return null
    if (!prismaDriver) {
      return null;
    }

    // Map Prisma record to domain entity
    return this.mapToDomainModel(prismaDriver);
  }

  /**
   * Creates a new driver record in the database.
   *
   * @param driver The driver entity to create in the database
   * @returns The newly created driver record
   */
  async create(driver: Driver): Promise<Driver> {
    // Map domain entity to Prisma model
    const prismaDriver = this.mapToPrismaModel(driver);

    // Use Prisma transaction to create driver and related data together
    const createdDriver = await this.prismaService.$transaction(async (prisma) => {
      // Create the driver first
      const newDriver = await prisma.driver.create({
        data: {
          ...prismaDriver,
          // Create emergency contacts if provided
          emergencyContacts: driver.emergencyContacts && driver.emergencyContacts.length > 0 ? {
            create: driver.emergencyContacts.map(contact => ({
              name: contact.name,
              relationship: contact.relationship,
              phone: contact.phone
            }))
          } : undefined,
          // Create endorsements if provided
          endorsements: driver.endorsements && driver.endorsements.length > 0 ? {
            create: driver.endorsements.map(endorsement => ({
              type: endorsement.type,
              expiryDate: endorsement.expiryDate
            }))
          } : undefined,
          // Create documents if provided
          documents: driver.documents && driver.documents.length > 0 ? {
            create: driver.documents.map(document => ({
              fileName: document.fileName,
              fileUrl: document.fileUrl,
              fileType: document.fileType
            }))
          } : undefined,
          // Initialize HoursOfService with default values
          hoursOfService: {
            create: {
              drivingHoursToday: 0,
              dutyHoursToday: 0,
              timeUntilBreakRequired: 0
            }
          }
        },
        include: {
          emergencyContacts: true,
          endorsements: true,
          documents: true,
          hoursOfService: true,
        },
      });

      return newDriver;
    });

    // Map Prisma record to domain entity
    return this.mapToDomainModel(createdDriver);
  }

  /**
   * Updates an existing driver's information.
   *
   * @param driver The driver entity with updated information
   * @returns The updated driver record
   */
  async update(driver: Driver): Promise<Driver> {
    // Map domain entity to Prisma model
    const prismaDriver = this.mapToPrismaModel(driver);

    // Use Prisma transaction to update driver and related data
    const updatedDriver = await this.prismaService.$transaction(async (prisma) => {
      // Update the driver
      const updated = await prisma.driver.update({
        where: { id: driver.id },
        data: prismaDriver,
      });

      // Update emergency contacts if provided
      if (driver.emergencyContacts) {
        // Delete existing emergency contacts
        await prisma.emergencyContact.deleteMany({
          where: { driverId: driver.id }
        });

        // Create new emergency contacts
        if (driver.emergencyContacts.length > 0) {
          await prisma.emergencyContact.createMany({
            data: driver.emergencyContacts.map(contact => ({
              name: contact.name,
              relationship: contact.relationship,
              phone: contact.phone,
              driverId: driver.id
            }))
          });
        }
      }

      // Update endorsements if provided
      if (driver.endorsements) {
        // Delete existing endorsements
        await prisma.endorsement.deleteMany({
          where: { driverId: driver.id }
        });

        // Create new endorsements
        if (driver.endorsements.length > 0) {
          await prisma.endorsement.createMany({
            data: driver.endorsements.map(endorsement => ({
              type: endorsement.type,
              expiryDate: endorsement.expiryDate,
              driverId: driver.id
            }))
          });
        }
      }

      // Update documents if provided
      if (driver.documents) {
        // Note: We're adding new documents, not replacing all
        if (driver.documents.length > 0) {
          await prisma.document.createMany({
            data: driver.documents.map(document => ({
              fileName: document.fileName,
              fileUrl: document.fileUrl,
              fileType: document.fileType,
              driverId: driver.id
            }))
          });
        }
      }

      // Fetch the updated driver with all relations
      return await prisma.driver.findUnique({
        where: { id: driver.id },
        include: {
          emergencyContacts: true,
          endorsements: true,
          documents: true,
          hoursOfService: true,
        },
      });
    });

    // Map Prisma record to domain entity
    return this.mapToDomainModel(updatedDriver!);
  }

  /**
   * Removes a driver record from the database.
   *
   * @param id The unique identifier of the driver to delete
   * @returns The deleted driver record
   */
  async delete(id: string): Promise<Driver> {
    // Use Prisma to delete a driver record
    const deletedDriver = await this.prismaService.driver.delete({
      where: { id },
      // Include related data in the response
      include: {
        emergencyContacts: true,
        endorsements: true,
        documents: true,
        hoursOfService: true,
      },
    });

    // Map Prisma record to domain entity
    return this.mapToDomainModel(deletedDriver);
  }
}