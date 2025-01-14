import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../context/AuthContext";
const Home = () => {
  const { addToCart } = useContext(CartContext);
  const { userName } = useAuthContext();
  const quickEats = [
    { id: 1, name: "Pizza Margherita", price: 10, image: "/PizzaMargherita.jpg" },
    { id: 2, name: "Classic Burger", price: 8, image: "/ClassicBurger.jpg" },
    { id: 3, name: "Pasta Carbonara", price: 12, image: "/PastaCarbonara.jpg" },
    { id: 4, name: "Caesar Salad", price: 7, image: "/CaesarSalad.jpg" },
    { id: 5, name: "Grilled Sandwich", price: 6, image: "/GrilledSandwich.jpg" },
    { id: 6, name: "French Fries", price: 4, image: "/FrenchFries.jpg" },
  ];

  const dailyDelights = [
    { id: 7, name: "BBQ Ribs", price: 15, image: "/BBQRibs.jpg" },
    { id: 8, name: "Chicken Wings", price: 9, image: "/ChickenWings.jpg" },
    { id: 9, name: "Vegetable Soup", price: 5, image: "/VegetableSoup.jpg" },
    { id: 10, name: "Steak", price: 20, image: "/Steak.jpg" },
    { id: 11, name: "Seafood Platter", price: 25, image: "/SeafoodPlatter.jpg" },
    { id: 12, name: "Veggie Burger", price: 9, image: "/VeggieBurger.jpg" },
    { id: 13, name: "Fruit Smoothie", price: 5, image: "/FruitSmoothie.jpg" },
    { id: 14, name: "Tacos", price: 8, image: "/Tacos.jpg" },
    { id: 15, name: "Cheesecake", price: 6, image: "/Cheesecake.webp" },
  ];

  const renderFoodCards = (foods) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {foods.map((food) => (
        <div
          key={food.id}
          className="relative bg-gray-800 border border-accent rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          {/* Food Image */}
          <div
            className="h-60 bg-cover bg-center"
            style={{ backgroundImage: `url(${food.image})` }}
            aria-label={food.name}
          ></div>
          {/* Food Info */}
          <div className="p-4 flex flex-col justify-between h-[180px]">
            <h3 className="text-lg font-bold text-accent">{food.name}</h3>
            <p className="text-gray-300 font-medium">${food.price}</p>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400"
                onClick={() => addToCart(food)}
              >
                Add to Cart
              </button>
              <button className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className=" min-h-screen">
      <Navbar />
      <header className="text-center py-10">
        <h1 className="text-5xl font-bold text-accent">BlackMax Restaurant</h1>
        {userName && <p className="text-lg italic mt-4 text-secondary">Welcome, {userName}!</p>}
        <p className="text-lg italic mt-4 text-secondary">Bringing flavor to your table!</p>
      </header>

      {/* Quick Eats Section */}
      <section className="px-6 mb-12">
        <h2 className="text-3xl font-semibold text-accent mb-6">Quick Eats</h2>
        {renderFoodCards(quickEats)}
      </section>

      {/* Daily Delights Section */}
      <section className="px-6">
        <h2 className="text-3xl font-semibold text-accent mb-6">Daily Delights</h2>
        {renderFoodCards(dailyDelights)}
      </section>

      <footer className="mt-16 py-4 text-center text-secondary text-sm">
        &copy; {new Date().getFullYear()} BlackMax Restaurant. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
