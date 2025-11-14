import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL


export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit =  async (e) => {
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
    try {
    const response = await fetch(`${apiUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nome,
        email,
        password,
        role: "customer"
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Erro no registo");
    } else {
      alert("Verifique o seu email para confirmar a criaçao da conta.");
    }
  } catch (err) {
    console.error("Erro:", err);
    setError("Erro no servidor.");
  }
  };

  return (
  <div className="flex items-center justify-center h-full w-full bg-gray-50 dark:bg-[#121212] px-4">
    <div
      className="
        w-full max-w-md 
        bg-white dark:bg-[#1f1f1f] 
        p-6 sm:p-8 
        rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.25)]
        flex flex-col 
        justify-center 
        max-h-[90vh] overflow-y-auto
      "
    >
      {/* Aviso */}
      <h2
        className="
          text-xs sm:text-sm 
          text-yellow-800 dark:text-yellow-300 
          bg-yellow-100 dark:bg-yellow-900 
          px-3 py-2 rounded-lg mb-4 
          text-center leading-relaxed
        "
      >
        ⚠️ Após efetuar o registo, verifique a pasta de spam ou lixo eletrónico caso nao encontre o email de verificação.
      </h2>
      

      

      {/* Título */}
      <h2 className="text-2xl font-bold text-blue-500 mb-5 text-center">
        Criar Conta
      </h2>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#121212] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="Email"
        />

        <input
          type="text"
          required
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#121212] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="Nome"
        />

        <input
          type="password"
          required
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            if (error) setError('');
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#121212] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="Password"
        />

        <input
          type="password"
          required
          value={confirmPass}
          onChange={e => {
            setConfirmPass(e.target.value);
            if (error) setError('');
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#121212] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="Confirmar Password"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition text-sm"
        >
          Criar Conta
        </button>
      </form>

      <p className="mt-5 text-center text-gray-600 dark:text-gray-400 text-sm">
        Já tem conta?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">
          Entrar aqui
        </Link>
      </p>
    </div>
  </div>
);
}