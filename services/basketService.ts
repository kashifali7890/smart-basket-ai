import { supabase } from "../lib/supabase";

export async function getBasketComparison(listId: number) {
  const { data, error } = await supabase
    .from("basket_view") // 👈 IMPORTANT: using VIEW now
    .select("*")
    .eq("list_id", listId);

  if (error) {
    console.error("Basket View Error:", error);
    throw error;
  }

  return data;
}
