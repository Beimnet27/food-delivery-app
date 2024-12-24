import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";

const Home = () => {
  const { addToCart } = useContext(CartContext);

  const quickEats = [
    { id: 1, name: "Pizza Margherita", price: 10, image: "/PizzaMargherita.jpg" },
    { id: 2, name: "Classic Burger", price: 8 , image: "/ClassicBurger.jpg" },
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
    <div className="grid lg:gap-6 md:gap-4 sm:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {foods.map((food) => (
        <div
          key={food.id}
          className="relative bg-[#0B0C10] border-accent border-[1px] w-full h-[350px] rounded-[15px] text-[13px] flex flex-col justify-between p-4 shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          {/* Food Image Placeholder */}
          <div className="h-[300px] w-full bg-gray-700 bg-cover bg-center rounded-md mb-4 flex items-center justify-center"
          style={{ backgroundImage: `url(${food.image})` }}>
          </div>
          {/* Food Info */}
          <h3 className="text-lg font-bold text-accent">{food.name}</h3>
          <p className="text-md text-gray-300">${food.price}</p>
          <div className="mt-4 flex justify-between">
          <button
            className="bg-green-500 text-white py-1 px-4 mt-4 rounded-lg hover:bg-green-400"
            onClick={() => addToCart(food)}
          >
            Add to Cart
          </button>
            <button className="bg-gray-700 text-gray-300 py-1 px-3 rounded-lg hover:bg-gray-600">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-gray-900 text-white py-6 px-4">
      <Navbar />
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-accent">BlackMax Restaurant</h1>
        <p className="text-lg italic mt-2">Bringing flavor to your table!</p>
      </header>

      {/* Quick Eats Section */}
      <section className="mb-12">
        <h2 className=" w-full text-2xl font-semibold text-accent mb-6">Quick Eats</h2>
        {renderFoodCards(quickEats)}
      </section>

      {/* Daily Delights Section */}
      <section>
        <h2 className=" w-full text-2xl font-semibold text-accent mb-6">
          Daily Delights
        </h2>
        {renderFoodCards(dailyDelights)}
      </section>
      <footer className="mt-12 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Hore Restaurant. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
