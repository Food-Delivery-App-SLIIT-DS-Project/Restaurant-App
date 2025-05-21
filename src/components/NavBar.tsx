import Link from 'next/link';
import React from 'react';
import Cookies from 'js-cookie'; // import js-cookie to handle cookies

const Navbar: React.FC = () => {
  const handleLogout = () => {
    console.log("accessToken:", Cookies.get("accessToken"));
    console.log("refreshToken:", Cookies.get("refreshToken"));
    console.log("userId:", Cookies.get("userId"));
    // Remove cookies when logging out
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userId");
    Cookies.remove("restaurantIds");

    window.location.href = '/'; // Redirecting to home page (or login page)
  };

  return (
    <nav className="flex justify-between items-center px-4 py-2" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="flex items-center space-x-8">
        <div className="w-10 h-10 bg-gray-500 rounded-full flex flex-col justify-center">
          <p className="text-white text-center leading-none text-xs">QUICK</p>
          <p className="text-white text-center font-bold leading-none text-sm">GRUBS</p>
        </div>
        <ul className="flex space-x-16 text-sm ml-20" style={{ color: 'var(--color-background)' }}>
          <Link href="/orders">
            <li className="hover:text-[color:var(--color-hover)] cursor-pointer">Orders</li>
          </Link>
          <Link href="/restaurant">
            <li className="hover:text-[color:var(--color-hover)] cursor-pointer">Restaurant</li>
          </Link>
          <Link href="/menu">
            <li className="hover:text-[color:var(--color-hover)] cursor-pointer">Menu</li>
          </Link>
        </ul>
      </div>
      <div
        onClick={handleLogout}
        className="text-red-400 flex items-center mr-5 bg-gray-200 rounded-full px-5 py-1 hover:text-white border-2 border-red-400 cursor-pointer hover:bg-red-500 hover:border-red-500"
      >
        <p className="text-sm">Log Out</p>
      </div>
     
    </nav>
  );
};

export default Navbar;
