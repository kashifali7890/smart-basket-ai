
export interface ShoppingListOptimization {
  recommendation: string;
  best_store: string;
  potential_savings: number;
  alternative_items: Array<{
    original_item: string;
    alternative_item: string;
    price_difference: number;
  }>;
}

export async function optimizeShoppingList(
  listItems: Array<{
    item_id: string;
    item_name: string;
    quantity: number;
  }>,
  storeComparison: any[],
): Promise<ShoppingListOptimization | null> {
  try {
    if (!storeComparison || storeComparison.length === 0) {
      return null;
    }

    // 🧠 Sort stores by total price (safe copy)
    const sorted = [...storeComparison].sort(
      (a, b) => (a.total_price || 0) - (b.total_price || 0),
    );

    const bestStore = sorted[0];
    const worstStore = sorted[sorted.length - 1];

    const potentialSavings = worstStore?.savings || 0;

    const recommendation = `Shop at ${
      bestStore?.store_name ?? "Best Store"
    } and save ₹${potentialSavings.toFixed(2)} compared to ${
      worstStore?.store_name ?? "other stores"
    }`;

    // 🧠 placeholder for future AI logic
    const alternative_items = listItems.map((item) => ({
      original_item: item.item_name,
      alternative_item: item.item_name, // future AI replacement logic
      price_difference: 0,
    }));

    return {
      recommendation,
      best_store: bestStore?.store_name ?? "Unknown",
      potential_savings: potentialSavings,
      alternative_items,
    };
  } catch (error) {
    console.error("optimizeShoppingList error:", error);
    return null;
  }
}
