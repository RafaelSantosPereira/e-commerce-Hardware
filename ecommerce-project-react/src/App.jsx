import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useRef } from 'react';
import Header from './assets/components/Header';
import Home from './assets/components/pages/Home/Home';
import CategoryPage from './assets/components/pages/CategoryPage';
import Detail from './assets/components/pages/Detail';
import Login from './assets/components/pages/Login';
import SignIn from './assets/components/pages/SignIn';
import Search from './assets/components/pages/Search';
import Profile from './assets/components/pages/Profile';
import Cart from './assets/components/pages/Cart';
import { AuthProvider } from './assets/components/contexts/AuthContext';
import { CartProvider } from './assets/components/contexts/CartContext';

function App() {
  const mainRef = useRef(null);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col h-screen">
            <Header />
            <main ref={mainRef} className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Home mainRef={mainRef} />} />
                <Route path="/carrinho" element={<Cart />} />
                <Route path="/:categoria" element={<CategoryPage mainRef={mainRef} />} />
                <Route path="/:categoria/:id" element={<Detail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/SignIn" element={<SignIn />} />
                <Route path="/Search" element={<Search mainRef={mainRef} />} />
                <Route path="/profile" element={<Profile mainRef={mainRef} />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
