import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import OrderCard from "../OrderCard";
import { useScrollRestore } from "../useScrollRestore";

function Profile({ mainRef }) {
  const { userName } = useAuth(); 
  const token = localStorage.getItem("authToken");
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);


  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem("profileActiveTab") || "dados";
  });

  useEffect(() => {
    sessionStorage.setItem("profileActiveTab", activeTab);
  }, [activeTab]);

  // Buscar encomendas
  useEffect(() => {
    if (activeTab === "encomendas" && token) {
      setLoading(true);
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
  }, [activeTab, token]);

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
      <aside className="w-64 max-h-[81vh] p-5 bg-white dark:bg-[#1f1f1f] border rounded-lg shadow mr-6">
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
      <main className="flex-1 bg-white dark:bg-[#1f1f1f] border rounded-lg shadow p-6 transition-opacity duration-150">
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
