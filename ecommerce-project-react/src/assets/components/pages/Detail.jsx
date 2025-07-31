import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ryzenImg from '../../images/168-amd-ryzen-7-5800x-38ghz.webp';

function Detail() {
  const { itemId, categoria } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch('/data/cpu.json')
      .then(res => res.json())
      .then(data => {
        const found = data.find(item => String(item.id) === itemId);
        setProduct(found);
      });
  }, [itemId]);

  const increaseQty = () => setQuantity(q => q + 1);
  const decreaseQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const addToCart = () => {
    console.log('Adicionar ao carrinho:', product, 'Quantidade:', quantity);
    // aqui entra a lógica real de adicionar ao carrinho
  };

  if (!product) return <p className="p-6">A carregar produto...</p>;

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-[#111] text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

        {/* Imagem do produto */}
        <div className="bg-white dark:bg-[#1f1f1f] rounded-xl shadow-md p-6">
          <img src={ryzenImg} alt={product.name} className="w-full rounded-xl border dark:border-gray-700" />
        </div>

        {/* Informações do produto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl text-blue-500 font-semibold">€{product.price.toFixed(2)}</p>
          </div>

          <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
            <h2 className="text-lg font-semibold mb-2">Especificações:</h2>
            <ul className="text-sm space-y-1">
              <li><strong>Núcleos:</strong> {product.core_count}</li>
              <li><strong>Clock base:</strong> {product.core_clock} GHz</li>
              <li><strong>Clock turbo:</strong> {product.boost_clock} GHz</li>
              <li><strong>Microarquitetura:</strong> {product.microarchitecture}</li>
              <li><strong>Gráficos integrados:</strong> {product.graphics || 'Nenhum'}</li>
              <li><strong>TDP:</strong> {product.tdp} W</li>
            </ul>
          </div>

          <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
            <h2 className="text-lg font-semibold mb-2">Descrição:</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Este processador de alto desempenho é ideal para gamers e profissionais que exigem potência e eficiência.
              Com uma arquitetura moderna e suporte para multitarefa intensiva, ele oferece excelente performance em todas as situações.
            </p>
          </div>

          {/* Quantidade + botão */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border rounded-lg bg-white dark:bg-[#1f1f1f] border-gray-300 dark:border-gray-600">
              <button onClick={decreaseQty} className="px-3 py-2 text-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700">−</button>
              <span className="px-4 text-lg">{quantity}</span>
              <button onClick={increaseQty} className="px-3 py-2 text-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700">+</button>
            </div>

            <button
              onClick={addToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
