import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1/menu'; // Adjust this URL based on your API endpoint

// Function to create a new menu
export const createMenu = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/create`, data);
    return response.data; // Assuming the response contains the created menu
  } catch (error) {
    console.error('Error creating menu:', error);
    throw error;
  }
};

// Function to get all menus
export const getAllMenus = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data; // Assuming the response contains a list of menus
  } catch (error) {
    console.error('Error fetching all menus:', error);
    throw error;
  }
};

// Function to get all valid menus
export const getAllValidMenus = async () => {
  try {
    const response = await axios.get(`${API_URL}/valid`);
    return response.data; // Assuming the response contains a list of valid menus
  } catch (error) {
    console.error('Error fetching valid menus:', error);
    throw error;
  }
};

// Function to get menu by ID
export const getMenuById = async (menuId) => {
  try {
    const response = await axios.get(`${API_URL}/id/${menuId}`);
    return response.data; // Assuming the response contains the menu data
  } catch (error) {
    console.error('Error fetching menu by ID:', error);
    throw error;
  }
};

// Function to get menus by restaurant ID
export const getMenusByRestaurantId = async (restaurantId) => {
  try {
    const response = await axios.get(`${API_URL}/restaurant/${restaurantId}`);
    return response.data; // Assuming the response contains a list of menus for the given restaurant
  } catch (error) {
    console.error('Error fetching menus by restaurant ID:', error);
    throw error;
  }
};

// Function to get menus by name
export const getMenusByName = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/name/${name}`);
    return response.data; // Assuming the response contains a list of menus matching the name
  } catch (error) {
    console.error('Error fetching menus by name:', error);
    throw error;
  }
};

// Function to update menu
export const updateMenu = async (menuId, data) => {
  try {
    const response = await axios.put(`${API_URL}/update/${menuId}`, data);
    return response.data; // Assuming the response contains the updated menu
  } catch (error) {
    console.error('Error updating menu:', error);
    throw error;
  }
};

// Function to update menu status (e.g., availability)
export const updateMenuStatus = async (menuId, available) => {
  try {
    const response = await axios.put(`${API_URL}/status/${menuId}`, { available });
    return response.data; // Assuming the response contains the updated menu
  } catch (error) {
    console.error('Error updating menu status:', error);
    throw error;
  }
};

// Function to delete menu
export const deleteMenu = async (menuId) => {
  try {
    await axios.delete(`${API_URL}/delete/${menuId}`);
    return { success: true }; // Assuming success when menu is deleted
  } catch (error) {
    console.error('Error deleting menu:', error);
    throw error;
  }
};
