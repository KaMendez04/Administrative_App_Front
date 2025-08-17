export interface LoginPayload {
  email: string;
  password: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  email: string;
  username?: string;
  role?: Role;
}

export interface LoginResponse {
  user: User;
  token: string;
}
