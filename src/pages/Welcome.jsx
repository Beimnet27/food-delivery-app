import { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { quickEats, dailyDelights } from "../data/Menu"; // Importing food list
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon (since Leaflet's default doesn't display properly in React)
const customIcon = new L.Icon({
   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
   iconSize: [25, 41],
   iconAnchor: [12, 41],
   popupAnchor: [1, -34],
 });

const Welcome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFoods, setFilteredFoods] = useState([]);

  const handleSearch = () => {
    const results = [...quickEats, ...dailyDelights].filter((food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFoods(results);
  };

  return (
    <div className="relative bg-white lg:w-full">
      <Navbar />
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div className="flex flex-col justify-center px-4 py-12 md:py-16 lg:col-span-7 lg:gap-x-6 lg:px-6 lg:py-24 xl:col-span-6">
          <div className="flex items-center p-1 space-x-2 bg-gray-100 rounded-full max-w-max">
            <div className="bg-white rounded-full">
              <p className="text-sm font-medium">Let&apos;s eat</p>
            </div>
            <p className="text-sm font-medium">Join our Black Food &rarr;</p>
          </div>
          <h1 className="mt-8 text-3xl font-normal tracking-tight text-black md:text-4xl lg:text-6xl">
            Order Your
            <div className="font-serif text-4xl font-bold text-yellow md:text-6xl">
              {" "}
              Favourite Food
            </div>
          </h1>
          <p className="mt-8 text-lg text-gray-700">
            "Satisfy your cravings, elevate your taste. Welcome to{" "}
            <span className="font-semibold text-yellow">Black Food</span>,
            where every bite is a delight!"
          </p>

          {/* Search Section */}
          <div className="mt-8">
            <div className="flex space-x-2">
              <input
                className="flex w-full px-3 py-2 text-sm bg-transparent border rounded-md border-black/30 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                type="search"
                placeholder="Search food"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="button"
                className="rounded-md bg-yellow px-3 py-2.5 text-sm font-semibold hover:text-white text-black shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>

            {/* Display search results */}
            <div className="mt-4 space-y-4">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    className="flex items-center justify-between p-3 border border-gray-300 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div>
                        <h2 className="text-lg font-semibold">{food.name}</h2>
                        <p className="text-gray-600 text-sm">{food.description}</p>
                      </div>
                    </div>
                    <Link
                      to="/signup"
                      className="bg-yellow hover:bg-black hover:text-white text-black px-4 py-2 rounded-md font-medium"
                    >
                      Join to Order
                    </Link>
                  </div>
                ))
              ) : searchTerm ? (
                <p className="text-red-500 font-semibold">Food isn't available</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative px-2 lg:col-span-5 xl:col-span-6 lg:mb-9">
          <img
            className="aspect-[3/2] bg-gray-50 object-cover lg:aspect-[4/3] lg:h-[530px] xl:aspect-[1/1] lg:mt-14 rounded-3xl shadow-2xl"
            src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
          />
        </div>

        {/* Map Section */}
        <div className=" lg:col-span-2 xl:col-span-10 lg:mb-6 lg:mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">You Can Find Us Here</h2>
          <MapContainer center={[9.03, 38.74]} zoom={13} className="h-[350px] w-full rounded-lg shadow-lg">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[9.03, 38.74]} icon={customIcon}>
              <Popup>Black Food - Addis Ababa</Popup>
            </Marker>
          </MapContainer>
        </div>

      </div>
    </div>
  );
};

export default Welcome;
