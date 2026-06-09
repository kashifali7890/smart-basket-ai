export function optimizeBasket(rows: any[]) {
  const result = {
    items: [] as any[],
    storeTotals: {} as Record<string, number>,
    total: 0,
  };

  if (!rows || rows.length === 0) return result;

  rows.forEach((row) => {
    const product = row.product_name || row.products?.name || "Unknown Product";
    const quantity = Number(row.quantity || 1);

    // prices can come as:
    // 1. row.price (flat join)
    // 2. row.prices (nested join)
    const priceList = row.prices || [
      {
        price: row.price,
        store: row.store_name,
      },
    ];

    let cheapest: any = null;

    priceList.forEach((p: any) => {
      const store =
        p.store || p.stores?.store_name || row.store_name || "Unknown";
      const price = Number(p.price || 0);

      if (!cheapest || price < cheapest.price) {
        cheapest = { store, price };
      }
    });

    if (!cheapest || cheapest.price === 0) return;

    const itemTotal = cheapest.price * quantity;

    result.items.push({
      product,
      quantity,
      bestStore: cheapest.store,
      bestPrice: cheapest.price,
      total: itemTotal,
    });

    // store totals
    if (!result.storeTotals[cheapest.store]) {
      result.storeTotals[cheapest.store] = 0;
    }

    result.storeTotals[cheapest.store] += itemTotal;

    result.total += itemTotal;
  });

  return result;
}
