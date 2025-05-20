"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  getMenusByRestaurantId,
  createMenu,
  updateMenu,
  deleteMenu,
  updateMenuStatus,
} from "../api/menuApi";

interface Menu {
  menuId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  restaurantId: string;
}

const restaurantIds = JSON.parse(Cookies.get("restaurantIds") || "[]");
const RESTAURANT_ID = restaurantIds?.[0] || "";

const MenuPage: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      if (!RESTAURANT_ID) {
        console.warn("No valid restaurant ID found.");
        return;
      }

      try {
        const fetchedMenus = await getMenusByRestaurantId(RESTAURANT_ID);
        setMenus(Array.isArray(fetchedMenus) ? fetchedMenus : []);
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      }
    };

    fetchMenus();
  }, []);

  const openAddModal = () => {
    setEditingMenu(null);
    setIsModalOpen(true);
  };

  const openEditModal = (menu: Menu) => {
    setEditingMenu(menu);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = async (menu: Menu) => {
    try {
      if (editingMenu) {
        const updated = await updateMenu(editingMenu.menuId, menu);
        setMenus((prev) =>
          prev.map((item) => (item.menuId === updated.menuId ? updated : item))
        );
      } else {
        const created = await createMenu({ ...menu, restaurantId: RESTAURANT_ID });
        setMenus((prev) => [...prev, created]);
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save menu:", error);
    }
  };

  const handleDelete = async (menuId: string) => {
    try {
      await deleteMenu(menuId);
      setMenus((prev) => prev.filter((menu) => menu.menuId !== menuId));
    } catch (error) {
      console.error("Failed to delete menu:", error);
    }
  };

  const toggleAvailability = async (menuId: string, currentAvailable: boolean) => {
    try {
      const updated = await updateMenuStatus(menuId, !currentAvailable);
      setMenus((prev) =>
        prev.map((menu) => (menu.menuId === updated.menuId ? updated : menu))
      );
    } catch (error) {
      console.error("Failed to toggle availability:", error);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Menu Page</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Menu
        </button>
      </div>

      {menus.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No menus available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {menus.map((menu) => (
            <div
              key={menu.menuId}
              className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <img
                src={menu.imageUrl}
                alt={menu.name}
                className="h-40 w-full object-cover"
              />
              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-lg font-semibold mb-2">{menu.name}</h2>
                <p className="text-gray-600 text-sm mb-2 flex-1">{menu.description}</p>
                <p className="text-gray-800 font-bold mb-2">
                  Rs. {menu.price.toFixed(2)}
                </p>
                <span
                  className={`inline-block text-xs px-2 py-1 rounded mb-2 ${
                    menu.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {menu.available ? "Available" : "Not Available"}
                </span>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => toggleAvailability(menu.menuId, menu.available)}
                    className={`flex-1 py-2 rounded text-white ${
                      menu.available
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {menu.available ? "Mark Unavailable" : "Mark Available"}
                  </button>
                  <button
                    onClick={() => openEditModal(menu)}
                    className="flex-1 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(menu.menuId)}
                    className="flex-1 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <MenuModal
          menu={editingMenu}
          onClose={closeModal}
          onSave={handleSave}
          defaultRestaurantId={RESTAURANT_ID}
        />
      )}
    </div>
  );
};

interface MenuModalProps {
  menu: Menu | null;
  onClose: () => void;
  onSave: (menu: Menu) => void;
  defaultRestaurantId: string;
}

const MenuModal: React.FC<MenuModalProps> = ({
  menu,
  onClose,
  onSave,
  defaultRestaurantId,
}) => {
  const [newMenu, setNewMenu] = useState<Menu>(
    menu ?? {
      menuId: "",
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      available: true,
      restaurantId: defaultRestaurantId,
    }
  );
  const [isUploading, setIsUploading] = useState(false);

  const CLOUDINARY_UPLOAD_PRESET = "unsigned_uploads";
  const CLOUDINARY_CLOUD_NAME = "dks7sqgjd";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMenu((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setNewMenu((prev) => ({
        ...prev,
        imageUrl: data.secure_url,
      }));
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => onSave(newMenu);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{menu ? "Edit" : "Add"} Menu</h2>
        <input
          type="text"
          name="name"
          placeholder="Menu Name"
          value={newMenu.name}
          onChange={handleChange}
          className="border w-full p-2 mb-2"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newMenu.description}
          onChange={handleChange}
          className="border w-full p-2 mb-2"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="border w-full p-2 mb-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border w-full p-2 mb-2"
        />
        {isUploading && <p className="text-sm text-blue-500 mb-2">Uploading image...</p>}
        <input
          type="text"
          name="restaurantId"
          placeholder="Restaurant ID"
          value={newMenu.restaurantId}
          onChange={handleChange}
          className="border w-full p-2 mb-4 text-gray-500"
          readOnly
        />
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`bg-blue-600 text-white px-4 py-2 rounded ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isUploading}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
