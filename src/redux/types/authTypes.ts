export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
  }
  
  export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: string | null;
    user: User | null;
  }
  
  export interface AuthPayload {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    user: User;
  }
  