import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useAuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { user_id } = useAuthContext();
  const auth = getAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user_id) return;
      try {
        const cartRef = doc(db, "carts", user_id);
        const cartDoc = await getDoc(cartRef);
        if (cartDoc.exists()) {
          const cart = cartDoc.data().items || [];
          setCartCount(cart.length);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCartCount(0);
      }
    };
    fetchCart();
  }, [user_id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/Login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-transparent text-black shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/home" className="text-2xl font-bold tracking-wide text-yellow-500">
          Black<span className="text-black">Food</span>
        </Link>

        <nav className="hidden lg:flex space-x-8">
          <Link to="/home" className="hover:text-yellow-500 transition">Home</Link>
          <Link to="/about" className="hover:text-yellow-500 transition">About</Link>
        </nav>

        <div className="flex items-center space-x-6">
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-2xl hover:text-yellow-500 transition" />
            {cartCount > 0 && (
              <span className="absolute top-0 left-4 bg-red-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {!user ? (
            <div className="hidden lg:flex space-x-4">
              <Link to="/Login" className="px-5 py-2 bg-yellow-500 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition">
                Sign In
              </Link>
              <Link to="/Signup" className="px-5 py-2 bg-yellow-500 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition">
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
            >
              Log Out
            </button>
          )}
          <button onClick={toggleMenu} className="lg:hidden focus:outline-none">
            {isMenuOpen ? <HiOutlineX className="w-7 h-7 text-yellow-500" /> : <HiOutlineMenu className="w-7 h-7 text-yellow-500" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-gray-900 shadow-md py-4">
          <nav className="flex flex-col items-center space-y-4">
            <Link to="/home" className="hover:text-yellow-500 transition" onClick={toggleMenu}>Home</Link>
            <Link to="/about" className="hover:text-yellow-500 transition" onClick={toggleMenu}>About</Link>
            {!user ? (
              <>
                <Link to="/Login" className="px-5 py-2 bg-yellow-500 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition" onClick={toggleMenu}>
                  Sign In
                </Link>
                <Link to="/Signup" className="px-5 py-2 bg-yellow-500 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition" onClick={toggleMenu}>
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="px-5 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
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
