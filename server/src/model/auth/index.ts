export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthUser {
  id: number;
  role: string;
  name?: string;
}

export interface LoginResult {
  token: string;
  name: string;
  role: string;
}