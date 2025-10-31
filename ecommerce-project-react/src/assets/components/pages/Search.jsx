import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { idParaCategoria } from "@/assets/export_files/idParaCategoria";
import CardItem from '../CardItem';
import { useScrollRestore } from "../useScrollRestore";
const apiUrl = import.meta.env.VITE_API_URL

// Componente de layout reutilizável
const SearchLayout = ({ children }) => (
  <div className="min-h-screen bg-background dark:bg-darkBackground text-foreground dark:text-darkForeground p-6">
    {children}
  </div>
);

// Componente para mensagens centralizadas
const CenteredMessage = ({ children, className = "" }) => (
  <div className={`text-center ${className}`}>
    {children}
  </div>
);

export default function Search({ mainRef }) {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("query"); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${apiUrl}/products/search?searchQuery=${encodeURIComponent(query)}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      
  }, [query]);


  const isRestoring = useScrollRestore(mainRef, "SearchScrollPosition", !loading && data.length > 0);
  
  // Função para renderizar o conteúdo baseado no estado
  const renderContent = () => {
    

    if (loading) {
      return <CenteredMessage>Carregando...</CenteredMessage>;
    }

    if (error) {
      return (
        <CenteredMessage className="text-red-500">
          Erro ao carregar produtos: {error}
        </CenteredMessage>
      );
    }

    return (
      <>
        {/* Header com resultados */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Resultados para: "{query}"
          </h1>
          <p className="text-gray-500 mt-2">
            {data.length} produto{data.length !== 1 ? 's' : ''} encontrado{data.length !== 1 ? 's' : ''}
          </p>
        </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6
           ${isRestoring ? 'opacity-0' : 'opacity-100'
  }`}>

            {data.map((product) => (
              <CardItem
                key={product.id}
                {...product}
                categoria={idParaCategoria[product.category_id]}
              />
            ))}
          </div>
      </>
    );
  };

  return (
    <SearchLayout>
      {renderContent()}
    </SearchLayout>
  );
}