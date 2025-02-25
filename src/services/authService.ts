import axiosInstance from '../config/axiosConfig';

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post('/auth', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getUserInfobyToken = async () => {
  try {
    const response = await axiosInstance.get('/auth');
    console.log('user', response.data.data);
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
      localStorage.setItem('role', response.data.data.role_code)
    }
    return response.data;
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
}

export const getAllRoles = async (keyword?: string) => {
  try {
    const response = await axiosInstance.get('/roles/get-all', {
      params: { keyword },
    });
    localStorage.setItem('role', JSON.stringify(response.data.data[0]))
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const logoutApi = async () => {
  try {
    await axiosInstance.post(`/auth/logout`);
  } catch (error) {
    console.error('Error Logout', error);
    throw error;
  }
}

