import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import type { CartContextType, CartItem, GuestCartItem, Product } from "@/types";

const CartContext = createContext<CartContextType | undefined>(undefined);
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface CartProviderProps {
  children: ReactNode;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState<boolean>(false);
  const { isLogged } = useAuth();

  // Função para buscar carrinho do backend ou localStorage
  const fetchCart = async () => {
    if (isLogged) {
      // Se está logado → busca do backend
      setCartLoading(true);
      try {
        const res = await fetch(`${apiUrl}/getcart`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Erro ao buscar carrinho");
        const data: CartItem[] = await res.json();
        setCartItems(data);
      } catch (err) {
        console.error("Erro ao carregar carrinho:", err);
        setCartItems([]);
      } finally {
        setCartLoading(false);
      }
    } else {
      // Se não está logado → carrega do localStorage
      const localCart: GuestCartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

      if (localCart.length > 0) {
        try {
          const ids = localCart.map(item => item.id);
          const res = await fetch(`${apiUrl}/getItems`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids }),
          });

          if (!res.ok) throw new Error("Erro ao buscar produtos");

          const products: Product[] = await res.json();

          // junta infos do produto com a quantidade do carrinho e normaliza product_id
          const cartWithDetails: CartItem[] = localCart.map(item => {
            const product = products.find(p => p.id === item.id);
            return {
              ...item,
              product_id: item.id,
              name: product?.name,
              price: product ? Number(product.price) : 0,
              image_url: product?.image_url,
              category_id: product?.category_id,
            };
          });

          setCartItems(cartWithDetails);
        } catch (err) {
          console.error("Erro ao hidratar carrinho local:", err);
          setCartItems(localCart.map(item => ({ ...item, product_id: item.id })));
        }
      } else {
        setCartItems([]);
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLogged]);

  const addToCart = async (productId: number, quantity: number) => {
    if (isLogged) {
      try {
        const res = await fetch(`${apiUrl}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ productId, quantity }),
        });
        if (!res.ok) throw new Error("Erro ao adicionar ao carrinho");
      } catch (err) {
        console.error(err);
      }
    } else {
      // Carrinho local (quando não está logado)
      const localCart: GuestCartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = localCart.find((item) => item.id === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        localCart.push({ id: productId, quantity });
      }
      localStorage.setItem("cart", JSON.stringify(localCart));
    }
    await fetchCart();
  };

  const deleteItem = async (productId: number) => {
    if (isLogged) {
      // Utilizador logado → remove no backend
      try {
        const res = await fetch(`${apiUrl}/cart/${productId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Erro ao remover item do carrinho");
      } catch (err) {
        console.error(err);
      }
    } else {
      // Utilizador não logado → remove do localStorage
      const localCart: GuestCartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = localCart.filter(item => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
    await fetchCart();
  };

  const deleteCart = async () => {
    if (isLogged) {
      try {
        const res = await fetch(`${apiUrl}/cart`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Erro ao remover item do carrinho");
      } catch (err) {
        console.error(err);
      }
    }

    setCartItems([]);
    localStorage.removeItem("cart");
    await fetchCart();
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        clearCart,
        fetchCart,
        deleteItem,
        deleteCart,
        totalItems,
        totalPrice,
        cartLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
