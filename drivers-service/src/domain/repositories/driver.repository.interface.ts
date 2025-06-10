/**
 * This file defines the interface for interacting with driver data in the database.
 * An interface is like a contract that specifies what operations can be performed,
 * without specifying how they are implemented.
 */

import { Driver } from '../models/driver.entity';

/**
 * IDriverRepository defines all the operations that can be performed on driver data.
 * Think of this as a list of available actions for managing driver information in the system.
 */
export interface IDriverRepository {
  /**
   * Retrieves all drivers from the database.
   *
   * @returns A promise that resolves to an array of all driver records
   */
  findAll(): Promise<Driver[]>;

  /**
   * Finds a specific driver by their unique ID.
   *
   * @param id The unique identifier of the driver to find
   * @returns A promise that resolves to the driver if found, or null if not found
   */
  findById(id: string): Promise<Driver | null>;

  /**
   * Finds a driver by their email address.
   * This is useful for login functionality or when checking if an email is already registered.
   *
   * @param email The email address to search for
   * @returns A promise that resolves to the driver if found, or null if not found
   */
  findByEmail(email: string): Promise<Driver | null>;

  /**
   * Creates a new driver record in the database.
   *
   * @param driver The driver entity to create in the database
   * @returns A promise that resolves to the newly created driver record
   */
  create(driver: Driver): Promise<Driver>;

  /**
   * Updates an existing driver's information.
   *
   * @param driver The driver entity with updated information
   * @returns A promise that resolves to the updated driver record
   */
  update(driver: Driver): Promise<Driver>;

  /**
   * Removes a driver record from the database.
   *
   * @param id The unique identifier of the driver to delete
   * @returns A promise that resolves to the deleted driver record
   */
  delete(id: string): Promise<Driver>;
}