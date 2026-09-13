export interface CartItem {
  id?: number;
  product_id?: number;
  quantity: number;
  name?: string;
  price?: number;
  image_url?: string;
  category_id?: number;
}

export interface GuestCartItem {
  id: number;
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  deleteItem: (productId: number) => Promise<void>;
  deleteCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  cartLoading: boolean;
}
