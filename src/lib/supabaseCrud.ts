import { supabase, isSupabaseConfigured } from "./supabase";

interface BaseRecord {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
}

export class SupabaseCrudService {
  /**
   * Converts camelCase field names to lowercase for the users table.
   * The users table in Supabase uses lowercase column names.
   */
  private static convertUserFieldNames(record: any): any {
    if (!record) return record;
    
    const fieldMappings: Record<string, string> = {
      fullName: 'fullname',
      phoneNumber: 'phonenumber',
      dateOfBirth: 'dateofbirth',
      profilePicture: 'profilepicture',
      joinDate: 'joindate',
      email: 'email',      // stays lowercase
      role: 'role',        // stays lowercase
      _id: '_id',          // stays the same
      department: 'department',  // stays the same
      _createdDate: '_createddate',
      _updatedDate: '_updateddate'
    };

    const converted: any = {};
    for (const [key, value] of Object.entries(record)) {
      const mappedKey = fieldMappings[key] || key;
      converted[mappedKey] = value;
    }
    return converted;
  }

  /**
   * Converts lowercase field names back to camelCase for the users table.
   * When reading from Supabase users table, field names are lowercase.
   */
  private static convertUserFieldNamesFromDB(record: any): any {
    if (!record) return record;
    
    const fieldMappings: Record<string, string> = {
      fullname: 'fullName',
      phonenumber: 'phoneNumber',
      dateofbirth: 'dateOfBirth',
      profilepicture: 'profilePicture',
      joindate: 'joinDate',
      email: 'email',        // stays lowercase
      role: 'role',          // stays lowercase
      _id: '_id',            // stays the same
      department: 'department', // stays the same
      _createddate: '_createdDate',
      _updateddate: '_updatedDate'
    };

    const converted: any = {};
    for (const [key, value] of Object.entries(record)) {
      const mappedKey = fieldMappings[key] || key;
      converted[mappedKey] = value;
    }
    return converted;
  }

  /**
   * Converts field names for studentapprovals/teacherapprovals tables
   * Note: These tables use camelCase, not lowercase (unlike the users table)
   * So we only pass through the data as-is
   */
  private static convertApprovalFieldNames(record: any): any {
    // studentapprovals and teacherapprovals use camelCase in the schema
    // no conversion needed - return as-is
    return record;
  }

  /**
   * Converts field names back for studentapprovals/teacherapprovals tables
   * Note: These tables use camelCase, so no conversion needed
   */
  private static convertApprovalFieldNamesFromDB(record: any): any {
    // studentapprovals and teacherapprovals use camelCase in the schema
    // no conversion needed - return as-is
    return record;
  }

  /**
   * Creates a new record in the specified Supabase table.
   * @param tableName The name of the table.
   * @param record The record data to insert.
   * @returns The created record.
   */
  static async create<T extends BaseRecord>(tableName: string, record: Partial<T>): Promise<T> {
    try {
      // Handle when Supabase is not configured (GitHub Pages static deployment)
      if (!supabase || !isSupabaseConfigured) {
        throw new Error("Supabase is not configured in this build.");
      }

      let dataToInsert: any = { ...record };
      
      // Convert field names for tables with lowercase column names
      if (tableName === 'users') {
        dataToInsert = this.convertUserFieldNames(dataToInsert);
      } else if (tableName === 'studentapprovals' || tableName === 'teacherapprovals') {
        dataToInsert = this.convertApprovalFieldNames(dataToInsert);
      }
      
      // Do not auto-inject timestamp fields because table schemas vary
      // across environments (e.g. _createddate vs _createdDate vs created_at).
      // Injecting unknown columns causes PostgREST insert failures.

      console.log(`[SupabaseCrudService] Inserting into ${tableName}:`, dataToInsert);
      
      const { data, error } = await supabase
        .from(tableName)
        .insert([dataToInsert])
        .select();

      if (error) {
        const errorMsg = `Supabase Error [${error.code}]: ${error.message}`;
        throw new Error(`Could not create record in ${tableName}: ${errorMsg}`);
      }
      console.log(`[SupabaseCrudService] ✓ Successfully created record in ${tableName}:`, data[0]);
      return data[0] as T;
    } catch (err: any) {
      console.error(`[SupabaseCrudService] Error in create operation for ${tableName}:`, err);
      throw err;
    }
  }

  /**
   * Retrieves all records from the specified Supabase table.
   * @param tableName The name of the table.
   * @returns An object containing the items (records) from the table.
   */
  static async getAll<T>(tableName: string): Promise<{ items: T[] }> {
    try {
      // Handle when Supabase is not configured (GitHub Pages static deployment)
      if (!supabase || !isSupabaseConfigured) {
        console.warn(`[SupabaseCrudService] Supabase not initialized - returning empty items for ${tableName}`);
        return { items: [] };
      }

      const { data, error } = await supabase
        .from(tableName)
        .select("*");

      if (error) {
        console.warn(`[SupabaseCrudService] Warning: Could not fetch from ${tableName}: ${error.message}`);
        return { items: [] };
      }
      
      // Convert field names back to camelCase for tables with lowercase column names
      let items: any[] = data || [];
      if (tableName === 'users') {
        items = items.map(item => this.convertUserFieldNamesFromDB(item));
      } else if (tableName === 'studentapprovals' || tableName === 'teacherapprovals') {
        items = items.map(item => this.convertApprovalFieldNamesFromDB(item));
      }
      
      return { items: items as T[] };
    } catch (err) {
      console.warn(`[SupabaseCrudService] Warning: Fetch operation failed for ${tableName}:`, err);
      return { items: [] };
    }
  }

  /**
   * Retrieves a single record by its ID from the specified Supabase table.
   * @param tableName The name of the table.
   * @param id The ID of the record to retrieve.
   * @returns The record if found, otherwise null.
   */
  static async getById<T extends BaseRecord>(tableName: string, id: string): Promise<T | null> {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error("Supabase is not configured in this build.");
    }
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("_id", id)
      .single();

    if (error && error.code === "PGRST116") { // PGRST116 means no rows found for single() query
      return null;
    } else if (error) {
      throw new Error(`Error fetching record by ID from ${tableName}: ${error.message}`);
    }
    
    // Convert field names back to camelCase for tables with lowercase column names
    let result: any = data;
    if (tableName === 'users' && result) {
      result = this.convertUserFieldNamesFromDB(result);
    } else if ((tableName === 'studentapprovals' || tableName === 'teacherapprovals') && result) {
      result = this.convertApprovalFieldNamesFromDB(result);
    }
    
    return result as T;
  }

  /**
   * Updates an existing record in the specified Supabase table.
   * Assumes the record has an _id field for identification.
   * @param tableName The name of the table.
   * @param record The record data to update.
   * @returns The updated record.
   */
  static async update<T extends BaseRecord>(tableName: string, record: Partial<T>): Promise<T> {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error("Supabase is not configured in this build.");
    }
    if (!record._id) {
      throw new Error("Record must have an _id for updating.");
    }
    
    let dataToUpdate: any = { ...record };
    
    // Convert field names for the users table
    if (tableName === 'users') {
      dataToUpdate = this.convertUserFieldNames(dataToUpdate);
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .update(dataToUpdate)
      .eq("_id", record._id)
      .select();

    if (error) {
      throw new Error(`Error updating record in ${tableName}: ${error.message}`);
    }
    return data[0] as T;
  }

  /**
   * Deletes a record from the specified Supabase table by its ID.
   * @param tableName The name of the table.
   * @param id The ID of the record to delete.
   */
  static async delete(tableName: string, id: string): Promise<void> {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error("Supabase is not configured in this build.");
    }
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("_id", id);

    if (error) {
      throw new Error(`Error deleting record from ${tableName}: ${error.message}`);
    }
  }
}
