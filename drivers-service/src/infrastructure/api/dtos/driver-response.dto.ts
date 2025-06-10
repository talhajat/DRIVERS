/**
 * This file defines the DriverResponseDto, which is used to format driver data
 * in the structure expected by the frontend.
 */

import { Driver, DriverStatus } from '../../../domain/models';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for driver data in the format expected by the frontend
 */
export class DriverResponseDto {
  /**
   * Unique identifier
   */
  @ApiProperty({ description: 'Unique identifier for the driver' })
  id: string;

  /**
   * Combined from firstName + lastName
   */
  @ApiProperty({ description: 'Driver\'s full name (firstName + lastName)' })
  name: string;

  /**
   * Driver's current status
   */
  @ApiProperty({
    description: 'Current operational status of the driver',
    enum: DriverStatus,
    enumName: 'DriverStatus'
  })
  status: DriverStatus;

  /**
   * Optional vehicle assignment
   */
  @ApiPropertyOptional({ description: 'ID of the vehicle assigned to the driver' })
  vehicleId?: string;

  /**
   * Optional load assignment
   */
  @ApiPropertyOptional({ description: 'ID of the load currently assigned to the driver' })
  loadId?: string;

  /**
   * Optional HOS data
   */
  @ApiPropertyOptional({
    description: 'Hours of Service information',
    type: 'object',
    properties: {
      drivingHoursToday: { type: 'number', description: 'Hours spent driving today' },
      dutyHoursToday: { type: 'number', description: 'Hours on duty today' },
      timeUntilBreakRequired: { type: 'number', description: 'Hours until next required break' }
    }
  })
  hoursOfService?: {
    drivingHoursToday: number;
    dutyHoursToday: number;
    timeUntilBreakRequired: number;
  };

  /**
   * Contact information
   */
  @ApiProperty({
    description: 'Driver contact information',
    type: 'object',
    properties: {
      phone: { type: 'string', description: 'Primary phone number' },
      email: { type: 'string', description: 'Email address' }
    }
  })
  contact: {
    phone: string;
    email: string;
  };

  /**
   * Optional base city
   */
  @ApiPropertyOptional({ description: 'City where the driver is based for operations' })
  operatingBaseCity?: string;

  /**
   * Optional base state
   */
  @ApiPropertyOptional({ description: 'State where the driver is based for operations' })
  operatingBaseState?: string;

  /**
   * Optional avatar URL
   */
  @ApiPropertyOptional({ description: 'URL to the driver\'s profile picture' })
  avatarUrl?: string;

  /**
   * Static method to transform a domain Driver entity to the DTO format
   * expected by the frontend
   * 
   * @param driver The domain Driver entity
   * @returns A DriverResponseDto formatted for the frontend
   */
  static fromEntity(driver: Driver): DriverResponseDto {
    const dto = new DriverResponseDto();
    
    dto.id = driver.id;
    dto.name = `${driver.firstName} ${driver.lastName}`;
    dto.status = driver.status;
    dto.vehicleId = driver.assignedVehicle; // Map assignedVehicle to vehicleId for frontend compatibility
    dto.loadId = driver.loadId;
    dto.avatarUrl = driver.avatarUrl;
    
    // Format contact information
    dto.contact = {
      phone: driver.phonePrimary,
      email: driver.email
    };
    
    // Include operating base information if available
    dto.operatingBaseCity = driver.operatingBaseCity;
    dto.operatingBaseState = driver.operatingBaseState;
    
    // Include hours of service if available
    if (driver.hoursOfService) {
      dto.hoursOfService = {
        drivingHoursToday: driver.hoursOfService.drivingHoursToday,
        dutyHoursToday: driver.hoursOfService.dutyHoursToday,
        timeUntilBreakRequired: driver.hoursOfService.timeUntilBreakRequired
      };
    }
    
    return dto;
  }
}