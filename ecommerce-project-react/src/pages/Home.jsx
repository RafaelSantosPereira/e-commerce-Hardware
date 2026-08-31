// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useScrollRestore } from '../hooks/useScrollRestore';
import { HeroBanner } from '../components/product/Banner';
import { banners } from '../data/banners';
import { ProductCarousel } from '../components/product/ProductCarousel'

function Home({ mainRef }) {
  const [gpus, setGpus] = useState([]);
  const [cpus, setCpus] = useState([]);
  const [rams, setRams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const limit = 10; // Quantidade de itens por carrossel

    Promise.all([
      fetch(`${apiUrl}/products/category/id/2?limit=${limit}`).then(res => res.json()), // Placas Gráficas
      fetch(`${apiUrl}/products/category/id/1?limit=${limit}`).then(res => res.json()), // Processadores
      fetch(`${apiUrl}/products/category/id/4?limit=${limit}`).then(res => res.json())  // Memórias RAM
    ])
      .then(([gpuData, cpuData, ramData]) => {
        setGpus(gpuData.products || []);
        setCpus(cpuData.products || []);
        setRams(ramData.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar produtos para a home:", err);
        setLoading(false);
      });
  }, []);

  const hasProducts = gpus.length > 0 || cpus.length > 0 || rams.length > 0;
  const isRestoring = useScrollRestore(mainRef, "homeScrollPosition", !loading && hasProducts);

  if (loading) {
    return <p className="text-center mt-8">A carregar produtos...</p>;
  }

  return (
    <div
      className={`min-h-screen w-full border-2 bg-background dark:bg-darkBackground text-foreground dark:text-darkForeground p-4 ${
        isRestoring ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <HeroBanner banners={banners} />

      <div className="w-full px-2">
        

        <ProductCarousel
          title="Placas Gráficas"
          products={gpus}
          categoria="placas-graficas"
          linkVerMais="/placas-graficas" 
        />
        <ProductCarousel
          title="Processadores"
          products={cpus}
          categoria="processadores"
          linkVerMais="/processadores" 
        />
        <ProductCarousel
          title="Memórias RAM"
          products={rams}
          categoria="memorias-ram"
          linkVerMais="/memorias-ram"
        />
      </div>
    </div>
  );
}

export default Home;