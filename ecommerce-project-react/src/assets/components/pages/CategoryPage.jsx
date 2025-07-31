import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CardItem from '../CardItem'; // ajusta o path conforme tua estrutura

function CategoryPage() {
  const { categoria } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/data/cpu.json')
      .then(res => res.json())
      .then(data => {
        console.log('Dados recebidos:', data);
        if (categoria === 'processadores') {
          setProducts(data.slice(0, 20)); // Apenas os primeiros 20 CPUs
        } else {
          setProducts([]);
        }
      })
      .catch(err => console.error('Erro ao carregar JSON:', err));
  }, [categoria]);

  return (
    <div className="min-h-screen bg-background dark:bg-darkBackground text-foreground dark:text-darkForeground p-6">
      <h1 className="text-2xl font-bold capitalize mb-4">{categoria.replace('-', ' ')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((cpu, index) => (
          <CardItem key={index} {...cpu} categoria={categoria}/>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
