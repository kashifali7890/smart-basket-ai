import { supabase } from "../lib/supabase";

/**
 * Get latest shopping list for a user
 */
function getListIdFromRow(row: Record<string, any> | null) {
  if (!row) return null;
  return row.list_id ?? row.id ?? row.shopping_list_id ?? row.listid ?? null;
}

export async function getUserLatestList(user_id: number) {
  const selectRawLatest = async () =>
    supabase
      .from("shopping_lists")
      .select("*")
      .eq("user_id", Number(user_id))
      .order("created_at", { ascending: false })
      .limit(1);

  const { data, error } = await selectRawLatest();

  if (error) throw error;

  if (data && data.length > 0) {
    console.log("Raw shopping list data for user_id=1:", data);
    return getListIdFromRow(data[0] as Record<string, any>);
  }

  const { data: fallbackData, error: fallbackError } = await supabase
    .from("shopping_lists")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  if (fallbackError) throw fallbackError;

  if (fallbackData && fallbackData.length > 0) {
    console.log("Shopping list fallback data:", fallbackData);
    return getListIdFromRow(fallbackData[0] as Record<string, any>);
  }

  let itemData: any[] | null = null;
  let itemError: any = null;

  const listIdResult = await supabase
    .from("shopping_list_items")
    .select("list_id")
    .limit(1);

  if (listIdResult.error) {
    const shoppingListIdResult = await supabase
      .from("shopping_list_items")
      .select("shopping_list_id")
      .limit(1);

    itemData = shoppingListIdResult.data as any[] | null;
    itemError = shoppingListIdResult.error;
  } else {
    itemData = listIdResult.data as any[] | null;
  }

  if (itemError) throw itemError;

  if (itemData && itemData.length > 0) {
    console.log("Shopping list item fallback data:", itemData);
    return getListIdFromRow(itemData[0] as Record<string, any>);
  }

  return null;
}

/**
 * Get shopping list items
 */
export async function getUserBasket(listId: number) {
  let data: any[] | null = null;
  let error: any = null;

  const listIdResult = await supabase
    .from("shopping_list_items")
    .select("*")
    .eq("list_id", listId);

  if (!listIdResult.error) {
    data = listIdResult.data as any[] | null;
  } else {
    const shoppingListIdResult = await supabase
      .from("shopping_list_items")
      .select("*")
      .eq("shopping_list_id", listId);

    data = shoppingListIdResult.data as any[] | null;
    error = shoppingListIdResult.error;
  }

  if (error) throw error;

  return data ?? [];
}

/**
 * Get all products
 */
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, category");

  if (error) throw error;

  return data ?? [];
}

/**
 * Get all prices
 */
export async function getPrices() {
  const { data, error } = await supabase
    .from("prices")
    .select("product_id, store_id, price");

  if (error) throw error;

  return data ?? [];
}

/**
 * Get all stores
 */
export async function getStores() {
  const { data, error } = await supabase
    .from("stores")
    .select("id, store_id, name, store_name, location, city");

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    store_id: row.store_id ?? row.id,
    store_name: row.store_name ?? row.name,
    city: row.location ?? row.city,
  }));
}

export interface SupabaseDiagnosticsEntry {
  table: string;
  status: "ok" | "empty" | "error";
  rowsFound: number;
  error?: string;
}

export async function getSupabaseDiagnostics() {
  const tables = [
    "shopping_lists",
    "shopping_list_items",
    "stores",
    "prices",
    "products",
  ];

  const diagnostics: SupabaseDiagnosticsEntry[] = [];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("*").limit(1);

    diagnostics.push({
      table,
      rowsFound: data?.length ?? 0,
      status: error ? "error" : data?.length ? "ok" : "empty",
      error: error?.message,
    });
  }

  return diagnostics;
}

export async function createShoppingList(user_id: number) {
  const { data, error } = await supabase
    .from("shopping_lists")
    .insert([{ user_id }])
    .select("id, list_id, shopping_list_id")
    .single();

  if (error) throw error;

  return getListIdFromRow(data as Record<string, any> | null);
}

export async function addShoppingListItems(
  listId: number,
  items: Array<{ product_id: number; quantity: number }>,
) {
  if (!items.length) return [];

  const rows = items.map((item) => ({
    list_id: listId,
    product_id: item.product_id,
    quantity: item.quantity ?? 1,
  }));

  const { data, error } = await supabase
    .from("shopping_list_items")
    .insert(rows)
    .select("*");

  if (error) throw error;

  return data ?? [];
}
