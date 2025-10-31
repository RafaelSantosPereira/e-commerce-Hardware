import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [isLogged, setIsLogged] = useState(!!token);
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // verifica se o token expirou
        const currentTime = Date.now() / 1000; // segundos
        if (decoded.exp < currentTime) {
          logout(); // token expirado
        } else {
          setIsLogged(true);
        }
      } catch (err) {
        logout(); // token inválido
      }
    } else {
      setIsLogged(false);
    }
  }, [token]); // <-- reexecuta quando o token muda

  const login = (newToken, name, role) => {
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("userName", name);
    localStorage.setItem("userRole", role);
    setToken(newToken);
    setUserName(name);
    setUserRole(role);
    setIsLogged(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setToken(null);
    setIsLogged(false);
    setUserName(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLogged, userName, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
