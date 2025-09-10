import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const name = localStorage.getItem("userName");
    if (token) {
      setIsLogged(true);
      setUserName(name);
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
