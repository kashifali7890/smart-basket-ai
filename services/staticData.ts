export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  image_url?: string;
}

export interface Store {
  store_id: string;
  store_name: string;
  city: string;
}

export interface PriceRow {
  product_id: number;
  store_id: string;
  price: number;
}

export const products: Product[] = [
  { id: 1, name: "Milk", description: "2L whole milk", category: "Dairy" },
  { id: 2, name: "Eggs", description: "12-pack large eggs", category: "Dairy" },
  { id: 3, name: "Bread", description: "Whole wheat loaf", category: "Bakery" },
  {
    id: 4,
    name: "Apples",
    description: "Fresh Fuji apples",
    category: "Produce",
  },
  {
    id: 5,
    name: "Coffee",
    description: "Ground coffee 12oz",
    category: "Pantry",
  },
  {
    id: 6,
    name: "Chicken",
    description: "Boneless skinless chicken breasts",
    category: "Meat",
  },
];

export const stores: Store[] = [
  { store_id: "store_1", store_name: "Fresh Market", city: "Seattle" },
  { store_id: "store_2", store_name: "Green Valley", city: "Portland" },
  { store_id: "store_3", store_name: "Budget Basket", city: "Tacoma" },
];

export const prices: PriceRow[] = [
  { product_id: 1, store_id: "store_1", price: 3.49 },
  { product_id: 1, store_id: "store_2", price: 3.19 },
  { product_id: 1, store_id: "store_3", price: 2.99 },
  { product_id: 2, store_id: "store_1", price: 4.29 },
  { product_id: 2, store_id: "store_2", price: 3.99 },
  { product_id: 2, store_id: "store_3", price: 4.15 },
  { product_id: 3, store_id: "store_1", price: 2.79 },
  { product_id: 3, store_id: "store_2", price: 2.59 },
  { product_id: 3, store_id: "store_3", price: 2.49 },
  { product_id: 4, store_id: "store_1", price: 1.29 },
  { product_id: 4, store_id: "store_2", price: 1.19 },
  { product_id: 4, store_id: "store_3", price: 1.09 },
  { product_id: 5, store_id: "store_1", price: 7.99 },
  { product_id: 5, store_id: "store_2", price: 6.89 },
  { product_id: 5, store_id: "store_3", price: 7.49 },
  { product_id: 6, store_id: "store_1", price: 8.99 },
  { product_id: 6, store_id: "store_2", price: 8.49 },
  { product_id: 6, store_id: "store_3", price: 8.19 },
];
