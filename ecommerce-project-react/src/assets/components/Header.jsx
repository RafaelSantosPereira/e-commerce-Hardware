import { useState } from 'react';
import { ShoppingCart, User, Sun, Moon, Menu } from 'lucide-react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';


function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#121212] border-b-2 border-slate-200 dark:border-gray-800 h-24">
        <button onClick={toggleSidebar} className="text-accent dark:text-accent">
          <Menu className="w-7 h-7" />
        </button>

        <div className="text-2xl font-bold text-accent dark:text-accent">CompuStore</div>

        <form className="flex flex-1 max-w-md mx-6">
          <input
            type="text"
            placeholder="Pesquisar componentes..."
            className="flex-grow px-4 py-2 focus:outline-none text-foreground bg-gray-100 rounded-[10px] h-12
      dark:bg-[#1f1f1f] dark:text-[#d1d5db] placeholder:text-muted dark:placeholder:text-gray-500"
          />
          <button
            type="submit"
            className="p-2 text-accent hover:text-white hover:bg-accent transition rounded-full"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        <div className="flex items-center gap-4 text-foreground dark:text-gray-200">
          <button><ShoppingCart className="w-7 h-7" /></button>
          <button><User className="w-7 h-7" /></button>
          <button onClick={toggleMode}>
            {darkMode ? <Sun className="w-7 h-7" /> : <Moon className="w-7 h-7" />}
          </button>
        </div>
      </header>

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#1f1f1f] shadow-md transition-transform duration-300 z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground dark:text-[#d1d5db]">Categorias</h2>
        <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-400">✕</button>
      </div>
        <nav className="p-4 space-y-4 text-foreground dark:text-[#cbd5e1]">
          <Link to="/processadores" onClick={toggleSidebar} className="block hover:text-blue-500 transition-colors duration-200">Processadores</Link>
          <Link to="/placas-graficas" onClick={toggleSidebar} className="block hover:text-blue-500 transition-colors duration-200">Placas Gráficas</Link>
          <Link to="/motherboards" onClick={toggleSidebar} className="block hover:text-blue-500 transition-colors duration-200">Motherboards</Link>
          <Link to="/memorias-ram" onClick={toggleSidebar} className="block hover:text-blue-500 transition-colors duration-200">Memórias RAM</Link>
          <Link to="/armazenamento" onClick={toggleSidebar} className="block hover:text-blue-500 transition-colors duration-200">Armazenamento</Link>
          <Link to="/fontes-de-alimentacao" onClick={toggleSidebar} className="block hover:text-blue-500 transition-colors duration-200">Fontes de Alimentação</Link>
          <Link to="/caixas" onClick={toggleSidebar} className="block hover:text-blue-500 transition-colors duration-200">Caixas</Link>
          <Link to="/coolers" onClick={toggleSidebar} className="block hover:text-blue-500 transition-colors duration-200">Coolers</Link>
        </nav>

    </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

export default Header;
