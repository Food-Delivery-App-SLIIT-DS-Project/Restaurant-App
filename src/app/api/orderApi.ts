// orderApi.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { acceptOrder, findRestaurantsByUserId } from "./apiRestaurant";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const BASE_URL = `${API_URL}/order`;

export const getOrdersByRestaurantId = async (restaurantId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/restaurant/${restaurantId}`);
    if (response.data?.code === 0) {
      return response.data.data.orders;  // return orders array directly
    } else {
      throw new Error(response.data.msg || 'Error fetching orders');
    }
  } catch (err) {
    console.error('Error in getOrdersByRestaurantId:', err);
    throw err;
  }
};


export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/update/status`, {
      orderId,
      status,
    });

    if (response.data?.code === 0) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Error updating order status");
    }
  } catch (err) {
    console.error("Error in updateOrderStatus:", err);
    throw err;
  }
};

// New helper functions for specific statuses

// Auto-fetch restaurantId and location from user's restaurant
export const setOrderPreparing = async (orderId: string) => {
  try {
    const userId = Cookies.get("userId"); // Or use cookies/session
    if (!userId) throw new Error("User ID not found");

    const restaurants = await findRestaurantsByUserId(userId);
    console.log("Restaurants fetched:", restaurants);

    if (!restaurants || restaurants.length === 0) {
      throw new Error("No restaurants found for this user");
    }
    const restaurantIds = JSON.parse(Cookies.get("restaurantIds") || "[]");
    const restaurantId = restaurantIds?.[0] || "";
    console.log("Restaurant IDs from cookies:", restaurantIds);
    console.log("Restaurant ID used:", restaurantId);
    const restaurant = restaurants[0]; // Assumes only one restaurant per user

    const location = {
      lat: restaurant.location.latitude,
      lng: restaurant.location.longitude
    };

    console.log("Location fetched:", location);
    await acceptOrder({ orderId, restaurantId , location });
    return await updateOrderStatus(orderId, "PREPARING");
  } catch (error) {
    console.error("Error in setOrderPreparing:", error);
    throw error;
  }
};

export const setOrderWaitingForPickup = async (orderId: string) => {
  return await updateOrderStatus(orderId, "WAITING_FOR_PICKUP");
};