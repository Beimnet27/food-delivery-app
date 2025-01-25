import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; // Import Firebase auth
import { useAuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Track the logged-in user
  const navigate = useNavigate();
  const { userId } = useAuthContext();
  const auth = getAuth(); // Initialize Firebase auth
  const [cartCount, setCartCount] = useState(0); // State to track cart count

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId || !userId) return; // Ensure user and user ID are available
  
      try {
        const cartRef = doc(db, "carts", userId); // Use user.id as the document ID
        const cartDoc = await getDoc(cartRef);
        if (cartDoc.exists()) {
          const cart = cartDoc.data().items || [];
          setCartCount(cart.length);
        } else {
          console.warn("No cart document found for this user");
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart from Firestore:", error);
        setCartCount(0);
      }
    };
  
    fetchCart();
  }, [userId]);
  
  
  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the user if logged in, or null if logged out
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      setUser(null); // Reset the user state
      navigate("/Login"); // Redirect to login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const menuItems = [
    {
      name: "Home",
      href: user ? "/home" : "/Login", // Navigate to home if logged in, otherwise to login
    },
    {
      name: "About",
      href: "/about",
    },
  ];

  return (
    <header className="text-gray-800 bg-transparent shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/home" className="flex items-center">
          <span className="text-lg lg:text-2xl font-extrabold tracking-wide">
            Black<span className="text-yellow-500">Food</span>
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
        <Link to="/cart" className="ml-4 relative">
          <FaShoppingCart className="text-2xl transition hover:text-yellow-500" />
          {cartCount > 0 && (
            <span className="absolute top-0 left-4 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
              {cartCount}
            </span>
          )}
        </Link>
  
        {/* Authentication Buttons */}
        <div className="hidden lg:flex space-x-4">
          {!user ? (
            <>
              <Link to="/Login">
                <button className="px-5 py-2 bg-yellow-500 text-black font-semibold rounded-lg shadow-md transition hover:bg-yellow-600">
                  Sign In
                </button>
              </Link>
              <Link to="/Signup">
                <button className="px-5 py-2 bg-yellow-500 text-black font-semibold rounded-lg shadow-md transition hover:bg-yellow-600">
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md transition hover:bg-red-600"
            >
              Log Out
            </button>
          )}
        </div>
  
        {/* Mobile Menu Icon */}
        <button
          onClick={toggleMenu}
          className="lg:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <HiOutlineX className="w-7 h-7 transition hover:text-yellow-500" />
          ) : (
            <HiOutlineMenu className="w-7 h-7 transition hover:text-yellow-500" />
          )}
        </button>
      </div>
  
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-800 shadow-md">
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
            {!user ? (
              <>
                <Link to="/Login">
                  <button
                    className="px-5 py-2 bg-yellow-500 text-black font-semibold rounded-lg transition hover:bg-yellow-600 shadow-md"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </button>
                </Link>
                <Link to="/Signup">
                  <button
                    className="px-5 py-2 bg-yellow-500 text-black font-semibold rounded-lg transition hover:bg-yellow-600 shadow-md"
                    onClick={toggleMenu}
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="px-5 py-2 bg-red-500 text-white font-semibold rounded-lg transition hover:bg-red-600 shadow-md"
              >
                Log Out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
  
};

export default Navbar;
