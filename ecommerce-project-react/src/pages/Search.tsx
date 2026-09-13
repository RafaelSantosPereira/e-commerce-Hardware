import { useLocation, useOutletContext } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { idParaCategoria } from "@/data/idParaCategoria";
import CardItem from '@/components/product/CardItem';
import { useScrollRestore } from "@/hooks/useScrollRestore";
import type { MainLayoutContext, Product } from "@/types";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface LayoutProps {
  children: ReactNode;
}

const SearchLayout = ({ children }: LayoutProps) => (
  <div className="min-h-screen bg-background dark:bg-darkBackground text-foreground dark:text-darkForeground p-6">
    {children}
  </div>
);

interface CenteredMessageProps {
  children: ReactNode;
  className?: string;
}

const CenteredMessage = ({ children, className = "" }: CenteredMessageProps) => (
  <div className={`text-center ${className}`}>
    {children}
  </div>
);

export default function Search() {
  const { mainRef } = useOutletContext<MainLayoutContext>();
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("query"); 
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);
    const limit = 20;
    const offset = 0;

    fetch(`${apiUrl}/products/search?searchQuery=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json() as Promise<Product[]>;
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro na busca:", err);
        setError(err.message || "Erro ao buscar produtos");
        setLoading(false);
      });
  }, [query]);

  const isRestoring = useScrollRestore(mainRef, "SearchScrollPosition", !loading && data.length > 0);
  
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
            Resultados para: "{query || ''}"
          </h1>
          <p className="text-gray-500 mt-2">
            {data.length} produto{data.length !== 1 ? 's' : ''} encontrado{data.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ${
          isRestoring ? 'opacity-0' : 'opacity-100'
        }`}>
          {data.map((product) => (
            <CardItem
              key={product.id}
              {...product}
              categoria={idParaCategoria[product.category_id] || ''}
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
