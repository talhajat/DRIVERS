/**
 * This file defines the Document entity, which represents a file or document
 * associated with a driver, such as a license scan, medical certificate, etc.
 */

/**
 * Error thrown when an invalid document type is provided
 */
export class InvalidDocumentTypeError extends Error {
  constructor(type: string) {
    super(`Invalid document type: ${type}`);
    this.name = 'InvalidDocumentTypeError';
  }
}

/**
 * Document entity represents a file or document associated with a driver.
 * Examples include license scans, medical certificates, training certificates, etc.
 */
export class Document {
  /**
   * List of valid document types
   */
  static readonly VALID_TYPES = [
    'license',
    'medical_certificate',
    'twic_card',
    'training_certificate',
    'employment_verification',
    'background_check',
    'drug_test',
    'other'
  ];

  /**
   * Unique identifier for the document
   */
  id?: string;

  /**
   * Name of the file
   */
  fileName: string;

  /**
   * URL or path where the file is stored
   */
  fileUrl: string;

  /**
   * Type of document (e.g., license, medical_certificate)
   */
  fileType: string;

  /**
   * ID of the driver this document is associated with
   */
  driverId?: string;

  /**
   * Date and time when the document was uploaded
   */
  createdAt?: Date;

  /**
   * Creates a new Document entity
   * 
   * @param fileName Name of the file
   * @param fileUrl URL or path where the file is stored
   * @param fileType Type of document
   * @param id Optional unique identifier
   * @param driverId Optional ID of the associated driver
   * @param createdAt Optional creation date
   */
  private constructor(
    fileName: string,
    fileUrl: string,
    fileType: string,
    id?: string,
    driverId?: string,
    createdAt?: Date,
  ) {
    this.fileName = fileName;
    this.fileUrl = fileUrl;
    this.fileType = fileType;
    
    if (id) {
      this.id = id;
    }
    
    if (driverId) {
      this.driverId = driverId;
    }
    
    if (createdAt) {
      this.createdAt = createdAt;
    }
  }

  /**
   * Validates that the document type is valid
   * 
   * @param type The document type to validate
   * @throws InvalidDocumentTypeError if the type is invalid
   */
  private static validateType(type: string): void {
    if (!Document.VALID_TYPES.includes(type)) {
      throw new InvalidDocumentTypeError(type);
    }
  }

  /**
   * Factory method to create a Document from raw data
   * 
   * @param data Raw data to create the document from
   * @returns A new Document instance
   * @throws InvalidDocumentTypeError if the document type is invalid
   */
  static create(data: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    id?: string;
    driverId?: string;
    createdAt?: Date;
  }): Document {
    // Validate the document type
    this.validateType(data.fileType);
    
    return new Document(
      data.fileName,
      data.fileUrl,
      data.fileType,
      data.id,
      data.driverId,
      data.createdAt || new Date(),
    );
  }

  /**
   * Gets the file extension from the file name
   * 
   * @returns The file extension (e.g., pdf, jpg)
   */
  getFileExtension(): string {
    const parts = this.fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  }

  /**
   * Checks if the document is an image
   * 
   * @returns True if the document is an image, false otherwise
   */
  isImage(): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    return imageExtensions.includes(this.getFileExtension());
  }

  /**
   * Checks if the document is a PDF
   * 
   * @returns True if the document is a PDF, false otherwise
   */
  isPdf(): boolean {
    return this.getFileExtension() === 'pdf';
  }

  /**
   * Gets a human-readable description of the document type
   * 
   * @returns A formatted description of the document type
   */
  getTypeDescription(): string {
    const descriptions: Record<string, string> = {
      'license': 'Driver License',
      'medical_certificate': 'Medical Certificate',
      'twic_card': 'TWIC Card',
      'training_certificate': 'Training Certificate',
      'employment_verification': 'Employment Verification',
      'background_check': 'Background Check',
      'drug_test': 'Drug Test Results',
      'other': 'Other Document',
    };
    
    return descriptions[this.fileType] || 'Document';
  }

  /**
   * Updates the document information
   * 
   * @param data New data for the document
   * @throws InvalidDocumentTypeError if the new type is invalid
   */
  update(data: Partial<Document>): void {
    if (data.fileName) {
      this.fileName = data.fileName;
    }
    
    if (data.fileUrl) {
      this.fileUrl = data.fileUrl;
    }
    
    if (data.fileType) {
      // Validate the new type
      Document.validateType(data.fileType);
      this.fileType = data.fileType;
    }
  }
}