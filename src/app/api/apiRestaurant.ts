import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Accept Order
export const acceptOrder = async (orderAcceptedDto: {
  orderId: string;
  restaurantId: string;
  location: { lat: string; lng: string };
}) => {
  try {
    const response = await axios.post(`${API_URL}/restaurant/accept-order`, orderAcceptedDto);
    console.log('Order accepted:', response.data);
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
    const response = await axios.patch(`${API_URL}/restaurant/${restaurantId}`, updateRestaurantDto);
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
    const response = await axios.get(`${API_URL}/restaurant/by-name/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error finding restaurant by name:', error);
    throw error;
  }
};

// Find Restaurants by Cuisine
export const findRestaurantsByCuisine = async (cuisine: string) => {
  try {
    const response = await axios.get(`${API_URL}/restaurant/by-cuisine/${cuisine}`);
    return response.data;
  } catch (error) {
    console.error('Error finding restaurants by cuisine:', error);
    throw error;
  }
};

// Find Restaurants by User ID
export const findRestaurantsByUserId = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/restaurant/by-user/${userId}`);
    const data = response.data as { data: any };
    return data.data; // returns only the data array
  } catch (error) {
    console.error('Error fetching restaurants by user ID:', error);
    throw error;
  }
};

// Update Restaurant Verification Status
export const updateVerificationStatus = async (restaurantId: string, isVerified: boolean) => {
  try {
    const response = await axios.patch(`${API_URL}/restaurant/verify/${restaurantId}`, { isVerified });
    return response.data;
  } catch (error) {
    console.error('Error updating verification status:', error);
    throw error;
  }
};

// Update Restaurant Open Status
export const updateOpenStatus = async (restaurantId: string, isOpen: boolean) => {
  try {
    const response = await axios.patch(`${API_URL}/restaurant/open/${restaurantId}`, { isOpen });
    return response.data;
  } catch (error) {
    console.error('Error updating open status:', error);
    throw error;
  }
};

// Increase Restaurant Rating
export const increaseRestaurantRating = async (restaurantId: string) => {
  try {
    const response = await axios.patch(`${API_URL}/restaurant/increase-rating/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error('Error increasing restaurant rating:', error);
    throw error;
  }
};

// Decrease Restaurant Rating
export const decreaseRestaurantRating = async (restaurantId: string) => {
  try {
    const response = await axios.patch(`${API_URL}/restaurant/decrease-rating/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error('Error decreasing restaurant rating:', error);
    throw error;
  }
};

// Get Restaurants by Location (Body Payload Required)
export const getRestaurantsByLocation = async (locationDto: {
  latitude: number;
  longitude: number;
  radius: number;
}) => {
  try {
    const response = await axios.get(`${API_URL}/restaurant/by-location`, { data: locationDto });
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurants by location:', error);
    throw error;
  }
};

// Get All Restaurants With Filters
export const getAllRestaurantsWithFilters = async () => {
  try {
    const response = await axios.get(`${API_URL}/restaurant/with-filters`);
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurants with filters:', error);
    throw error;
  }
};
