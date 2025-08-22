import { apiRequest } from '@/lib/api-config';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  return apiRequest('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }, false); // false perché per il login non serve il token
};
