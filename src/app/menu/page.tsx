"use client";
import React, { useState } from "react";

// Define the Menu model here
interface Menu {
  menuId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  restaurantId: string; // Assuming a reference to a restaurant
}

const MenuePage: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([
    {
      menuId: "1",
      name: "Cheeseburger",
      description: "A delicious cheeseburger with fresh ingredients.",
      price: 5.99,
      imageUrl: "https://via.placeholder.com/150",
      available: true,
      restaurantId: "101",
    },
    {
      menuId: "2",
      name: "Veggie Pizza",
      description: "A healthy pizza loaded with fresh vegetables.",
      price: 7.99,
      imageUrl: "https://via.placeholder.com/150",
      available: true,
      restaurantId: "101",
    },
    {
      menuId: "3",
      name: "Pasta Alfredo",
      description: "A creamy pasta dish with Alfredo sauce.",
      price: 8.49,
      imageUrl: "https://via.placeholder.com/150",
      available: true,
      restaurantId: "102",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  const openAddModal = () => {
    setEditingMenu(null);
    setIsModalOpen(true);
  };

  const openEditModal = (menu: Menu) => {
    setEditingMenu(menu);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (menu: Menu) => {
    if (editingMenu) {
      // Update existing menu
      setMenus((prev) =>
        prev.map((item) => (item.menuId === menu.menuId ? menu : item))
      );
    } else {
      // Create new menu
      const newMenu = { ...menu, menuId: `${menus.length + 1}` }; // Dummy new ID
      setMenus((prev) => [...prev, newMenu]);
    }
    closeModal();
  };

  const handleDelete = (menuId: string) => {
    setMenus((prev) => prev.filter((menu) => menu.menuId !== menuId));
  };

  const toggleAvailability = (menuId: string, currentAvailable: boolean) => {
    const updatedMenu = menus.find((menu) => menu.menuId === menuId);
    if (updatedMenu) {
      setMenus((prev) =>
        prev.map((menu) =>
          menu.menuId === menuId ? { ...menu, available: !currentAvailable } : menu
        )
      );
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
                <p className="text-gray-800 font-bold mb-2">${menu.price.toFixed(2)}</p>
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
        />
      )}
    </div>
  );
};

// Dummy modal component for adding/editing menu
interface MenuModalProps {
  menu: Menu | null;
  onClose: () => void;
  onSave: (menu: Menu) => void;
}

const MenuModal: React.FC<MenuModalProps> = ({ menu, onClose, onSave }) => {
  const [newMenu, setNewMenu] = useState<Menu>(
    menu ?? {
      menuId: "",
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      available: true,
      restaurantId: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMenu((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(newMenu);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">{menu ? "Edit" : "Add"} Menu</h2>
        <div className="mb-4">
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
            value={newMenu.price}
            onChange={handleChange}
            className="border w-full p-2 mb-2"
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={newMenu.imageUrl}
            onChange={handleChange}
            className="border w-full p-2 mb-2"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuePage;
