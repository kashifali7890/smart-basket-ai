import { createContext, ReactNode, useContext, useState } from "react";
import { PriceComparisonResult } from "../services/priceService";

export interface ShoppingItem {
  item_id: number;
  item_name: string;
  quantity: number;
}

interface ShoppingListContextValue {
  shoppingList: ShoppingItem[];
  setShoppingList: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  comparisonResult: PriceComparisonResult | null;
  setComparisonResult: React.Dispatch<
    React.SetStateAction<PriceComparisonResult | null>
  >;
}

const ShoppingListContext = createContext<ShoppingListContextValue | undefined>(
  undefined,
);

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [comparisonResult, setComparisonResult] =
    useState<PriceComparisonResult | null>(null);

  return (
    <ShoppingListContext.Provider
      value={{
        shoppingList,
        setShoppingList,
        comparisonResult,
        setComparisonResult,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingListContext() {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error(
      "useShoppingListContext must be used within a ShoppingListProvider",
    );
  }
  return context;
}
