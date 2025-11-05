import { useState, useEffect } from 'react';
import CardItem from '../../CardItem';
import { useScrollRestore } from '../../useScrollRestore';

function Home({ mainRef }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const idParaCategoria = {
    1: 'processadores',
    2: 'placas-graficas',
    3: 'motherboards',
    4: 'memorias-ram',
    5: 'armazenamento',
    6: 'fontes-de-alimentacao',
    7: 'caixas',
    8: 'coolers',
  };

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL
    fetch(`${apiUrl}/products`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar produtos:", err);
        setLoading(false);
      });
  }, []);

  // Hook para restaurar posição
  const isRestoring = useScrollRestore(mainRef, "homeScrollPosition", !loading && data.length > 0);

  if (loading) {
    return <p className="text-center mt-8">A carregar produtos...</p>;
  }

  return (
    <div
      className={`min-h-screen bg-background dark:bg-darkBackground text-foreground dark:text-darkForeground p-4 ${
        isRestoring ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data.map((product, index) => (
          <CardItem
            key={product.id || index}
            {...product}
            categoria={idParaCategoria[product.category_id]}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
