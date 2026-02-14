import { createClient } from "./client";

/**
 * Inserts a single row into any public Supabase table.
 *
 * @param table  - The name of the public table (e.g. "profiles", "quests").
 * @param values - A key-value object matching the table's column names.
 * @returns The inserted row data, or throws on error.
 *
 * @example
 *   await insertRow("profiles", { id: "abc", username: "john", city: "Boston" });
 */
export async function insertRow<T extends Record<string, unknown>>(
  table: string,
  values: T
) {
  const supabase = createClient();
  const { data, error } = await supabase.from(table).insert(values).select().single();

  if (error) throw new Error(`Insert into "${table}" failed: ${error.message}`);
  return data;
}

/**
 * Queries rows from any public Supabase table by a single field value.
 *
 * @param table - The name of the public table.
 * @param field - The column name to filter on.
 * @param value - The value to match.
 * @returns An array of matching rows, or throws on error.
 *
 * @example
 *   const users = await queryByField("profiles", "username", "johndoe");
 */
export async function queryByField(
  table: string,
  field: string,
  value: string | number | boolean
) {
  const supabase = createClient();
  const { data, error } = await supabase.from(table).select("*").eq(field, value);

  if (error) throw new Error(`Query "${table}" by "${field}" failed: ${error.message}`);
  return data;
}
