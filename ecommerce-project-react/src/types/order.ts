export interface OrderProduct {
  id: number;
  name: string;
  category_id: number;
  image_url: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  address: string;
  receiver_name: string;
  total_price: number | string;
  created_at: string;
  produtos: OrderProduct[];
}

export interface OrderItemPayload {
  product_id: number;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
  address: string;
  totalPrice: number;
  receiver_name: string;
}
