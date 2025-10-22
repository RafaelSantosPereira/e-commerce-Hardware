import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const token = localStorage.getItem("authToken");

  // Função para buscar carrinho do backend
  const fetchCart = async () => {
    

    if (token) {
      // Se está logado → busca do backend
      setCartLoading(true);
      try {
        const res = await fetch("http://localhost:3000/getcart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao buscar carrinho");
        const data = await res.json();
        setCartItems(data);
      } catch (err) {
        console.error(err);
        setCartItems([]);
      } finally {
        setCartLoading(false);
      }
    } else {
      // Se não está logado → carrega do localStorage
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(localCart);

      if (localCart.length > 0) {
        try {
          const ids = localCart.map(item => item.id);
          const res = await fetch("http://localhost:3000/getItems", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids }),
          });

          if (!res.ok) throw new Error("Erro ao buscar produtos");

          const products = await res.json();

          // junta infos do produto com a quantidade do carrinho
          const cartWithDetails = localCart.map(item => ({
            ...item,
            ...products.find(p => p.id === item.id), 
          }));

          setCartItems(cartWithDetails);
          console.log(cartWithDetails);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };


  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity) => {
    
    if (token) {
      try {
        const res = await fetch("http://localhost:3000/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity }),
        });
        if (!res.ok) throw new Error("Erro ao adicionar ao carrinho");
      } catch (err) {
        console.error(err);
      }
    } else {
      // Carrinho local (quando não está logado)
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = localCart.find((item) => item.id === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        localCart.push({ id: productId, quantity });
      }
      localStorage.setItem("cart", JSON.stringify(localCart));
      setCartItems(localCart);
    }
    await fetchCart(); 

  };

  const deleteItem = async (productId) => {

    if (token) {
      // Utilizador logado → remove no backend
      try {
        const res = await fetch(`http://localhost:3000/cart/${productId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao remover item do carrinho");
        
      } catch (err) {
        console.error(err);
      }
    } else {
      // Utilizador não logado → remove do localStorage
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = localCart.filter(item => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    }
    await fetchCart();
  };

  const deleteCart = async () => {

    if (token) {
      
      try {
        const res = await fetch(`http://localhost:3000/cart`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao remover item do carrinho");
        
      } catch (err) {
        console.error(err);
      }
    } 


    setCartItems([]);
    localStorage.removeItem("cart");
    await fetchCart();
  }
    

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, clearCart, fetchCart, deleteItem, deleteCart, totalItems, totalPrice, cartLoading }}
    >
      {children}
    </CartContext.Provider>
  );
}
