import { BrowserRouter as Router, Routes, Route, Outlet, useOutletContext } from 'react-router-dom';
import { useRef } from 'react';
import Header from '../components/layout/Header';
import Home from '../pages/Home';
import CategoryPage from '../pages/CategoryPage';
import Detail from '../pages/Detail';
import Login from '../pages/Login';
import SignIn from '../pages/SignUp';
import Search from '../pages/Search';
import Profile from '../pages/Profile';
import Cart from '../pages/Cart';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';

// Layout Principal (Com Header e Container com Scroll)
function MainLayout() {
  const mainRef = useRef(null);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main ref={mainRef} className="flex-1 overflow-auto">
        {/* Passamos o mainRef para as páginas filhas através do contexto do Outlet */}
        <Outlet context={{ mainRef }} />
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
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Páginas da Loja (Com Header) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/carrinho" element={<Cart />} />
              <Route path="/:categoria" element={<CategoryPage />} />
              <Route path="/:categoria/:id" element={<Detail />} />
              <Route path="/Search" element={<Search />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Páginas de Autenticação (Sem Header) */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignIn />} />
              <Route path="/SignUp" element={<SignIn />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;