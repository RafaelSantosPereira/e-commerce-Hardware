import { useCart } from "../contexts/CartContext";
import MiniCardItem from "../MiniCardItem";
import { idParaCategoria } from "@/assets/export_files/idParaCategoria";
import { useAuth } from "../contexts/AuthContext";
import {useState} from "react";
const apiUrl = import.meta.env.VITE_API_URL

function Cart() {
  const { cartItems, totalPrice, clearCart, deleteCart } = useCart();
  const { isLogged, userName, logout } = useAuth();
  const token = localStorage.getItem("authToken");
  const [nome, setNome] = useState("");
  const [morada, setMorada] = useState("");


  const Order = async () => {
    if (!isLogged) {
      alert("Por favor faça login para finalizar a compra.");
      return;
    }

      try{
        const itemsForOrder = cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: Number(item.price),
        }));

        console.log("Items for Order:", itemsForOrder);

        const response = await fetch(`${apiUrl}/order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: itemsForOrder,
            address: morada,
            totalPrice: Number(totalPrice),
            receiver_name: nome,
          }),
        });

       if (response.ok) {

          const data = await response.json();
          
          alert(`${data.message}\n\nNúmero do pedido: #${data.orderId}`);
          
          
          setNome("");
          setMorada("");
          deleteCart();          
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          
        } else {
          alert(data.error || "Erro ao processar a encomenda");
        }


      } catch (err) {
        console.error("Erro ao processar a encomenda:", err);
        alert("Ocorreu um erro ao finalizar a compra.");
      }
        
  }

  return (
    <div className="flex w-full bg-gray-50 dark:bg-background dark. p-6 gap-6 ">
      {/* lista de produtos */}
      <div className="w-2/3 bg-white dark:bg-[#121212] p-4 rounded-lg shadow mr-6">
        {cartItems.length === 0 ? (
          <p className="text-gray-500">O carrinho está vazio</p>
        ) : (
          <ul className="space-y-4">
                {cartItems.map((item) => (
                <MiniCardItem
                  key={item.product_id || item.id}
                  id={item.product_id || item.id}
                  name={item.name}
                  price={item.price}
                  image_url={item.image_url}
                  categoria={idParaCategoria[item.category_id]}
                  quantity={item.quantity}
                />
              ))}
          </ul>
        )}
      </div>

      {/* info cart */}
      <div className="w-1/3 bg-white dark:bg-[#121212] p-4 rounded-lg shadow mr-6">
        <h2 className="text-2xl font-bold mb-4">Resumo</h2>
        
        <form className="flex flex-col gap-3 p-4 mt-4"
          onSubmit={(e) => {
              e.preventDefault(); 
              Order();
            }}
       >
          <input type="text"
            placeholder="Nome do remetente"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1 w-48 px-4 py-2  text-foreground bg-gray-100 rounded-[10px] h-12
              dark:bg-background dark:text-[#d1d5db] placeholder:text-slate-500"
          />
          <input type="text" 
          placeholder="Morada"
          value={morada}
          onChange={(e) => setMorada(e.target.value)}
          className="mt-1 w-48 px-4 py-2 text-foreground bg-gray-100 rounded-[10px] h-12
              dark:bg-background dark:text-[#d1d5db] placeholder:text-slate-500 "
        />
        <p className="text-gray-700 dark:text-gray-300 mt-6 text-xl ">
          Total: <span className="font-bold text-blue-500">{totalPrice.toFixed(2)}€</span>
        </p>
        <button
            type="submit"
            className="mt-4 w-full h-12 text-lg font-semibold bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Finalizar Compra
          </button>
        </form>
        
        
        
      </div>
    </div>
  );
}

export default Cart;
