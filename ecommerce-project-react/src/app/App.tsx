import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Home from '@/pages/Home';
import CategoryPage from '@/pages/CategoryPage';
import Detail from '@/pages/Detail';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import Search from '@/pages/Search';
import Profile from '@/pages/Profile';
import Cart from '@/pages/Cart';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import type { MainLayoutContext } from '@/types';

// Layout Principal (Com Header e Container com Scroll)
function MainLayout() {
  const mainRef = useRef<HTMLElement | null>(null);

  const contextValue: MainLayoutContext = { mainRef };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main ref={mainRef} className="flex-1 overflow-auto">
        {/* Passamos o mainRef para as páginas filhas através do contexto do Outlet */}
        <Outlet context={contextValue} />
      </main>
    </div>
  );
}

// Layout de Autenticação (Sem Header, limpo e centrado)
function AuthLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Outlet />
    </div>
  );
}

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (!savedTheme || savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Páginas da Loja (Com Header) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/carrinho" element={<Cart />} />
              <Route path="/Search" element={<Search />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/:categoria" element={<CategoryPage />} />
              <Route path="/:categoria/:id" element={<Detail />} />
            </Route>

            {/* Páginas de Autenticação (Sem Header) */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/SignUp" element={<SignUp />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
