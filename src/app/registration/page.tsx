'use client';

import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { createRestaurant } from '../api/apiRestaurant'; 

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 6.9271,
  lng: 79.8612,
};

const libraries = ['places'] as ('places')[];

const RestaurantForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    cuisineType: '',
    description: '',
    openHours: '',
    imageReference: '',
    latitude: defaultCenter.lat,
    longitude: defaultCenter.lng,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const CLOUDINARY_UPLOAD_PRESET = 'unsigned_uploads';
  const CLOUDINARY_CLOUD_NAME = 'dks7sqgjd';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setFormData((prev) => ({
        ...prev,
        latitude: e.latLng.lat(),
        longitude: e.latLng.lng(),
      }));
    }
  };

  const handlePlaceChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const location = place.geometry?.location;
      const address = place.formatted_address || place.name || '';

      if (location) {
        setFormData((prev) => ({
          ...prev,
          latitude: location.lat(),
          longitude: location.lng(),
          address: address,
        }));

        if (searchInputRef.current) {
          searchInputRef.current.value = address;
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userId = Cookies.get('userId');
    if (!userId) {
      alert('User not logged in.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      userId,
      name: formData.name,
      address: formData.address,
      location: {
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      phone: formData.phone,
      cuisineType: formData.cuisineType,
      description: formData.description,
      openHours: formData.openHours,
      imageReference: formData.imageReference,
    };

    try {
      await createRestaurant(payload);
      console.log('Restaurant created successfully');
      router.push('/restaurant');
    } catch (error: any) {
      console.error('Failed to create restaurant:', error.response?.data?.message || error.message);
      alert('Failed to create restaurant.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto mt-5">
      <h1 className="text-2xl font-bold mb-6">Register Restaurant</h1>

      <LoadScript
        googleMapsApiKey="AIzaSyAeTuSVmsdYEZA4ELRqkdKrpzcO3nM9DOI"
        libraries={libraries}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left Column - Map */}
          <div className="space-y-4">
            <StandaloneSearchBox
              onLoad={(ref) => (searchBoxRef.current = ref)}
              onPlacesChanged={handlePlaceChanged}
            >
              <input
                type="text"
                ref={searchInputRef}
                placeholder="Search location..."
                className="w-full p-2 border rounded"
              />
            </StandaloneSearchBox>

            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: formData.latitude, lng: formData.longitude }}
              zoom={12}
              onClick={handleMapClick}
            >
              <Marker position={{ lat: formData.latitude, lng: formData.longitude }} />
            </GoogleMap>

            <p className="text-sm text-blue-600">
              Latitude: <strong>{formData.latitude.toFixed(6)}</strong> | Longitude: <strong>{formData.longitude.toFixed(6)}</strong>
            </p>
          </div>

          {/* Right Column - Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Restaurant Name"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              value={formData.name}
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              value={formData.address}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              value={formData.phone}
              required
            />

            <input
              type="text"
              name="cuisineType"
              placeholder="Cuisine Type"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              value={formData.cuisineType}
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              className="w-full p-2 border rounded"
              rows={3}
              onChange={handleChange}
              value={formData.description}
              required
            />

            <input
              type="text"
              name="openHours"
              placeholder="Open Hours (e.g., 10:00 AM - 10:00 PM)"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              value={formData.openHours}
              required
            />

            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setIsImageUploading(true);

                const formDataImage = new FormData();
                formDataImage.append("file", file);
                formDataImage.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

                try {
                  const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                      method: "POST",
                      body: formDataImage,
                    }
                  );
                  const data = await res.json();
                  console.log("Uploaded Image URL:", data.secure_url);
                  setFormData((prev) => ({
                    ...prev,
                    imageReference: data.secure_url,
                  }));
                } catch (err) {
                  console.error("Upload failed", err);
                  alert('Image upload failed.');
                } finally {
                  setIsImageUploading(false);
                }
              }}
            />

            <button
              type="submit"
              className={`bg-green-600 text-white py-2 rounded hover:bg-green-700 w-full ${isSubmitting || isImageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting || isImageUploading}
            >
              {isImageUploading ? 'Uploading Image...' : isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>

        </div>
      </LoadScript>
    </div>
  );
};

export default RestaurantForm;
