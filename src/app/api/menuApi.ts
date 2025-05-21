import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_URL = `${BASE_URL}/menu`;

// Define your MenuData type
export interface MenuData {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  available?: boolean;
  restaurantId: string;
}

// Define the standard API response shape
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// Create Menu
export const createMenu = async (data: MenuData): Promise<MenuData> => {
  const response = await axios.post<ApiResponse<MenuData>>(API_URL, data);
  return response.data.data;
};

// Get All Menus
export const getAllMenus = async (): Promise<MenuData[]> => {
  const response = await axios.get<ApiResponse<MenuData[]>>(API_URL);
  return response.data.data;
};

// Get All Valid Menus
export const getAllValidMenus = async (): Promise<MenuData[]> => {
  const response = await axios.get<ApiResponse<MenuData[]>>(`${API_URL}/valid/all`);
  return response.data.data;
};

// Get Menu by ID
export const getMenuById = async (menuId: string): Promise<MenuData> => {
  const response = await axios.get<ApiResponse<MenuData>>(`${API_URL}/${menuId}`);
  return response.data.data;
};

// Get Menus by Restaurant ID
export const getMenusByRestaurantId = async (restaurantId: string): Promise<MenuData[]> => {
  const response = await axios.get<ApiResponse<MenuData[]>>(`${API_URL}/restaurant/${restaurantId}`);
  return response.data.data;
};

// Get Menus by Name
export const getMenusByName = async (name: string): Promise<MenuData[]> => {
  const response = await axios.get<ApiResponse<MenuData[]>>(`${API_URL}/name/${name}`);
  return response.data.data;
};

// Update Menu
export const updateMenu = async (menuId: string, data: Partial<MenuData>): Promise<MenuData> => {
  const response = await axios.patch<ApiResponse<MenuData>>(`${API_URL}`, { ...data, menuId });
  return response.data.data;
};

// Update Menu Status
export const updateMenuStatus = async (menuId: string, available: boolean): Promise<MenuData> => {
  const response = await axios.patch<ApiResponse<MenuData>>(`${API_URL}/status`, { menuId, available });
  return response.data.data;
};

// Delete Menu
export const deleteMenu = async (menuId: string): Promise<{ success: boolean }> => {
  await axios.delete(`${API_URL}/${menuId}`);
  return { success: true };
};
