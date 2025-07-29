function FilterSidebar({ category }) {
  // Filtros por categoria (exemplo simples)
  const filtersByCategory = {
    'Processadores': ['Marca', 'Núcleos', 'Frequência'],
    'Placas Gráficas': ['Marca', 'Memória VRAM', 'Interface'],
    'Motherboards': ['Socket', 'Chipset', 'Formato'],
    'Memórias RAM': ['Capacidade', 'Frequência', 'Tipo'],
    'Armazenamento': ['Tipo', 'Capacidade', 'Velocidade'],
    'Fontes de Alimentação': ['Potência', 'Certificação', 'Modularidade'],
    'Caixas': ['Formato', 'Material', 'Ventilação'],
    'Coolers': ['Tipo', 'Compatibilidade', 'Nível de Ruído'],
  };

  const filters = filtersByCategory[category] || [];

  return (
    <aside className="fixed top-24 left-0 h-[calc(100vh-6rem)] w-64 bg-white dark:bg-[#1f1f1f] border-r border-gray-200 dark:border-gray-800 p-6 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-foreground dark:text-[#d1d5db]">
        Filtros - {category || 'Selecione uma categoria'}
      </h2>

      {filters.length === 0 && <p className="text-foreground dark:text-[#cbd5e1]">Nenhum filtro disponível</p>}

      {filters.map(filter => (
        <div key={filter} className="mb-4">
          <label className="block font-semibold mb-2 text-foreground dark:text-[#cbd5e1]">{filter}</label>
          <input
            type="text"
            placeholder={`Filtrar por ${filter.toLowerCase()}`}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#2a2a2a] text-foreground dark:text-[#d1d5db]"
          />
        </div>
      ))}
    </aside>
  );
}

export default FilterSidebar
