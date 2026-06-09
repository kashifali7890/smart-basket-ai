import { products } from "./staticData";

export interface Product {
  id: number;
  name: string;
  description?: string;
  category?: string;
  image_url?: string;
}

export async function getProducts() {
  return products;
}
