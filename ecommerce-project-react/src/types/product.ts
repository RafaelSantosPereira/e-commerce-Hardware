export interface Product {
  id: number;
  name: string;
  price: number | string;
  image_url: string;
  brand?: string;
  category_id: number;
  description?: string;
  stock?: number;
}

export interface ProductSpec {
  spec_key: string;
  spec_value: string;
}

export interface ProductDetails {
  product: Product;
  specs: ProductSpec[];
}

export interface CategoryFilterOptions {
  brands: string[];
  minPrice: number;
  maxPrice: number;
}

export interface PaginatedProductsResponse {
  products: Product[];
  total: number;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
}
