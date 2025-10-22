import { act, use, useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import OrderCard from "../OrderCard";

function Profile() {
  const { userName } = useAuth(); 
  const [activeTab, setActiveTab] = useState("dados"); // controla a secção ativa
  const token = localStorage.getItem("authToken");
  const [orders, setOrders] = useState([]); 

  useEffect(() => {
    if (activeTab === "encomendas" && token) {
      async function fetchOrders() {
        try {
          const res = await fetch("http://localhost:3000/orders", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
          const data = await res.json();
          console.log(" Encomendas:", data);
          setOrders(data);
        } catch (err) {
          console.error("Erro ao buscar encomendas:", err);
        }
      }
      fetchOrders();
    }

  }, [activeTab, token]);

    
    
  

  

  return (
    <div className="min-h-[100%] flex bg-gray-50 dark:bg-darkBackground text-foreground dark:text-darkForeground p-6">
      
      {/* SIDEBAR */}
      <aside className="w-64 p-5 bg-white dark:bg-[#1f1f1f] border rounded-lg shadow mr-6">
        <h2 className="text-xl font-semibold mb-4">Painel de conta</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveTab("dados")}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                activeTab === "dados"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
              }`}
            >   
              Dados Pessoais
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("encomendas")}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                activeTab === "encomendas"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
              }`}
            >
              Encomendas
            </button>
          </li>
        </ul>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 bg-white dark:bg-[#1f1f1f] border rounded-lg shadow p-6">
        <h1 className="text-3xl mb-6 font-bold">
          Olá {userName || "Utilizador"}
        </h1>

        {activeTab === "dados" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Os teus dados</h2>
            <p>Aqui podes ver e editar as tuas informações pessoais.</p>
            {/* Podes adicionar aqui um formulário futuramente */}
          </div>
        )}

        {activeTab === "encomendas" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">As tuas encomendas</h2>

            {orders.map((order) => (
              <OrderCard key={order.id} {...order} />
            ))}
          </div>
        )}
            
        
          
        
      </main>
    </div>
  );
}

export default Profile;
