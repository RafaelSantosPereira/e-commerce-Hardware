export interface OrderItemInput {
  product_id: number;
  quantity: number;
  price: number;
}

export interface CreateOrderData {
  address: string;
  totalPrice: number;
  receiver_name: string;
  items: OrderItemInput[];
}

export interface Order {
  id: number;
  address: string;
  receiver_name: string;
  total_price: number;
  created_at: Date;
  produtos: Array<Record<string, string | number>>;
}