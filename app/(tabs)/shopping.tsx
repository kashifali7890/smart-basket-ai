import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { StyleSheet } from "react-native";
import {
  compareShoppingListPrices,
  PriceComparison,
  PriceComparisonResult,
} from "../../services/priceService";
import { getProducts, Product } from "../../services/productService";
import { useShoppingListContext } from "../../store/ShoppingListContext";

interface ShoppingItem {
  item_id: number;
  item_name: string;
  quantity: number;
}

export default function ShoppingListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const { shoppingList, setShoppingList, setComparisonResult } =
    useShoppingListContext();
  const [searchInput, setSearchInput] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [priceComparison, setPriceComparison] = useState<PriceComparison[]>([]);
  const [itemPriceDetails, setItemPriceDetails] = useState<
    PriceComparisonResult["itemComparisons"]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err?.message || "Failed to load products");
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchInput.toLowerCase()),
  );

  const addToList = () => {
    if (!selectedProduct) return;

    const qty = parseInt(quantity) || 1;

    const existingItem = shoppingList.find(
      (item) => item.item_id === selectedProduct.id,
    );

    if (existingItem) {
      setShoppingList(
        shoppingList.map((item) =>
          item.item_id === selectedProduct.id
            ? { ...item, quantity: item.quantity + qty }
            : item,
        ),
      );
    } else {
      setShoppingList([
        ...shoppingList,
        {
          item_id: selectedProduct.id,
          item_name: selectedProduct.name,
          quantity: qty,
        },
      ]);
    }

    setSelectedProduct(null);
    setQuantity("1");
    setSearchInput("");
  };

  const removeFromList = (itemId: number) => {
    setShoppingList(shoppingList.filter((item) => item.item_id !== itemId));
  };

  const comparePrices = async () => {
    if (shoppingList.length === 0) {
      setError("Add items first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const comparison = await compareShoppingListPrices(
        shoppingList.map((item) => ({
          item_id: item.item_id,
          quantity: item.quantity,
        })),
      );
      setPriceComparison(comparison.storeComparisons);
      setItemPriceDetails(comparison.itemComparisons);
      setComparisonResult(comparison);
    } catch (err: any) {
      setError(err?.message || "Failed to compare prices");
    } finally {
      setLoading(false);
    }
  };

  const bestStore = priceComparison?.[0];
  const worstStore = priceComparison?.[priceComparison.length - 1];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Smart Basket AI</Text>

      {/* SEARCH */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Items</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchInput}
          onChangeText={setSearchInput}
        />

        {searchInput && (
          <FlatList
            data={filteredProducts.slice(0, 5)}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productOption}
                onPress={() => setSelectedProduct(item)}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {selectedProduct && (
          <View style={styles.selectedProductBox}>
            <Text style={styles.selectedProductName}>
              {selectedProduct.name}
            </Text>

            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />

            <TouchableOpacity style={styles.addButton} onPress={addToList}>
              <Text style={{ color: "#fff" }}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* LIST */}
      {shoppingList.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your List</Text>

          <FlatList
            data={shoppingList}
            keyExtractor={(item) => String(item.item_id)}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text>{item.item_name}</Text>
                <Text>Qty: {item.quantity}</Text>
              </View>
            )}
          />

          <TouchableOpacity
            onPress={comparePrices}
            style={styles.compareButton}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff" }}>Compare Prices</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* RESULTS */}
      {priceComparison.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Summary</Text>

          <Text>Best Store: {bestStore?.store_name ?? "N/A"}</Text>
          <Text>Total: ${Number(bestStore?.total_price ?? 0).toFixed(2)}</Text>
          <Text>
            Savings vs most expensive store: $
            {Number(bestStore?.savings ?? 0).toFixed(2)}
          </Text>

          <Text style={[styles.sectionTitle, { marginTop: 14 }]}>
            Store Totals
          </Text>
          {priceComparison.map((store) => (
            <Text key={store.store_id} style={styles.storeRow}>
              {store.store_name}: ${store.total_price.toFixed(2)} (
              {store.savings.toFixed(2)} saved)
            </Text>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 14 }]}>
            Item Price Breakdown
          </Text>
          {itemPriceDetails.map((item) => (
            <View key={item.item_id} style={styles.breakdownItem}>
              <Text style={styles.breakdownTitle}>{item.item_name}</Text>
              {item.prices.map((price) => (
                <Text key={price.store_id} style={styles.storeRow}>
                  {price.store_name}: ${price.price.toFixed(2)}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },

  section: {
    marginBottom: 20,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f7f7f7",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },

  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  productOption: {
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  selectedProductBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#e3f2fd",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#90caf9",
  },

  selectedProductName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1976d2",
  },

  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  addButton: {
    backgroundColor: "#2196f3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  compareButton: {
    marginTop: 12,
    backgroundColor: "#4caf50",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  storeRow: {
    fontSize: 14,
    color: "#333",
    marginVertical: 4,
  },

  breakdownItem: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  breakdownTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },

  saveButton: {
    marginTop: 12,
    backgroundColor: "#1976d2",
  },

  error: {
    marginTop: 12,
    color: "#d32f2f",
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 6,
  },

  success: {
    marginTop: 10,
    color: "#2e7d32",
  },
});
