
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";


function FilterSidebar({
  brands,
  selectedBrands,
  handleBrandToggle,
  priceRange,
  onPriceChange,
  minPrice,
  maxPrice
}) {
  const [showBrands, setShowBrands] = useState(true);
  const [localPrice, setLocalPrice] = useState(priceRange);

  useEffect(() => {
    setLocalPrice(priceRange); // Sincroniza com filtros aplicados ao voltar à página
  }, [priceRange]);

  return (
    <div className="w-52 mr-5 p-5 bg-white dark:bg-[#1f1f1f] border rounded-lg shadow max-h-fit">
      <h2 className="text-xl font-semibold mb-4">Filtros</h2>

      <div className="mb-4">
        <button
          onClick={() => setShowBrands(!showBrands)}
          className="flex items-center justify-between gap-2 text-left text-lg font-medium mb-2"
        >
          <span>Marca</span>
          {showBrands ? <ChevronDown size={20} /> : <ChevronRight size={20} className="mt-1" />}
        </button>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden`}
          style={{ maxHeight: showBrands ? '500px' : '0px' }}
        >
          <div className="flex flex-col gap-2 pl-1 pt-1">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="accent-blue-500"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Slider de Preço */}
      <div className="mb-2">
        <span className="font-medium text-lg">Preço</span>
        <Slider
          value={localPrice}
          min={minPrice}
          max={maxPrice}
          step={10}
          minStepsBetweenThumbs={1}
          className="mt-4 accent-blue-500"
          onValueChange={(v) => setLocalPrice(v)} // visual
          onValueCommit={(v) => onPriceChange(v)} // aplica filtro ao soltar
        />
        <div className="flex justify-between text-sm mt-2 text-muted-foreground">
          <span>{localPrice[0]} €</span>
          <span>{localPrice[1]} €</span>
        </div>
      </div>
    </div>
  );
}


export default FilterSidebar;
