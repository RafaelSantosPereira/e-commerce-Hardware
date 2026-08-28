export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  brand?: string;
  category_id: number;
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

export interface CategoryFilterInput {
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export interface Pagination {
  limit: number;
  offset: number;
}