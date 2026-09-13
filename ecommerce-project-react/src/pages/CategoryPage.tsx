import { useParams, useSearchParams, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CardItem from '@/components/product/CardItem';
import FilterSidebar from '@/components/product/FilterSidebar';
import { useScrollRestore } from '@/hooks/useScrollRestore';
import { categoriaParaId } from '@/data/idParaCategoria';
import type { MainLayoutContext, Product, PaginatedProductsResponse, CategoryFilterOptions } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getPaginationItems(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis-right', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, 'ellipsis-left', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'ellipsis-left', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-right', totalPages];
}

function CategoryPage() {
  const { mainRef } = useOutletContext<MainLayoutContext>();
  const { categoria = '' } = useParams<{ categoria: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [filtersInitialized, setFiltersInitialized] = useState<boolean>(false);
  const [initializedCategory, setInitializedCategory] = useState<string | null>(null);
  const productsPerPage = 15;

  useEffect(() => {
    const brandsFromUrl = searchParams.get("brands");
    setSelectedBrands(brandsFromUrl ? brandsFromUrl.split(',') : []);
  }, [searchParams]);

  useEffect(() => {
    setFiltersInitialized(false);
    setInitializedCategory(null);
    setCurrentPage(1);
    setLoading(true);
  }, [categoria]);

  // Obter as opções globais de filtro da categoria
  useEffect(() => {
    const id = categoriaParaId[categoria];
    if (!id) return;

    fetch(`${apiUrl}/products/category/id/${id}/filters`)
      .then(res => res.json() as Promise<CategoryFilterOptions>)
      .then(({ brands: availableBrands, minPrice: categoryMinPrice, maxPrice: categoryMaxPrice }) => {
        const numericMinPrice = Number(categoryMinPrice) || 0;
        const numericMaxPrice = Number(categoryMaxPrice) || 1000;

        setBrands(availableBrands || []);
        setMinPrice(numericMinPrice);
        setMaxPrice(numericMaxPrice);
        setPriceRange([numericMinPrice, numericMaxPrice]);
        setFiltersInitialized(true);
        setInitializedCategory(categoria);
      })
      .catch(err => {
        console.error("Erro ao carregar filtros da categoria:", err);
      });
  }, [categoria]);

  // Obter produtos já filtrados e ordenados pela base de dados
  useEffect(() => {
    const id = categoriaParaId[categoria];
    if (!id || !filtersInitialized || initializedCategory !== categoria) return;
    const quantidade = productsPerPage;
    const offset = (currentPage - 1) * quantidade;
    const params = new URLSearchParams({
      limit: quantidade.toString(),
      offset: offset.toString(),
    });

    if (selectedBrands.length > 0) params.set('brands', selectedBrands.join(','));
    params.set('minPrice', priceRange[0].toString());
    params.set('maxPrice', priceRange[1].toString());
    if (sortOption) params.set('sort', sortOption);
    
    fetch(`${apiUrl}/products/category/id/${id}?${params}`)
      .then(res => res.json() as Promise<PaginatedProductsResponse>)
      .then(({ products, total }) => {
        setData(products || []);
        setTotalProducts(total || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar produtos:", err);
        setLoading(false);
      });
  }, [categoria, currentPage, selectedBrands, priceRange, sortOption, filtersInitialized, initializedCategory]);

  const handleBrandToggle = (brand: string) => {
    const updated = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];

    const params = new URLSearchParams(searchParams);
    if (updated.length > 0) {
      params.set('brands', updated.join(','));
    } else {
      params.delete('brands');
    }
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  const handlePriceChange = (range: number[]) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    mainRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isRestoring = useScrollRestore(
    mainRef,
    `categoryScroll-${categoria}`,
    !loading && data.length > 0
  );

  if (loading) return <div className="p-6">A carregar produtos...</div>;
  if (!data.length) return <div className="p-6">Nenhum produto encontrado para os filtros selecionados.</div>;

  return (
    <div
      className={`min-h-screen bg-background dark:bg-darkBackground text-foreground dark:text-darkForeground p-4 
      ${isRestoring ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className='flex flex-row m-5'>
        <h1 className="text-4xl font-bold capitalize mb-4">{categoria.replace('-', ' ')}</h1>
        <div className='ml-auto flex bg-white dark:bg-darkSurface border rounded-lg shadow p-4'>
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
          {data.map((product) => (
            <CardItem key={product.id} {...product} categoria={categoria} />
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Paginação de produtos">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Página anterior"
          >
            Anterior
          </button>

          {getPaginationItems(currentPage, totalPages).map(page => (
            typeof page === 'number' ? (
              <button
                type="button"
                key={page}
                onClick={() => goToPage(page)}
                aria-current={page === currentPage ? 'page' : undefined}
                className={`w-10 h-10 border rounded-md ${page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={page} className="px-1" aria-hidden="true">
                ...
              </span>
            )
          ))}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Próxima página"
          >
            Próxima
          </button>
        </nav>
      )}
    </div>
  );
}

export default CategoryPage;
