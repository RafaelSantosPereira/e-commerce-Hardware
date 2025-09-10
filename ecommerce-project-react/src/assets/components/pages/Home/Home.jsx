import { useState, useEffect } from 'react';
import Header from '../../Header';
import CardItem from '../../CardItem';

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // opcional

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
    fetch(`http://localhost:3000/products`)
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

  if (loading) {
    return <p className="text-center">Carregando produtos...</p>;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-darkBackground text-foreground dark:text-darkForeground p-4">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data.map((product, index) => (
          <CardItem
            key={index}
            {...product}
            categoria={idParaCategoria[product.category_id]}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;