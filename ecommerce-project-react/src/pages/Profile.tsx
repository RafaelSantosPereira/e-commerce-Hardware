import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import OrderCard from "@/components/cart/OrderCard";
import { useScrollRestore } from "@/hooks/useScrollRestore";
import type { MainLayoutContext, Order } from "@/types";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type TabType = "dados" | "encomendas";

function Profile() {
  const { mainRef } = useOutletContext<MainLayoutContext>();
  const { userName, isLogged } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    return (sessionStorage.getItem("profileActiveTab") as TabType) || "dados";
  });

  useEffect(() => {
    sessionStorage.setItem("profileActiveTab", activeTab);
  }, [activeTab]);

  // Buscar encomendas
  useEffect(() => {
    if (activeTab === "encomendas" && isLogged) {
      setLoading(true);
      async function fetchOrders() {
        try {
          const res = await fetch(`${apiUrl}/orders`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          if (!res.ok) throw new Error("Erro ao buscar encomendas");
          const data: Order[] = await res.json();
          setOrders(data);
        } catch (err) {
          console.error("Erro ao buscar encomendas:", err);
        } finally {
          setLoading(false);
        }
      }
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [activeTab, isLogged]);

  // Restaurar scroll apenas depois dos dados carregarem
  const isRestoring = useScrollRestore(
    mainRef,
    `profileScrollPosition-${activeTab}`,
    !loading && (activeTab === "encomendas" ? orders.length > 0 : true)
  );

  if (activeTab === "encomendas" && loading) {
    return <p className="text-center mt-8">Carregando encomendas...</p>;
  }

  return (
    <div className="min-h-[100%] flex bg-gray-50 dark:bg-darkBackground text-foreground dark:text-darkForeground p-6">
      {/* SIDEBAR */}
      <aside className="w-64 max-h-[81vh] p-5 bg-white dark:bg-darkSurface border rounded-lg shadow mr-6">
        <h2 className="text-xl font-semibold mb-4">Painel de conta</h2>
        <ul className="space-y-2">
          <li>
            <button
              type="button"
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
              type="button"
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
      <main className="flex-1 bg-white dark:bg-darkSurface border rounded-lg shadow p-6 transition-opacity duration-150">
        <h1 className="text-3xl mb-6 font-bold">
          Olá {userName || "Utilizador"}
        </h1>

        {activeTab === "dados" && (
          <div className={`${isRestoring ? 'opacity-0' : 'opacity-100'}`}>
            <h2 className="text-2xl font-semibold mb-4">Os teus dados</h2>
            <p>Aqui podes ver e editar as tuas informações pessoais.</p>
          </div>
        )}

        {activeTab === "encomendas" && (
          <div className={`${isRestoring ? 'opacity-0' : 'opacity-100'}`}>
            <h2 className="text-2xl font-semibold mb-4">As tuas encomendas</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Ainda não realizou nenhuma encomenda.</p>
            ) : (
              orders.map((order) => (
                <OrderCard key={order.id} {...order} />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;
