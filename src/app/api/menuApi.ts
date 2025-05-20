import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_URL =  `${BASE_URL}/menu`;

export const createMenu = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data.data;
};

export const getAllMenus = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

export const getAllValidMenus = async () => {
  const response = await axios.get(`${API_URL}/valid/all`);
  return response.data.data;
};

export const getMenuById = async (menuId) => {
  const response = await axios.get(`${API_URL}/${menuId}`);
  return response.data.data;
};

export const getMenusByRestaurantId = async (restaurantId) => {
  const response = await axios.get(`${API_URL}/restaurant/${restaurantId}`);
  return response.data.data;
};

export const getMenusByName = async (name) => {
  const response = await axios.get(`${API_URL}/name/${name}`);
  return response.data.data;
};

export const updateMenu = async (menuId, data) => {
  const response = await axios.patch(`${API_URL}`, { ...data, menuId });
  return response.data.data;
};

export const updateMenuStatus = async (menuId, available) => {
  const response = await axios.patch(`${API_URL}/status`, { menuId, available });
  return response.data.data;
};

export const deleteMenu = async (menuId) => {
  await axios.delete(`${API_URL}/${menuId}`);
  return { success: true };
};
