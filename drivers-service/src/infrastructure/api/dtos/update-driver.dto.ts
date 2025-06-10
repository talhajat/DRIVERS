/**
 * This file defines the UpdateDriverDto, which is used when updating an existing driver.
 * DTOs (Data Transfer Objects) define the structure of data that is sent over the network.
 */

import { DriverType, EmploymentStatus } from '../../../domain/models';
import { IsEmail, IsOptional, IsDate, IsString, IsEnum, Matches } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for updating a driver
 * This defines the structure of the data that clients send when updating a driver
 * All fields are optional since updates may be partial
 */
export class UpdateDriverDto {
  /**
   * Driver's first name
   */
  @IsOptional()
  @IsString()
  firstName?: string;

  /**
   * Driver's last name
   */
  @IsOptional()
  @IsString()
  lastName?: string;

  /**
   * Employee ID
   */
  @IsOptional()
  @IsString()
  driverId?: string;

  /**
   * Driver's date of birth
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dob?: Date;

  /**
   * Driver's Social Security Number
   */
  @IsOptional()
  @IsString()
  ssn?: string;

  /**
   * Driver's primary phone number
   */
  @IsOptional()
  @IsString()
  @Matches(/^\d{10,15}$/, { message: 'Phone number must be between 10 and 15 digits' })
  phonePrimary?: string;

  /**
   * Driver's secondary phone number
   */
  @IsOptional()
  @IsString()
  @Matches(/^\d{10,15}$/, { message: 'Phone number must be between 10 and 15 digits' })
  phoneSecondary?: string;

  /**
   * Driver's email address
   */
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  /**
   * Street number of driver's address
   */
  @IsOptional()
  @IsString()
  streetNumber?: string;

  /**
   * Street name of driver's address
   */
  @IsOptional()
  @IsString()
  streetName?: string;

  /**
   * City of driver's address
   */
  @IsOptional()
  @IsString()
  city?: string;

  /**
   * State or province of driver's address
   */
  @IsOptional()
  @IsString()
  stateProvince?: string;

  /**
   * Country of driver's address
   */
  @IsOptional()
  @IsString()
  country?: string;

  /**
   * Postal code of driver's address
   */
  @IsOptional()
  @IsString()
  postalCode?: string;

  /**
   * Driver's license number
   */
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  /**
   * State that issued the driver's license
   */
  @IsOptional()
  @IsString()
  licenseState?: string;

  /**
   * Class of the driver's license (e.g., A, B, C)
   */
  @IsOptional()
  @IsString()
  licenseClass?: string;

  /**
   * Additional details about license class
   */
  @IsOptional()
  @IsString()
  licenseClassOther?: string;

  /**
   * Date when the driver's license expires
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  licenseExpiry?: Date;

  /**
   * Date when the driver's medical certificate expires
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  medCertExpiry?: Date;

  /**
   * Date when the driver's TWIC expires
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  twicExpiry?: Date;

  /**
   * Date when the driver was hired
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  hireDate?: Date;

  /**
   * Type of driver
   */
  @IsOptional()
  @IsEnum(DriverType, { message: 'Invalid driver type' })
  driverType?: DriverType;

  /**
   * Current employment status
   */
  @IsOptional()
  @IsEnum(EmploymentStatus, { message: 'Invalid employment status' })
  employmentStatus?: EmploymentStatus;

  /**
   * City where the driver is based for operations
   */
  @IsOptional()
  @IsString()
  operatingBaseCity?: string;

  /**
   * State where the driver is based for operations
   */
  @IsOptional()
  @IsString()
  operatingBaseState?: string;

  /**
   * Vehicle assigned to the driver
   */
  @IsOptional()
  @IsString()
  assignedVehicle?: string;
}