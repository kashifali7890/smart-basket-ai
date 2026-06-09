import { prices, products, stores } from "./staticData";

export interface Store {
  store_id: string;
  store_name: string;
  city?: string;
}

export interface ShoppingListItem {
  item_id: number;
  quantity: number;
}

export interface StorePrice {
  store_id: string;
  store_name: string;
  price: number;
}

export interface ItemPrices {
  item_id: number;
  item_name: string;
  prices: StorePrice[];
}

export interface PriceComparison {
  store_id: string;
  store_name: string;
  total_price: number;
  savings: number;
  savings_percentage: number;
}

export interface PriceComparisonResult {
  storeComparisons: PriceComparison[];
  itemComparisons: ItemPrices[];
}

export async function getStores() {
  return stores;
}

export async function compareShoppingListPrices(
  shoppingListItems: ShoppingListItem[],
) {
  const productIds = shoppingListItems.map((item) => item.item_id);

  const storeTotals: { [key: string]: { name: string; total: number } } = {};
  const items: ItemPrices[] = [];

  shoppingListItems.forEach((item) => {
    const product = products.find((p) => p.id === item.item_id);
    const matchedPrices = prices
      .filter((priceRow) => priceRow.product_id === item.item_id)
      .map((priceRow) => {
        const store = stores.find((s) => s.store_id === priceRow.store_id);
        return {
          store_id: priceRow.store_id,
          store_name: store?.store_name ?? priceRow.store_id,
          price: priceRow.price,
        };
      });

    items.push({
      item_id: item.item_id,
      item_name: product?.name ?? "Unknown Item",
      prices: matchedPrices,
    });

    matchedPrices.forEach((price) => {
      const storeKey = price.store_id;
      if (!storeTotals[storeKey]) {
        storeTotals[storeKey] = {
          name: price.store_name,
          total: 0,
        };
      }
      storeTotals[storeKey].total += price.price * item.quantity;
    });
  });

  const comparisons: PriceComparison[] = Object.entries(storeTotals)
    .map(([storeId, data]) => ({
      store_id: storeId,
      store_name: data.name,
      total_price: Math.round(data.total * 100) / 100,
      savings: 0,
      savings_percentage: 0,
    }))
    .sort((a, b) => a.total_price - b.total_price);

  const maxPrice = Math.max(...comparisons.map((c) => c.total_price));
  comparisons.forEach((c) => {
    c.savings = Math.round((maxPrice - c.total_price) * 100) / 100;
    c.savings_percentage =
      maxPrice > 0 ? Math.round(((c.savings / maxPrice) * 100 * 100) / 100) : 0;
  });

  return {
    storeComparisons: comparisons,
    itemComparisons: items,
  };
}
