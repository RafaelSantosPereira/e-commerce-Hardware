import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (password.length < 5) {
      setError('A password deve ter pelo menos 5 caracteres');
      return;
    }
    if (password !== confirmPass) {
      setError('As passwords não coincidem');
      return;
    }
    setError('');
    console.log('Criar conta:', { email, password });
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 bg-gray-50 dark:bg-[#121212]">
      <div className="max-w-md w-full bg-white dark:bg-[#1f1f1f] p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">Criar Conta</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#121212] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="exemplo@dominio.com"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Nome</span>
            <input
              type="text"
              required
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#121212] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="exemplo@dominio.com"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#121212] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=""
            />
          </label>

          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Confirmar Password</span>
            <input
              type="password"
              required
              value={confirmPass}
              onChange={e => {
                setConfirmPass(e.target.value);
                if (error) setError('');
              }}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#121212] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=""
            />
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
          >
            Criar Conta
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Já tem conta?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Entrar aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
