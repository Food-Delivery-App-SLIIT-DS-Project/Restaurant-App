import axios from 'axios';

// Read from environment
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const API = axios.create({
  baseURL,
  withCredentials: true,
});

// Common interface from backend structure
interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

interface AuthToken {
  access: string;
  refresh: string;
  expire_seconds: number;
  uid: string;
}

interface AuthResponse {
  role: string;
  user: any;
  token: AuthToken;
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
    const response = await API.post<ApiResponse<AuthResponse>>('/auth/signup', data);
    return response.data.data;
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

export const signIn = async (data: {
  email: string;
  password: string;
  fcmToken?: string;
}): Promise<
  | { success: true; role: string; user: any; token: AuthToken }
  | { success: false; message: string }
> => {
  try {
    const res = await API.post<ApiResponse<AuthResponse>>('/auth/signin', data);

    if (res.data.code === 0) {
      return {
        success: true,
        role: res.data.data.role,
        user: res.data.data.user,
        token: res.data.data.token,
      };
    } else {
      return {
        success: false,
        message: res.data.msg || 'Unexpected response format',
      };
    }
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401) {
        return { success: false, message: 'Invalid email or password' };
      }
      return {
        success: false,
        message: error.response.data?.message || 'An error occurred',
      };
    } else {
      return {
        success: false,
        message: 'Network error or server unreachable',
      };
    }
  }
};

export const logout = async (
  refreshToken: string,
  accessToken: string
): Promise<void> => {
  try {
    await API.post(
      '/auth/logout',
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

// These functions assume matching backend routes exist
export const refreshToken = async (refreshToken: string): Promise<AuthToken> => {
  try {
    const response = await API.post<ApiResponse<AuthToken>>('/auth/refresh-token', {
      refreshToken,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error during token refresh:', error);
    throw error;
  }
};

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await API.post<ApiResponse<boolean>>('/auth/verify-token', { token });
    return response.data.data;
  } catch (error) {
    console.error('Error during token verification:', error);
    throw error;
  }
};
