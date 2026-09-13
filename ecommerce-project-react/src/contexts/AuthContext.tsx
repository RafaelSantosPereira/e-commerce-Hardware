import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { AuthContextType } from "@/types";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const login = (name: string, role: string) => {
    setUserName(name);
    setUserRole(role);
    setIsLogged(true);
  };

  const logout = async () => {
    try {
      await fetch(`${apiUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
