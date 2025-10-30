import { useState, useEffect, use } from 'react';
import { ShoppingCart, User, Sun, Moon, Menu, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MiniCardItem from './MiniCardItem';
import { idParaCategoria } from '../export_files/idParaCategoria';
import { useCart } from './contexts/CartContext';
import { useAuth } from './contexts/AuthContext';


function Header() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  const { cartItems, cartLoading, totalItems, totalPrice, clearCart } = useCart();
  const { isLogged, userName, logout } = useAuth();
  const navigate = useNavigate();


 const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]); // corre sempre que darkMode muda

  const toggleMode = () => {
    setDarkMode(prev => !prev); 
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const handleCartToggle = () => setCartOpen(!cartOpen);

 


  

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    clearCart();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/Search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };





  const totalCartItems = totalItems;
  const totalCartPrice = totalPrice;


  return (
    <>
      <header className="flex items-center px-6 py-4 bg-white dark:bg-[#121212] border-b-2 border-slate-200 dark:border-gray-800 h-24 relative">
        <button onClick={toggleSidebar} className="text-accent dark:text-accent">
          <Menu className="w-7 h-7 text-blue-500" />
        </button>

        <Link to="/" className="text-3xl font-bold ml-8 text-blue-500 whitespace-nowrap">
          CompuStore
        </Link>

        {/* Pesquisa */}
        <form
        onSubmit={handleSearchSubmit}
        className="flex items-center flex-1 justify-center mx-auto max-w-xl px-4"
      >
        <div className="relative flex-grow">
          {/* Ícone dentro do input */}
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="w-5 h-5" />
          </span>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar componentes..."
            className="w-full pl-10 pr-4 py-2 focus:outline-none text-foreground bg-gray-100 rounded-[10px] h-12
              dark:bg-[#1f1f1f] dark:text-[#d1d5db] placeholder:text-slate-500"
          />
        </div>

      </form>

        {/* Ícones */}
        <div className="flex items-center gap-4 text-foreground dark:text-gray-200 ml-auto relative">
          {/* Botão do carrinho com contador */}
          <button onClick={handleCartToggle} className="relative">
            <ShoppingCart className="w-7 h-7" />
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {totalCartItems > 99 ? '99+' : totalCartItems}
              </span>
            )}
          </button>

          {/* Botão de User */}
          <div className="relative flex items-center">
            <button onClick={toggleUserMenu}>
              <User className="w-7 h-7" />
            </button>

            {/* Popup de login/conta */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                {!isLogged ? (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Fazer Login
                    </Link>
                    <Link
                      to="/SignIn"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Criar Conta
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Perfil ({userName})
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
              

          <button onClick={toggleMode}>
            {darkMode ? <Sun className="w-7 h-7" /> : <Moon className="w-7 h-7" />}
          </button>
        </div>
      </header>

      {/* Sidebar Categorias */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-[#1f1f1f] shadow-md transition-transform duration-300 z-40 border-0 rounded-tr-lg ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 bg-blue-500 dark:border-gray-800 flex justify-between items-center border-0 rounded-tr-lg">
          <h2 className="text-xl font-semibold text-foreground text-slate-100">Categorias</h2>
          <button onClick={toggleSidebar} className="text-white">✕</button>
        </div>
        <nav className="p-4 space-y-4 text-foreground dark:text-[#cbd5e1]">
          <Link to="/processadores" onClick={toggleSidebar} className="block hover:text-blue-500 transition-colors">Processadores</Link>
          <Link to="/placas-graficas" onClick={toggleSidebar} className="block hover:text-blue-500 transition-colors">Placas Gráficas</Link>
          <Link to="/motherboards" onClick={toggleSidebar} className="block hover:text-blue-500 transition-colors">Motherboards</Link>
          <Link to="/memorias-ram" onClick={toggleSidebar} className="block hover:text-blue-500 transition-colors">Memórias RAM</Link>
          <Link to="/armazenamento" onClick={toggleSidebar} className="block hover:text-blue-500 transition-colors">Armazenamento</Link>
          <Link to="/fontes-de-alimentacao" onClick={toggleSidebar} className="block hover:text-blue-500 transition-colors">Fontes de Alimentação</Link>
          <Link to="/caixas" onClick={toggleSidebar} className="block hover:text-blue-500 transition-colors">Caixas</Link>
          <Link to="/coolers" onClick={toggleSidebar} className="block hover:text-blue-500 transition-colors">Coolers</Link>
        </nav>
      </aside>

      {/* Fundo escuro das sidebars */}
      {(sidebarOpen || cartOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => {
            if (sidebarOpen) {
              toggleSidebar();
            }
            if (cartOpen) {
              handleCartToggle();
            }
          }}
        />
      )}

      {/* Sidebar Carrinho */}
      <aside
        className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-[#1f1f1f] shadow-md transition-transform duration-300 z-40 border-0 rounded-tl-lg flex flex-col ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header fixo */}
        <div className="p-6 flex justify-between items-center bg-blue-500 rounded-tl-lg shrink-0">
          <h2 className="text-2xl font-bold text-foreground text-gray-100">Carrinho</h2>
          <button onClick={handleCartToggle} className="text-white">✕</button>
        </div>

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto">
          {cartLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-gray-500 dark:text-gray-400">A carregar carrinho...</div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">O carrinho está vazio</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Adicione produtos para começar as suas compras</p>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <MiniCardItem
                  key={item.product_id || item.id}
                  id={item.product_id || item.id}
                  name={item.name}
                  price={item.price}
                  image_url={item.image_url}
                  categoria={idParaCategoria[item.category_id]}
                  quantity={item.quantity}
                />
              ))}
            </>
          )}
        </div>

        {/* Footer fixo */}
        {cartItems.length > 0 && (
          <div className="border-t dark:border-gray-700 p-4 bg-gray-50 dark:bg-[#161616] shrink-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold dark:text-gray-200">Total:</span>
              <span className="text-xl font-bold text-blue-500">€{totalCartPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => {
                if (!isLogged) {
                  alert("Por favor, faça login para finalizar a compra.");
                  return;
                }
                handleCartToggle(); 
                navigate("/carrinho"); 
              }}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-center block"
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Header;