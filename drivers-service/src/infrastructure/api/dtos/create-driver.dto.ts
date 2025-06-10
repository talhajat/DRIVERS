/**
 * This file defines the CreateDriverDto, which is used when creating a new driver.
 * DTOs (Data Transfer Objects) define the structure of data that is sent over the network.
 */

import { DriverType, EmploymentStatus, DriverStatus } from '../../../domain/models';
import { IsEmail, IsNotEmpty, IsOptional, IsDate, IsString, IsEnum, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for emergency contact information
 */
export class EmergencyContactDto {
  @ApiProperty({ description: 'Emergency contact name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Relationship to driver' })
  @IsNotEmpty()
  @IsString()
  relationship: string;

  @ApiProperty({ description: 'Emergency contact phone number' })
  @IsNotEmpty()
  @IsString()
  phone: string;
}

/**
 * DTO for endorsement information
 */
export class EndorsementDto {
  @ApiProperty({ description: 'Endorsement type' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiPropertyOptional({ description: 'Endorsement expiry date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date;
}

/**
 * DTO (Data Transfer Object) for creating a new driver
 * This defines the structure of the data that clients send when creating a driver
 */
export class CreateDriverDto {
  /**
   * Driver's first name
   */
  @ApiProperty({ description: 'Driver\'s first name' })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  /**
   * Driver's last name
   */
  @ApiProperty({ description: 'Driver\'s last name' })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;

  /**
   * Employee ID (can be auto-generated)
   */
  @ApiPropertyOptional({ description: 'Employee ID (can be auto-generated)' })
  @IsOptional()
  @IsString()
  driverId?: string;

  /**
   * Driver's date of birth
   */
  @ApiProperty({ description: 'Driver\'s date of birth' })
  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsDate()
  @Type(() => Date)
  dob: Date;

  /**
   * Driver's Social Security Number (optional for privacy/security)
   */
  @ApiPropertyOptional({ description: 'Driver\'s Social Security Number (last 4 digits)' })
  @IsOptional()
  @IsString()
  ssn?: string;

  /**
   * Driver's primary phone number
   */
  @ApiProperty({ description: 'Driver\'s primary phone number' })
  @IsNotEmpty({ message: 'Primary phone number is required' })
  @IsString()
  phonePrimary: string;

  /**
   * Driver's secondary phone number (optional)
   */
  @ApiPropertyOptional({ description: 'Driver\'s secondary phone number' })
  @IsOptional()
  @IsString()
  phoneSecondary?: string;

  /**
   * Driver's email address (must be unique)
   */
  @ApiProperty({ description: 'Driver\'s email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  /**
   * Street number of driver's address
   */
  @ApiPropertyOptional({ description: 'Street number' })
  @IsOptional()
  @IsString()
  streetNumber?: string;

  /**
   * Street name of driver's address
   */
  @ApiPropertyOptional({ description: 'Street name' })
  @IsOptional()
  @IsString()
  streetName?: string;

  /**
   * City of driver's address
   */
  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  /**
   * State or province of driver's address
   */
  @ApiPropertyOptional({ description: 'State or province' })
  @IsOptional()
  @IsString()
  stateProvince?: string;

  /**
   * Country of driver's address
   */
  @ApiPropertyOptional({ description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string;

  /**
   * Postal code of driver's address
   */
  @ApiPropertyOptional({ description: 'Postal code' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  /**
   * Driver's license number
   */
  @ApiProperty({ description: 'Driver\'s license number' })
  @IsNotEmpty({ message: 'License number is required' })
  @IsString()
  licenseNumber: string;

  /**
   * State that issued the driver's license
   */
  @ApiProperty({ description: 'License issuing state' })
  @IsNotEmpty({ message: 'License state is required' })
  @IsString()
  licenseState: string;

  /**
   * Class of the driver's license (e.g., A, B, C)
   */
  @ApiProperty({ description: 'License class' })
  @IsNotEmpty({ message: 'License class is required' })
  @IsString()
  licenseClass: string;

  /**
   * Additional details about license class if needed
   */
  @ApiPropertyOptional({ description: 'Additional license class details' })
  @IsOptional()
  @IsString()
  licenseClassOther?: string;

  /**
   * Date when the driver's license expires
   */
  @ApiProperty({ description: 'License expiry date' })
  @IsNotEmpty({ message: 'License expiry date is required' })
  @IsDate()
  @Type(() => Date)
  licenseExpiry: Date;

  /**
   * Date when the driver's medical certificate expires
   */
  @ApiProperty({ description: 'Medical certificate expiry date' })
  @IsNotEmpty({ message: 'Medical certificate expiry date is required' })
  @IsDate()
  @Type(() => Date)
  medCertExpiry: Date;

  /**
   * Date when the driver's TWIC (Transportation Worker Identification Credential) expires
   */
  @ApiPropertyOptional({ description: 'TWIC expiry date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  twicExpiry?: Date;

  /**
   * Date when the driver was hired
   */
  @ApiProperty({ description: 'Hire date' })
  @IsNotEmpty({ message: 'Hire date is required' })
  @IsDate()
  @Type(() => Date)
  hireDate: Date;

  /**
   * Type of driver (company, owner_operator, lease_purchase)
   */
  @ApiProperty({ description: 'Driver type', enum: ['company', 'owner_operator', 'lease_purchase'] })
  @IsNotEmpty({ message: 'Driver type is required' })
  @IsString()
  driverType: string;

  /**
   * Current employment status (active, leave, terminated)
   */
  @ApiPropertyOptional({ description: 'Employment status', default: 'active' })
  @IsOptional()
  @IsString()
  employmentStatus?: string;

  /**
   * City where the driver is based for operations
   */
  @ApiPropertyOptional({ description: 'Operating base city' })
  @IsOptional()
  @IsString()
  operatingBaseCity?: string;

  /**
   * State where the driver is based for operations
   */
  @ApiPropertyOptional({ description: 'Operating base state' })
  @IsOptional()
  @IsString()
  operatingBaseState?: string;

  /**
   * Vehicle assigned to the driver
   */
  @ApiPropertyOptional({ description: 'Assigned vehicle ID' })
  @IsOptional()
  @IsString()
  assignedVehicle?: string;

  /**
   * Current status of the driver
   */
  @ApiPropertyOptional({ description: 'Driver status', default: 'available' })
  @IsOptional()
  @IsString()
  status?: string;

  /**
   * ID of the load the driver is currently handling
   */
  @ApiPropertyOptional({ description: 'Current load ID' })
  @IsOptional()
  @IsString()
  loadId?: string;

  /**
   * Additional notes about the driver
   */
  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  /**
   * URL to the driver's profile picture
   */
  @ApiPropertyOptional({ description: 'Avatar URL' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  /**
   * Emergency contacts
   */
  @ApiPropertyOptional({ description: 'Emergency contacts', type: [EmergencyContactDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmergencyContactDto)
  emergencyContacts?: EmergencyContactDto[];

  /**
   * Driver endorsements
   */
  @ApiPropertyOptional({ description: 'Driver endorsements', type: [EndorsementDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EndorsementDto)
  endorsements?: EndorsementDto[];

  /**
   * Custom endorsements (comma-separated)
   */
  @ApiPropertyOptional({ description: 'Custom endorsements (comma-separated)' })
  @IsOptional()
  @IsString()
  customEndorsements?: string;

  /**
   * Temporary password for system access
   */
  @ApiPropertyOptional({ description: 'Temporary password' })
  @IsOptional()
  @IsString()
  tempPassword?: string;

  /**
   * User role
   */
  @ApiPropertyOptional({ description: 'User role', default: 'driver' })
  @IsOptional()
  @IsString()
  role?: string;
}