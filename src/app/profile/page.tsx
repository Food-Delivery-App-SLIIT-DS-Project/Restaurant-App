'use client';
import React from 'react';

const profileData = {
  restaurantId: 'rest_epJoCIusST',
  userId: 'user123',
  name: "Kasun's Diner",
  address: '123 Main Street, Colombo, Sri Lanka',
  location: {
    longitude: 79.8612,
    latitude: 6.9271,
  },
  phone: '+94 77 123 4567',
  cuisineType: 'Sri Lankan',
  description: 'A cozy spot serving authentic Sri Lankan food.',
  openHours: '8:00 AM - 10:00 PM',
  imageReference: 'https://i.postimg.cc/4dPLZXCR/istockphoto-1316145932-612x612.jpg',
  numberOfRatings: 0,
  isOpen: true,
  isVerified: true,
};

const ProfilePage = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="rounded-xl shadow-md overflow-hidden bg-white">
        <img
          src={profileData.imageReference}
          alt={profileData.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
          <p className="text-gray-600 mb-4">{profileData.description}</p>
          
          <div className="space-y-2">
            <p><span className="font-semibold">Address:</span> {profileData.address}</p>
            <p><span className="font-semibold">Phone:</span> {profileData.phone}</p>
            <p><span className="font-semibold">Cuisine Type:</span> {profileData.cuisineType}</p>
            <p><span className="font-semibold">Open Hours:</span> {profileData.openHours}</p>
            <p><span className="font-semibold">Location:</span> Lat {profileData.location.latitude}, Lng {profileData.location.longitude}</p>
            <p>
              <span className="font-semibold">Status:</span>{' '}
              <span className={profileData.isOpen ? 'text-green-600' : 'text-red-600'}>
                {profileData.isOpen ? 'Open' : 'Closed'}
              </span>
            </p>
            <p>
              <span className="font-semibold">Verified:</span>{' '}
              {profileData.isVerified ? '✅ Yes' : '❌ No'}
            </p>
            <p>
              <span className="font-semibold">Ratings:</span> {profileData.numberOfRatings}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
