import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 5) {
      setError('A senha deve ter pelo menos 5 caracteres');
      return;
    }
    setError('');

    try{
      const response = await fetch('http://localhost:3000/login', {
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
      if(!response.ok){
        alert(result.message);
      }
      else{
        localStorage.setItem("authToken", result.token);
        alert('login bem sucedido')
        navigate('/');
      }
    }
    catch{
      alert('erro ao eceder dados')
    }
   
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 bg-gray-50 dark:bg-[#121212]">
      <div className="max-w-md w-full bg-white dark:bg-[#1f1f1f] p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">Fazer Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#121212] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <Link to="/SignIn" className="text-blue-500 hover:underline">
            Criar uma aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
