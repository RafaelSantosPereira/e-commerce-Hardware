import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
const apiUrl = import.meta.env.VITE_API_URL


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();


  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("verified") === "success") {
      alert("Conta verificada com sucesso!");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 5) {
      setError('A password deve ter pelo menos 5 caracteres');
      return;
    }
    setError('');

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),  
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.message);
        return;
      }

      
      login(result.token, result.name, result.role);

      //Fazer merge do carrinho local
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (localCart.length > 0) {
        try {
          // Converter estrutura do carrinho local para o formato esperado pelo backend
          const itemsToMerge = localCart.map(item => ({
            productId: item.id,  // Mudança aqui: id -> productId
            quantity: item.quantity
          }));

          const mergeResponse = await fetch("http://localhost:3000/cart/merge", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${result.token}`
            },
            body: JSON.stringify({ items: itemsToMerge })
          });

          if (mergeResponse.ok) {
            // Limpar carrinho local apenas se o merge foi bem-sucedido
            localStorage.removeItem("cart");
            console.log("Carrinho local merged com sucesso!");
          } else {
            console.error("Erro no merge do carrinho");
          }
        } catch (mergeError) {
          console.error("Erro ao fazer merge do carrinho:", mergeError);
        }
      }

      // Atualizar o carrinho após o merge
      await fetchCart();


      alert('Login bem sucedido');
      navigate('/');

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao aceder dados');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 bg-gray-50 dark:bg-[#121212]">
      <div className="max-w-md w-full bg-white dark:bg-[#1f1f1f] p-8 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.25)]">
        <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">Fazer Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <input
              type="email"
              required
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#121212] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
            />
          </label>

          <label className="block">
            <input
              type="password"
              required
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className="mt-1 mb-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#121212] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Não tem conta?{' '}
          <Link to="/SignUp" className="text-blue-500 hover:underline">
            Criar uma aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
