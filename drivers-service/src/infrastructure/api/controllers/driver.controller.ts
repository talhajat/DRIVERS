/**
 * This file contains the DriverController, which handles HTTP requests related to drivers.
 * It uses the DriverService to perform operations on drivers.
 */

import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  HttpException, 
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DriverService } from '../../../application/services/driver.service';
import { Driver, DriverStatus, DriverType, EmploymentStatus } from '../../../domain/models';
import { CreateDriverDto, UpdateDriverDto, DriverResponseDto } from '../dtos';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { Express } from 'express';

/**
 * DriverController handles HTTP requests related to drivers
 */
@ApiTags('drivers')
@Controller('drivers')
export class DriverController {
  /**
   * Constructor injects the driver service
   *
   * @param driverService Service for driver operations
   */
  constructor(private readonly driverService: DriverService) {}

  /**
   * GET /drivers
   * Gets all drivers
   */
  @ApiOperation({ summary: 'Get all drivers' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all drivers',
    type: [DriverResponseDto]
  })
  @Get()
  async getAllDrivers() {
    try {
      const drivers = await this.driverService.getAllDrivers();
      return drivers.map(driver => DriverResponseDto.fromEntity(driver));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * GET /drivers/available
   * Gets all available drivers
   */
  @ApiOperation({ summary: 'Get all available drivers' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all available drivers',
    type: [DriverResponseDto]
  })
  @Get('available')
  async getAvailableDrivers() {
    try {
      const drivers = await this.driverService.getAvailableDrivers();
      return drivers.map(driver => DriverResponseDto.fromEntity(driver));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * GET /drivers/:id
   * Gets a driver by ID
   */
  @ApiOperation({ summary: 'Get driver by ID' })
  @ApiParam({ name: 'id', description: 'Driver ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Returns the driver with the specified ID',
    type: DriverResponseDto
  })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @Get(':id')
  async getDriverById(@Param('id') id: string) {
    try {
      const driver = await this.driverService.getDriverById(id);
      if (!driver) {
        throw new HttpException(`Driver with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return DriverResponseDto.fromEntity(driver);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * POST /drivers
   * Creates a new driver
   */
  @ApiOperation({ summary: 'Create a new driver' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'The driver has been successfully created',
    type: DriverResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  @UseInterceptors(FilesInterceptor('documents', 10, {
    fileFilter: (req, file, cb) => {
      // Accept PDF, PNG, JPG, DOCX files
      const allowedMimes = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/jpg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new HttpException('Invalid file type', HttpStatus.BAD_REQUEST), false);
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB
    }
  }))
  async createDriver(
    @Body() formData: any,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    try {
      // Parse the form data from multipart/form-data
      const createDriverDto = this.parseFormData(formData);
      
      // Convert string types to enums
      const driverData = {
        ...createDriverDto,
        driverType: this.mapDriverType(createDriverDto.driverType),
        employmentStatus: createDriverDto.employmentStatus ? 
          this.mapEmploymentStatus(createDriverDto.employmentStatus) : 
          EmploymentStatus.ACTIVE,
        status: createDriverDto.status ? 
          this.mapDriverStatus(createDriverDto.status) : 
          DriverStatus.AVAILABLE
      };

      // Create the driver
      const driver = await this.driverService.createDriver(driverData, files);
      return DriverResponseDto.fromEntity(driver);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * PUT /drivers/:id
   * Updates a driver
   */
  @ApiOperation({ summary: 'Update an existing driver' })
  @ApiParam({ name: 'id', description: 'Driver ID', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'The driver has been successfully updated',
    type: DriverResponseDto
  })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Put(':id')
  @UseInterceptors(FilesInterceptor('documents', 10, {
    fileFilter: (req, file, cb) => {
      const allowedMimes = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/jpg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new HttpException('Invalid file type', HttpStatus.BAD_REQUEST), false);
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB
    }
  }))
  async updateDriver(
    @Param('id') id: string, 
    @Body() formData: any,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    try {
      // Parse the form data
      const updateDriverDto = this.parseFormData(formData);
      
      // Convert string types to enums if provided
      const driverData: any = { ...updateDriverDto };
      if (updateDriverDto.driverType) {
        driverData.driverType = this.mapDriverType(updateDriverDto.driverType);
      }
      if (updateDriverDto.employmentStatus) {
        driverData.employmentStatus = this.mapEmploymentStatus(updateDriverDto.employmentStatus);
      }
      if (updateDriverDto.status) {
        driverData.status = this.mapDriverStatus(updateDriverDto.status);
      }

      const driver = await this.driverService.updateDriver(id, driverData, files);
      return DriverResponseDto.fromEntity(driver);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * DELETE /drivers/:id
   * Deletes a driver
   */
  @ApiOperation({ summary: 'Delete a driver' })
  @ApiParam({ name: 'id', description: 'Driver ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The driver has been successfully deleted',
    type: DriverResponseDto
  })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @Delete(':id')
  async deleteDriver(@Param('id') id: string) {
    try {
      const driver = await this.driverService.deleteDriver(id);
      return DriverResponseDto.fromEntity(driver);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * PUT /drivers/:id/status
   * Updates a driver's status
   */
  @ApiOperation({ summary: 'Update driver status' })
  @ApiParam({ name: 'id', description: 'Driver ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The driver status has been successfully updated',
    type: DriverResponseDto
  })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Put(':id/status')
  async updateDriverStatus(@Param('id') id: string, @Body('status') status: string) {
    try {
      const mappedStatus = this.mapDriverStatus(status);
      const driver = await this.driverService.updateDriverStatus(id, mappedStatus);
      return DriverResponseDto.fromEntity(driver);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * PUT /drivers/:id/assign-load
   * Assigns a load to a driver
   */
  @ApiOperation({ summary: 'Assign a load to a driver' })
  @ApiParam({ name: 'id', description: 'Driver ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The load has been successfully assigned to the driver',
    type: DriverResponseDto
  })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Put(':id/assign-load')
  async assignLoad(@Param('id') id: string, @Body('loadId') loadId: string) {
    try {
      const driver = await this.driverService.assignLoad(id, loadId);
      return DriverResponseDto.fromEntity(driver);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * PUT /drivers/:id/complete-load
   * Marks a load as completed for a driver
   */
  @ApiOperation({ summary: 'Mark a load as completed for a driver' })
  @ApiParam({ name: 'id', description: 'Driver ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The load has been successfully marked as completed',
    type: DriverResponseDto
  })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Put(':id/complete-load')
  async completeLoad(@Param('id') id: string) {
    try {
      const driver = await this.driverService.completeLoad(id);
      return DriverResponseDto.fromEntity(driver);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * PUT /drivers/:id/terminate
   * Terminates a driver's employment
   */
  @ApiOperation({ summary: 'Terminate a driver\'s employment' })
  @ApiParam({ name: 'id', description: 'Driver ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The driver\'s employment has been successfully terminated',
    type: DriverResponseDto
  })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Put(':id/terminate')
  async terminateDriver(@Param('id') id: string, @Body('notes') notes?: string) {
    try {
      const driver = await this.driverService.terminateDriver(id, notes);
      return DriverResponseDto.fromEntity(driver);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * PUT /drivers/:id/leave
   * Puts a driver on leave
   */
  @ApiOperation({ summary: 'Put a driver on leave' })
  @ApiParam({ name: 'id', description: 'Driver ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The driver has been successfully put on leave',
    type: DriverResponseDto
  })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Put(':id/leave')
  async putDriverOnLeave(@Param('id') id: string, @Body('notes') notes?: string) {
    try {
      const driver = await this.driverService.putDriverOnLeave(id, notes);
      return DriverResponseDto.fromEntity(driver);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * PUT /drivers/:id/return-from-leave
   * Returns a driver from leave
   */
  @ApiOperation({ summary: 'Return a driver from leave' })
  @ApiParam({ name: 'id', description: 'Driver ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The driver has been successfully returned from leave',
    type: DriverResponseDto
  })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Put(':id/return-from-leave')
  async returnDriverFromLeave(@Param('id') id: string) {
    try {
      const driver = await this.driverService.returnDriverFromLeave(id);
      return DriverResponseDto.fromEntity(driver);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * GET /drivers/:id/credential-status
   * Checks a driver's credential status
   */
  @ApiOperation({ summary: 'Check a driver\'s credential status' })
  @ApiParam({ name: 'id', description: 'Driver ID', type: 'string' })
  @ApiQuery({ 
    name: 'daysThreshold', 
    description: 'Number of days to check for expiring credentials', 
    required: false,
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the credential status of the driver'
  })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @Get(':id/credential-status')
  async checkDriverCredentialStatus(
    @Param('id') id: string,
    @Query('daysThreshold') daysThreshold?: number,
  ) {
    try {
      return await this.driverService.checkDriverCredentialStatus(
        id,
        daysThreshold
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Parse form data from multipart/form-data request
   */
  private parseFormData(formData: any): any {
    const result: any = {};

    // Parse simple fields
    Object.keys(formData).forEach(key => {
      if (!key.includes('[') && !key.includes(']')) {
        // Handle date fields
        if (key.includes('Date') || key.includes('Expiry') || key === 'dob' || key === 'hireDate') {
          result[key] = formData[key] ? new Date(formData[key]) : undefined;
        } else {
          result[key] = formData[key];
        }
      }
    });

    // Parse emergency contacts
    const emergencyContacts: any[] = [];
    const emergencyContactIndices = new Set<string>();
    
    Object.keys(formData).forEach(key => {
      const match = key.match(/emergencyContacts\[(\d+)\]\[(\w+)\]/);
      if (match) {
        const indexStr = match[1];
        const index = parseInt(indexStr, 10);
        const field = match[2];
        emergencyContactIndices.add(indexStr);
        
        if (!emergencyContacts[index]) {
          emergencyContacts[index] = {};
        }
        emergencyContacts[index][field] = formData[key];
      }
    });

    if (emergencyContacts.length > 0) {
      result.emergencyContacts = emergencyContacts.filter(contact => contact !== null && contact !== undefined);
    }

    // Parse endorsements
    const endorsements: any[] = [];
    const endorsementTypes = new Set<string>();

    Object.keys(formData).forEach(key => {
      const match = key.match(/endorsements\[(\w+)\]/);
      if (match && formData[key] === 'true') {
        const endorsementType = match[1];
        endorsementTypes.add(endorsementType);
        
        const endorsement: any = { type: endorsementType };
        
        // Check for expiry date
        const expiryKey = `endorsements[${endorsementType}]_expiry`;
        if (formData[expiryKey]) {
          endorsement.expiryDate = new Date(formData[expiryKey]);
        }
        
        endorsements.push(endorsement);
      }
    });

    if (endorsements.length > 0) {
      result.endorsements = endorsements;
    }

    // Handle custom endorsements
    if (formData.customEndorsements) {
      const customEndorsements = formData.customEndorsements.split(',').map((e: string) => e.trim());
      customEndorsements.forEach((type: string) => {
        if (type) {
          endorsements.push({ type });
        }
      });
      result.endorsements = endorsements;
    }

    return result;
  }

  /**
   * Map string driver type to enum
   */
  private mapDriverType(type: string): DriverType {
    const mapping: Record<string, DriverType> = {
      'company': DriverType.COMPANY,
      'owner_operator': DriverType.OWNER_OPERATOR,
      'lease_purchase': DriverType.LEASE_PURCHASE
    };
    return mapping[type] || DriverType.COMPANY;
  }

  /**
   * Map string employment status to enum
   */
  private mapEmploymentStatus(status: string): EmploymentStatus {
    const mapping: Record<string, EmploymentStatus> = {
      'active': EmploymentStatus.ACTIVE,
      'leave': EmploymentStatus.LEAVE,
      'terminated': EmploymentStatus.TERMINATED
    };
    return mapping[status] || EmploymentStatus.ACTIVE;
  }

  /**
   * Map string driver status to enum
   */
  private mapDriverStatus(status: string): DriverStatus {
    const mapping: Record<string, DriverStatus> = {
      'available': DriverStatus.AVAILABLE,
      'driving': DriverStatus.DRIVING,
      'on-break': DriverStatus.ON_BREAK,
      'loading': DriverStatus.LOADING,
      'unloading': DriverStatus.UNLOADING,
      'maintenance': DriverStatus.MAINTENANCE,
      'away': DriverStatus.AWAY,
      'off-duty': DriverStatus.OFF_DUTY
    };
    return mapping[status] || DriverStatus.AVAILABLE;
  }
}