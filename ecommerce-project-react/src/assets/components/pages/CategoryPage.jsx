// src/pages/CategoryPage.jsx
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CardItem from '../CardItem';
import FilterSidebar from '../FilterSidebar';
import { useScrollRestore } from '../useScrollRestore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const apiUrl = import.meta.env.VITE_API_URL


const categoriaParaId = {
  'processadores': 1,
  'placas-graficas': 2,
  'motherboards': 3,
  'memorias-ram': 4,
  'armazenamento': 5,
  'fontes-de-alimentacao': 6,
  'caixas': 7,
  'coolers': 8,
};

// IMPORTS MANTIDOS...

function CategoryPage({ mainRef }) {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]); // inicial
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const brandsFromUrl = searchParams.get("brands");
    if (brandsFromUrl) {
      setSelectedBrands(brandsFromUrl.split(','));
    }
  }, [searchParams]);

  // Obter produtos
 useEffect(() => {
  const id = categoriaParaId[categoria];
  if (!id) return;

  fetch(`${apiUrl}/products/category/id/${id}`)
    .then(res => res.json())
    .then(json => {
      setData(json);
      setFilteredData(json);
      const uniqueBrands = [...new Set(json.map(item => item.brand))].filter(Boolean);
      setBrands(uniqueBrands);

      const prices = json.map(p => p.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setMinPrice(min);
      setMaxPrice(max);
      setPriceRange([min, max]);

      setLoading(false);
    });
}, [categoria]);

// Aplicar filtros
useEffect(() => {
  let dataSort = [...data];

  if (selectedBrands.length > 0) {
    dataSort = dataSort.filter(product => selectedBrands.includes(product.brand));
  }

  // Filtro por preço
  dataSort = dataSort.filter(product => 
    product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  if (sortOption === 'price-asc') {
    dataSort.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    dataSort.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'name-asc') {
    dataSort.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'name-desc') {
    dataSort.sort((a, b) => b.name.localeCompare(a.name));
  }

  setFilteredData(dataSort);
}, [data, selectedBrands, priceRange, sortOption]);

  const handleBrandToggle = (brand) => {
    let updated = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];

    setSelectedBrands(updated);

    const params = new URLSearchParams(searchParams);
    if (updated.length > 0) {
      params.set('brands', updated.join(','));
    } else {
      params.delete('brands');
    }
    setSearchParams(params);
  };

  const handleSortChange = (value) => setSortOption(value);

  const handlePriceChange = (range) => setPriceRange(range);

  const isRestoring = useScrollRestore(
  mainRef,
  `categoryScroll-${categoria}`, // chave única por categoria
  !loading && data.length > 0      // habilita quando os dados carregam
);

  if (loading) return <div>A carregar produtos...</div>;
  if (!data.length) return <div>Categoria não encontrada.</div>;

  return (
      <div
      className={`min-h-screen bg-background dark:bg-darkBackground text-foreground dark:text-darkForeground p-4 
      ${isRestoring ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className='flex flex-row m-5'>
        <h1 className="text-4xl font-bold capitalize mb-4">{categoria.replace('-', ' ')}</h1>
        <div className='ml-auto flex bg-white dark:bg-[#1f1f1f] border rounded-lg shadow p-4'>
          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="w-[200px] bg-gray-50 dark:text-[#d1d5db] dark:bg-darkBackground">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Preço: Menor para Maior</SelectItem>
              <SelectItem value="price-desc">Preço: Maior para Menor</SelectItem>
              <SelectItem value="name-asc">Nome: A-Z</SelectItem>
              <SelectItem value="name-desc">Nome: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex">
        <FilterSidebar
          brands={brands}
          selectedBrands={selectedBrands}
          handleBrandToggle={handleBrandToggle}
          priceRange={priceRange}
          onPriceChange={handlePriceChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {filteredData.map((product, index) => (
            <CardItem key={index} {...product} categoria={categoria} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;

