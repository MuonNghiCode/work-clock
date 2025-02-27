import { get, post, put } from './apiService';

export const login = async (email: string, password: string) => {
  const response = await post('/auth', { email, password });
  if (response.success) {
    localStorage.setItem('token', response.data.token);
  }
  return response;
};

export const getUserInfobyToken = async () => {
  const response = await get('/auth');
  console.log('user', response.data);
  if (response.success) {
    localStorage.setItem('user', JSON.stringify(response.data));
    localStorage.setItem('role', response.data.role_code);
  }
  return response;
};

export const getAllRoles = async (keyword?: string) => {
  const response = await get('/roles/get-all', { keyword });
  localStorage.setItem('role', JSON.stringify(response.data[0]));
  return response;
};

export const logoutApi = async () => {
  await post('/auth/logout', {});
};

export const forgotPassword = async (email: string) => {
  return await put('/auth/forgot-password', { email });
};
