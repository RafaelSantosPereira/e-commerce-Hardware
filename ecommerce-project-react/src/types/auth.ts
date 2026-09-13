export interface UserSession {
  userId: number;
  name: string;
  role: string;
}

export interface AuthContextType {
  isLogged: boolean;
  userName: string | null;
  userRole: string | null;
  isLoading: boolean;
  login: (name: string, role: string) => void;
  logout: () => Promise<void>;
}
