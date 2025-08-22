import { apiRequest } from '@/lib/api-config';

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id?: number;
  username: string;
  password?: string;
  role_id: number;
  role_name?: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
}

export interface RolesResponse {
  data: Role[];
}

export const getUsersData = async (
  page: number, 
  pageSize: number, 
  sort: { by: string; order: string }
): Promise<UsersResponse> => {
  return apiRequest(
    `/api/users?page=${page}&pageSize=${pageSize}&sortBy=${sort.by}&order=${sort.order}`
  );
};

export const getRolesData = async (): Promise<RolesResponse> => {
  return apiRequest('/api/roles');
};

export const saveUser = async (
  userData: User, 
  editingUser?: User
): Promise<void> => {
  const method = editingUser ? "PUT" : "POST";
  const endpoint = editingUser
    ? `/api/users/${editingUser.id}`
    : `/api/users`;

  return apiRequest(endpoint, {
    method,
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (userId: number): Promise<void> => {
  return apiRequest(`/api/users/${userId}`, {
    method: "DELETE",
  });
};
