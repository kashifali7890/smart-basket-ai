export function groupByProduct(rows: any[]) {
  const grouped: Record<string, any> = {};

  rows.forEach((row) => {
    const productId = row.product_id;

    if (!productId) return;

    if (!grouped[productId]) {
      grouped[productId] = {
        product_id: productId,
        product_name: row.product_name || "Unknown Product",
        quantity: Number(row.quantity) || 1,
        stores: [],
      };
    }

    const price = Number(row.price);

    if (!isNaN(price)) {
      grouped[productId].stores.push({
        store: row.store_name || "Unknown Store",
        price: price,
      });
    }
  });

  return Object.values(grouped);
}
export function addSavings(products: any[]) {
  return products.map((p) => {
    const prices = p.stores.map((s: any) => s.price).filter(Boolean);

    if (prices.length === 0) {
      return {
        ...p,
        bestPrice: 0,
        worstPrice: 0,
        saving: 0,
        bestStore: "N/A",
      };
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    const bestStoreObj = p.stores.find((s: any) => s.price === min);

    return {
      ...p,
      bestPrice: min,
      worstPrice: max,
      saving: max - min,
      bestStore: bestStoreObj?.store || "N/A",
    };
  });
}

export function getOptimalBasket(products: any[]) {
  let total = 0;

  const optimized = products.map((p) => {
    const cheapest = p.stores.reduce((min: any, s: any) => {
      return s.price < min.price ? s : min;
    });

    total += cheapest.price * p.quantity;

    return {
      product_name: p.product_name,
      quantity: p.quantity,
      bestStore: cheapest.store,
      bestPrice: cheapest.price,
      total: cheapest.price * p.quantity,
    };
  });

  return {
    total,
    items: optimized,
  };
}
