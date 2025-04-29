import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

// Accept Order
export const acceptOrder = async (orderAcceptedDto: {
  orderId: string;
  restaurantId: string;
  location: { lat: string; lng: string };
}) => {
  try {
    const response = await axios.post(`${API_URL}/restaurant/accept-order`, orderAcceptedDto);
    return response.data;
  } catch (error) {
    console.error('Error accepting order:', error);
    throw error;
  }
};

// Create Restaurant
export const createRestaurant = async (createRestaurantDto: any) => {
  try {
    const response = await axios.post(`${API_URL}/restaurant`, createRestaurantDto);
    return response.data;
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
};

// Get All Restaurants
export const getAllRestaurants = async () => {
  try {
    const response = await axios.get(`${API_URL}/restaurant`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all restaurants:', error);
    throw error;
  }
};

// Get Restaurant by ID
export const getRestaurantById = async (restaurantId: string) => {
  try {
    const response = await axios.get(`${API_URL}/restaurant/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurant by ID:', error);
    throw error;
  }
};

// Update Restaurant
export const updateRestaurant = async (restaurantId: string, updateRestaurantDto: any) => {
  try {
    const response = await axios.patch(`${API_URL}/restaurant`, updateRestaurantDto);
    return response.data;
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }
};

// Delete Restaurant
export const deleteRestaurant = async (restaurantId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/restaurant/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw error;
  }
};

// Find Restaurant by Name
export const findRestaurantByName = async (name: string) => {
  try {
    const response = await axios.get(`${API_URL}/restaurant/name/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error finding restaurant by name:', error);
    throw error;
  }
};

// Find Restaurants by Cuisine
export const findRestaurantsByCuisine = async (cuisine: string) => {
  try {
    const response = await axios.get(`${API_URL}/restaurant/cuisine/${cuisine}`);
    return response.data;
  } catch (error) {
    console.error('Error finding restaurants by cuisine:', error);
    throw error;
  }
};

// Find Restaurants by User ID
export const findRestaurantsByUserId = async (userId: string) => {
  const response = await axios.get<{ restaurants: any[] }>(`http://localhost:3000/api/v1/restaurant/user/${userId}`);
  return response.data.restaurants; // <- access 'restaurants' array
};

// Update Restaurant Verification Status
export const updateVerificationStatus = async (restaurantId: string, isVerified: boolean) => {
  try {
    const response = await axios.patch(`${API_URL}/restaurant/${restaurantId}/verification`, { isVerified });
    return response.data;
  } catch (error) {
    console.error('Error updating verification status:', error);
    throw error;
  }
};

// Update Restaurant Open Status
export const updateOpenStatus = async (restaurantId: string, isOpen: boolean) => {
  try {
    const response = await axios.patch(`${API_URL}/restaurant/${restaurantId}/open-status`, { isOpen });
    return response.data;
  } catch (error) {
    console.error('Error updating open status:', error);
    throw error;
  }
};

// Update Restaurant Rating
export const updateRestaurantRating = async (restaurantId: string, ratingIncrease: any) => {
  try {
    const response = await axios.patch(`${API_URL}/restaurant/${restaurantId}/rating`, ratingIncrease);
    return response.data;
  } catch (error) {
    console.error('Error updating restaurant rating:', error);
    throw error;
  }
};
