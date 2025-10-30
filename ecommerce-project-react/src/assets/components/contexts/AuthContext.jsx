import { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);

 useEffect(() => {
    const token = localStorage.getItem("authToken");
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // verifica se o token expirou
        const currentTime = Date.now() / 1000; // em segundos
        if (decoded.exp < currentTime) {
          // token expirado
          localStorage.removeItem("authToken");
          localStorage.removeItem("userName");
          localStorage.removeItem("userRole");
          setIsLogged(false);
          setUserName(null);
          setUserRole(null);
        } else {
          setIsLogged(true);
          setUserName(name);
          setUserRole(role);
        }
      } catch (err) {
        // token inválido
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
      }
    }
  }, []);

  const login = (token, name) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userName", name);
    localStorage.setItem("userRole", name);
    setIsLogged(true);
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setIsLogged(false);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ isLogged, userName, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
