import axios from 'axios'; 

// Read from environment
const baseURL = process.env.PUBLIC_BACKEND_URL;

const API = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Define AuthResponse interface
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

// ----------------- Auth APIs -----------------

export const signUp = async (data: {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}): Promise<AuthResponse> => {
  try {
    const response = await API.post<AuthResponse>('/auth/signup', data);
    return response.data;
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};


export const signIn = async (data: { email: string; password: string }) => {
  try {
    // Make the request to the backend
    const res = await axios.post(`http://localhost:3000/api/v1/auth/signin`, data);

    // Check if the response is successful (code 0 indicates success)
    if (res.data.code === 0) {
      // Return the user data and token on successful login
      return {
        success: true,
        role: res.data.data.role,
        user: res.data.data.user,
        token: res.data.data.token
      };
    } else {
      // If there's no success code or the response isn't in the expected format, handle it
      return {
        success: false,
        message: 'Unexpected response format'
      };
    }
  } catch (error) {
    // Handle error responses from the backend (e.g., 401, 400)
    if (error.response) {
      // Error response from backend
      if (error.response.status === 401) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }
      // Other HTTP errors can be handled here
      return {
        success: false,
        message: error.response.data?.message || 'An error occurred'
      };
    } else {
      // If the request itself fails (e.g., network issues)
      return {
        success: false,
        message: 'Network error or server unreachable'
      };
    }
  }
};


export const logout = async (refreshToken: string): Promise<void> => {
  try {
    await API.post('/auth/logout', { refreshToken });
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  try {
    const response = await API.post<AuthResponse>('/auth/refresh-token', { refreshToken });
    return response.data;
  } catch (error) {
    console.error('Error during token refresh:', error);
    throw error;
  }
};

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await API.post<boolean>('/auth/verify-token', { token });
    return response.data;
  } catch (error) {
    console.error('Error during token verification:', error);
    throw error;
  }
};
