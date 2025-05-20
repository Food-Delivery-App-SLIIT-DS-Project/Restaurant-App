"use client";

import React, { useState, useEffect } from "react";
import {
  findRestaurantsByUserId,
  updateRestaurant,
  deleteRestaurant,
} from "../api/apiRestaurant";
import Cookies from "js-cookie";
import router from "next/router";

const RestaurantPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRestaurant, setEditingRestaurant] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  const userId = Cookies.get("userId")
  console.log("userId from cookies:", userId);

  useEffect(() => {
    const fetchRestaurantsData = async () => {
      if (!userId) {
        setError("User ID not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const data = await findRestaurantsByUserId(userId);
        //console.log("API response:", data);
        const restaurantArray = Array.isArray(data) ? data : [];
        setRestaurants(restaurantArray);

        const ids = restaurantArray.map((r) => r.restaurantId);
        Cookies.set("restaurantIds", JSON.stringify(ids));
        console.log("Restaurant IDs stored in cookies:", ids);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error fetching restaurants.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantsData();
  }, [userId]);

  const toggleIsOpen = (restaurantId: string) => {
    setRestaurants((prevState) =>
      prevState.map((restaurant) =>
        restaurant.restaurantId === restaurantId
          ? { ...restaurant, isOpen: !restaurant.isOpen }
          : restaurant
      )
    );
  };

  const handleEditDetails = (restaurant: any) => {
    setEditingRestaurant(restaurant);
    setEditFormData({
      name: restaurant.name,
      address: restaurant.address,
      phone: restaurant.phone,
      cuisineType: restaurant.cuisineType,
      description: restaurant.description,
      openHours: restaurant.openHours,
      imageReference: restaurant.imageReference,
      location: {
        longitude: restaurant.location?.longitude || 0,
        latitude: restaurant.location?.latitude || 0,
      },
      isOpen: restaurant.isOpen,
    });
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRestaurant) return;

    try {
      const updatedData = {
        restaurantId: editingRestaurant.restaurantId,
        ...editFormData,
        location: {
          longitude: parseFloat(editFormData.location.longitude),
          latitude: parseFloat(editFormData.location.latitude),
        },
      };

      await updateRestaurant(editingRestaurant.restaurantId, updatedData);
      alert("Restaurant updated successfully!");

      setRestaurants((prevState) =>
        prevState.map((rest) =>
          rest.restaurantId === editingRestaurant.restaurantId
            ? { ...rest, ...editFormData }
            : rest
        )
      );

      setEditingRestaurant(null);
    } catch (err) {
      console.error("Error updating restaurant:", err);
      alert("Failed to update restaurant.");
    }
  };

  const handleDeleteRestaurant = async (restaurantId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this restaurant?");
    if (!confirmDelete) return;

    try {
      await deleteRestaurant(restaurantId);
      const updatedRestaurants = restaurants.filter((r) => r.restaurantId !== restaurantId);
      setRestaurants(updatedRestaurants);

      const updatedIds = updatedRestaurants.map((r) => r.restaurantId);
      sessionStorage.setItem("restaurantIds", JSON.stringify(updatedIds));

      alert("Restaurant deleted successfully.");
    } catch (err) {
      console.error("Error deleting restaurant:", err);
      alert("Failed to delete restaurant.");
    }
  };

  const handleViewMenu = (restaurantId: string) => {
    sessionStorage.setItem("selectedRestaurantId", restaurantId);
    router.push(`/menu?restaurantId=${restaurantId}`);
  };

  const closeModal = () => {
    setEditingRestaurant(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => window.location.href = '/registration'}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Restaurant
        </button>
      </div>

      {restaurants.length === 0 ? (
        <div>No restaurants found for this user.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.restaurantId}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col"
            >
              <div className="w-full h-48 bg-gray-300 rounded-lg overflow-hidden">
                <img
                  src={restaurant.imageReference}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-2 flex-1">
                <div className="flex justify-end">
                  <p
                    className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                      restaurant.isVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {restaurant.isVerified ? "Verified" : "Pending Verification"}
                  </p>
                </div>
                <h2 className="text-xl font-semibold">{restaurant.name} </h2>
                <p className="text-gray-600">{restaurant.address}</p>
                <p className="text-gray-600 mt-2">Phone: {restaurant.phone}</p>
                <p className="text-gray-600">Cuisine Type: {restaurant.cuisineType}</p>
                <p className="text-gray-600 mt-2">{restaurant.description}</p>
                <p className="text-gray-600">Open Hours: {restaurant.openHours}</p>
                <p className={`mt-2 ${restaurant.isOpen ? "text-green-500" : "text-red-500"}`}>
                  {restaurant.isOpen ? "Open Now" : "Closed"}
                </p>
                <p className="text-gray-600 mt-2">Ratings: {restaurant.numberOfRatings}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 justify-between">
                <button
                  onClick={() => handleEditDetails(restaurant)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => toggleIsOpen(restaurant.restaurantId)}
                  className={`px-4 py-2 rounded ${
                    restaurant.isOpen ? "bg-red-500" : "bg-green-500"
                  } text-white hover:${restaurant.isOpen ? "bg-red-600" : "bg-green-600"}`}
                >
                  {restaurant.isOpen ? "Close" : "Open"}
                </button>

                <button
                  onClick={() => handleViewMenu(restaurant.restaurantId)}
                  className="bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-700"
                >
                  View Menu
                </button>

                <button
                  onClick={() => handleDeleteRestaurant(restaurant.restaurantId)}
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingRestaurant && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-half">
            <h2 className="text-xl font-semibold mb-4">Edit Restaurant</h2>
            <form onSubmit={handleEditFormSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange}
                placeholder="Restaurant Name"
                className="border p-2 rounded"
                required
              />
              <textarea
                name="address"
                value={editFormData.address}
                onChange={handleEditFormChange}
                placeholder="Address"
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="phone"
                value={editFormData.phone}
                onChange={handleEditFormChange}
                placeholder="Phone"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="cuisineType"
                value={editFormData.cuisineType}
                onChange={handleEditFormChange}
                placeholder="Cuisine Type"
                className="border p-2 rounded"
              />
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditFormChange}
                placeholder="Description"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="openHours"
                value={editFormData.openHours}
                onChange={handleEditFormChange}
                placeholder="Opening Hours"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="imageReference"
                value={editFormData.imageReference}
                onChange={handleEditFormChange}
                placeholder="Image URL"
                className="border p-2 rounded"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  name="longitude"
                  value={editFormData.location.longitude}
                  onChange={(e) =>
                    setEditFormData((prev: any) => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        longitude: e.target.value,
                      },
                    }))
                  }
                  placeholder="Longitude"
                  className="border p-2 rounded flex-1"
                />
                <input
                  type="number"
                  name="latitude"
                  value={editFormData.location.latitude}
                  onChange={(e) =>
                    setEditFormData((prev: any) => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        latitude: e.target.value,
                      },
                    }))
                  }
                  placeholder="Latitude"
                  className="border p-2 rounded flex-1"
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantPage;
