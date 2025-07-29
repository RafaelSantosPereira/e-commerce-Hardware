import { useState } from 'react';
import { Search } from 'lucide-react'; // opcional: ícone elegante

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full max-w-md mx-auto p-2 bg-white border border-border rounded-[20px] shadow-sm"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Pesquisar componentes..."
        className="flex-grow px-4 py-2 focus:outline-none text-foreground"
      />
      <button
        type="submit"
        className="p-2 text-accent hover:text-white hover:bg-accent transition rounded-full"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}

export default SearchBar;
