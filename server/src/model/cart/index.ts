export interface CartItemInput {
  productId: number;
  quantity: number;
}

export interface CartProduct {
  id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image_url: string;
  category_id: number;
}