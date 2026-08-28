import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
                <Route path="/SignUp" element={<SignIn />} />
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
