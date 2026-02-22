import { supabase } from "./supabase";

interface BaseRecord {
  _id: string;
  _createdDate?: string;
  _updatedDate?: string;
}

export class SupabaseCrudService {
  /**
   * Creates a new record in the specified Supabase table.
   * @param tableName The name of the table.
   * @param record The record data to insert.
   * @returns The created record.
   */
  static async create<T extends BaseRecord>(tableName: string, record: Partial<T>): Promise<T> {
    try {
      const dataToInsert: any = { ...record };
      
      // Handle both naming conventions for timestamps
      const now = new Date().toISOString();
      if (!dataToInsert.created_at && !dataToInsert._createdDate) {
        dataToInsert.created_at = now;
      }
      if (!dataToInsert.updated_at && !dataToInsert._updatedDate) {
        dataToInsert.updated_at = now;
      }

      console.log(`[SupabaseCrudService] Inserting into ${tableName}:`, dataToInsert);
      
      const { data, error } = await supabase
        .from(tableName)
        .insert([dataToInsert])
        .select();

      if (error) {
        const errorMsg = `Supabase Error [${error.code}]: ${error.message}`;
        console.error(`[SupabaseCrudService] Error creating record in ${tableName}:`, errorMsg);
        console.error('[SupabaseCrudService] Full error details:', {
          code: error.code,
          message: error.message,
          details: (error as any).details,
          hint: (error as any).hint
        });
        throw new Error(errorMsg);
      }
      console.log(`[SupabaseCrudService] ✓ Successfully created record in ${tableName}:`, data[0]);
      return data[0] as T;
    } catch (err) {
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
      const { data, error } = await supabase
        .from(tableName)
        .select("*");

      if (error) {
        console.warn(`[SupabaseCrudService] Warning: Could not fetch from ${tableName}: ${error.message}`);
        return { items: [] };
      }
      return { items: data as T[] };
    } catch (err) {
      console.warn(`[SupabaseCrudService] Warning: Fetch operation failed for ${tableName}`);
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
    return data as T;
  }

  /**
   * Updates an existing record in the specified Supabase table.
   * Assumes the record has an _id field for identification.
   * @param tableName The name of the table.
   * @param record The record data to update.
   * @returns The updated record.
   */
  static async update<T extends BaseRecord>(tableName: string, record: Partial<T>): Promise<T> {
    if (!record._id) {
      throw new Error("Record must have an _id for updating.");
    }
    const { data, error } = await supabase
      .from(tableName)
      .update({
        ...record,
        _updatedDate: new Date().toISOString(),
      })
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
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("_id", id);

    if (error) {
      throw new Error(`Error deleting record from ${tableName}: ${error.message}`);
    }
  }
}
