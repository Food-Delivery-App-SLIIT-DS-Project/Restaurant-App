"use client";

import React, { useEffect, useState } from 'react';
import { findRestaurantsByUserId } from '../api/apiRestaurant';

const TestPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [audioStarted, setAudioStarted] = useState(false); // ✅ track audio init
  const userId = 'user123456';

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await findRestaurantsByUserId(userId);
        setRestaurants(data);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handlePlayAudio = () => {
    const audio = new Audio('/notification.mp3');

    // play once immediately
    audio.play().catch((err) => console.error('Audio play error:', err));

    // then repeat every 10 seconds
    const interval = setInterval(() => {
      const newAudio = new Audio('/notification.mp3');
      newAudio.play().catch((err) => console.error('Audio play error:', err));
    }, 3000);

    setAudioStarted(true);

    // Optional: clean up when user navigates away
    return () => clearInterval(interval);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Page</h1>
      <p>Restaurants for User ID: {userId}</p>

      {!audioStarted && (
        <button
          onClick={handlePlayAudio}
          className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
        >
          🔔 Start Notifications
        </button>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : restaurants.length === 0 ? (
        <p>No restaurants found.</p>
      ) : (
        <ul>
          {restaurants.map((restaurant: any) => (
            <li key={restaurant.restaurantId} style={{ marginBottom: '20px' }}>
              <h3>{restaurant.name}</h3>
              <p><strong>Address:</strong> {restaurant.address}</p>
              <p><strong>Cuisine:</strong> {restaurant.cuisineType}</p>
              <p><strong>Open Hours:</strong> {restaurant.openHours}</p>
              <p><strong>Description:</strong> {restaurant.description}</p>
              <img
                src={restaurant.imageReference}
                alt={restaurant.name}
                style={{ width: '200px', height: 'auto', borderRadius: '8px' }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TestPage;
