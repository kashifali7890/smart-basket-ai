import React from "react";
import { StyleSheet, Text, View } from "react-native";

// If you are passing these down from a parent or context, destructure them here.
// For example: export default function HomeScreen({ hasItems, comparisonResult, bestStore }) {
export default function HomeScreen({
  hasItems = false,
  comparisonResult = null,
  bestStore = null,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grocery Compare</Text>

      <Text style={styles.subtitle}>
        Build your shopping list in the Shopping List tab, then compare prices
        across stores using static product and store pricing data.
      </Text>

      {!hasItems && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Start your list</Text>
          <Text style={styles.cardText}>
            Add grocery items in the Shopping List tab and tap Compare Prices.
            The app will show your best store and savings without any external
            database.
          </Text>
        </View>
      )}

      {comparisonResult && (
        <>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Best store: {bestStore?.store_name ?? "N/A"}
            </Text>

            <Text style={styles.cardText}>
              Total at best store: $
              {Number(bestStore?.total_price ?? 0).toFixed(2)}
            </Text>

            <Text style={styles.cardText}>
              Savings versus the most expensive store: $
              {Number(bestStore?.savings ?? 0).toFixed(2)}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Store Totals</Text>
            {comparisonResult.storeComparisons?.map((store) => (
              <Text key={store.store_id} style={styles.cardText}>
                {store.store_name}: ${Number(store.total_price ?? 0).toFixed(2)}{" "}
                ({Number(store.savings ?? 0).toFixed(2)} saved)
              </Text>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Item Price Breakdown</Text>
            {comparisonResult.itemComparisons?.map((item) => (
              <View key={item.item_id} style={styles.cardSection}>
                <Text style={styles.itemTitle}>{item.item_name}</Text>
                {item.prices?.map((price) => (
                  <Text key={price.store_id} style={styles.cardText}>
                    {price.store_name}: ${Number(price.price ?? 0).toFixed(2)}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
    color: "#555",
  },
  card: {
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#f7f7f7",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  cardSection: {
    marginBottom: 12,
  },
  itemTitle: {
    fontWeight: "700",
    marginBottom: 4,
  },
  error: {
    color: "red",
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: "#e8f5e9",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  summaryPrice: {
    marginTop: 4,
    fontSize: 16,
    color: "#2e7d32",
  },
  diagnosticCard: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff4e5",
    borderColor: "#ffd699",
    borderWidth: 1,
  },
  diagnosticTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  diagnosticRow: {
    marginBottom: 8,
  },
  diagnosticRowText: {
    fontSize: 14,
    color: "#333",
  },
  diagnosticError: {
    fontSize: 13,
    color: "#b71c1c",
    marginTop: 2,
  },
});
