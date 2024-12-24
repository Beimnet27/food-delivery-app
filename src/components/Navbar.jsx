import { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const menuItems = [
    {
      name: "Home",
      href: "/Login",
    },
    {
      name: "About",
      href: "/about",
    },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/Login" className="flex items-center">
          <span className="text-lg lg:text-2xl font-bold tracking-wide">
            Food<span className="text-yellow-500">Zone</span>
          </span>
        </Link>

        {/* Menu for larger screens */}
        <nav className="hidden lg:flex space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium transition hover:text-yellow-500"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Cart Icon */}
        <Link to="/cart" className="ml-4">
          <FaShoppingCart className="text-xl transition hover:text-yellow-500" />
        </Link>

        {/* Sign-in Button */}
        <div className="hidden lg:block">
          <Link to="/Login">
            <button className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-md transition hover:bg-yellow-600">
              Sign In
            </button>
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={toggleMenu}
          className="lg:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <HiOutlineX className="w-6 h-6" />
          ) : (
            <HiOutlineMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-800">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium transition hover:text-yellow-500"
                onClick={toggleMenu}
              >
                {item.name}
              </Link>
            ))}
            <Link to="/signIn">
              <button
                className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-md transition hover:bg-yellow-600"
                onClick={toggleMenu}
              >
                Sign In
              </button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
