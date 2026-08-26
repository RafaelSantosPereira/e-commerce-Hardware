import { createContext, useContext, useState, useEffect } from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const response = await fetch(`${apiUrl}/session`, {
          credentials: "include",
        });

        if (response.ok) {
          const session = await response.json();
          setIsLogged(true);
          setUserName(session.name);
          setUserRole(session.role);
        } else {
          setIsLogged(false);
        }
      } catch (error) {
        console.error("Erro ao restaurar sessão:", error);
        setIsLogged(false);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = (name, role) => {
    setUserName(name);
    setUserRole(role);
    setIsLogged(true);
  };

  const logout = async () => {
    await fetch(`${apiUrl}/logout`, {
      method: "POST",
      credentials: "include",
    });

    setIsLogged(false);
    setUserName(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLogged, userName, userRole, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
