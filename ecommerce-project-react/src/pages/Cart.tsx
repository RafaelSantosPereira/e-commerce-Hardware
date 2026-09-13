import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import MiniCardItem from "@/components/product/MiniCardItem";
import { idParaCategoria } from "@/data/idParaCategoria";
import { useAuth } from "@/contexts/AuthContext";
import type { OrderItemPayload, CreateOrderPayload } from "@/types";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Cart() {
  const { cartItems, totalPrice, deleteCart } = useCart();
  const { isLogged } = useAuth();
  const [nome, setNome] = useState<string>("");
  const [morada, setMorada] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleOrder = async () => {
    if (!isLogged) {
      alert("Por favor faça login para finalizar a compra.");
      navigate("/login");
      return;
    }

    if (!cartItems.length) {
      alert("O carrinho está vazio.");
      return;
    }

    setSubmitting(true);
    try {
      const itemsForOrder: OrderItemPayload[] = cartItems.map(item => ({
        product_id: Number(item.product_id || item.id),
        quantity: item.quantity,
        price: Number(item.price || 0),
      }));

      const payload: CreateOrderPayload = {
        items: itemsForOrder,
        address: morada,
        totalPrice: Number(totalPrice),
        receiver_name: nome,
      };

      const response = await fetch(`${apiUrl}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        alert(`${data.message || "Encomenda criada com sucesso!"}\n\nNúmero do pedido: #${data.orderId || ''}`);
        setNome("");
        setMorada("");
        await deleteCart();
        navigate('/');
      } else {
        alert(data.message || data.error || "Erro ao processar a encomenda");
      }
    } catch (err) {
      console.error("Erro ao processar a encomenda:", err);
      alert("Ocorreu um erro ao finalizar a compra.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full bg-gray-50 dark:bg-background p-6 gap-6 min-h-screen">
      {/* lista de produtos */}
      <div className="w-full md:w-2/3 bg-white dark:bg-darkSurface p-4 rounded-lg shadow">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">O carrinho está vazio</p>
        ) : (
          <ul className="space-y-4">
            {cartItems.map((item) => {
              const itemId = item.product_id || item.id || 0;
              const categoryName = item.category_id ? idParaCategoria[item.category_id] : '';
              return (
                <MiniCardItem
                  key={itemId}
                  id={itemId}
                  name={item.name}
                  price={item.price}
                  image_url={item.image_url}
                  categoria={categoryName}
                  quantity={item.quantity}
                />
              );
            })}
          </ul>
        )}
      </div>

      {/* info cart */}
      <div className="w-full md:w-1/3 bg-white dark:bg-darkSurface p-6 rounded-lg shadow h-fit">
        <h2 className="text-2xl font-bold mb-4">Resumo</h2>
        
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault(); 
            handleOrder();
          }}
        >
          <label className="flex flex-col gap-1 text-sm font-medium">
            <span>Nome do destinatário</span>
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              required
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 text-foreground bg-gray-100 rounded-lg h-12
                dark:bg-darkBackground dark:text-darkForeground placeholder:text-slate-500 border border-gray-300 dark:border-gray-700"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            <span>Morada de entrega</span>
            <input
              type="text" 
              placeholder="Rua, Número, Código Postal"
              required
              value={morada}
              onChange={(e) => setMorada(e.target.value)}
              className="w-full px-4 py-2 text-foreground bg-gray-100 rounded-lg h-12
                dark:bg-darkBackground dark:text-darkForeground placeholder:text-slate-500 border border-gray-300 dark:border-gray-700"
            />
          </label>

          <p className="text-gray-700 dark:text-gray-300 mt-4 text-xl">
            Total: <span className="font-bold text-blue-500">{totalPrice.toFixed(2)}€</span>
          </p>

          <button
            type="submit"
            disabled={submitting || cartItems.length === 0}
            className="mt-4 w-full h-12 text-lg font-semibold bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "A processar..." : "Finalizar Compra"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Cart;
