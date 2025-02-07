import { useEffect, useState } from "react";
import { db } from "../firebase/firestore";
import { collection, updateDoc, doc, getDoc, query, where, onSnapshot } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { getCurrentLocation, getNavigationLink, DeliveryMap } from "../utils/Location"; 
import { FaMotorcycle, FaMapMarkerAlt } from "react-icons/fa";

const DeliveryPersonHome = () => {
  const location = useLocation();
  const userId = location.state?.userId || ""; 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryPerson, setDeliveryPerson] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (!userId) {
      console.warn("User ID not found. Redirecting to login...");
      return;
    }

    const fetchDeliveryPerson = async () => {
      try {
        const deliveryRef = doc(db, "deliveryPerson", userId);
        const deliverySnap = await getDoc(deliveryRef);

        if (deliverySnap.exists()) {
          setDeliveryPerson(deliverySnap.data());
        } else {
          console.warn("Delivery person not found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching delivery person:", error);
      }
    };

    fetchDeliveryPerson();
  }, [userId]);

  useEffect(() => {
    const fetchOrders = () => {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("state", "in", ["ready", "onDeliver"]));

      return onSnapshot(
        q,
        (snapshot) => {
          setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching orders:", error);
          setLoading(false);
        }
      );
    };

    const unsubscribe = fetchOrders();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Auto-update delivery person's location every 15 seconds
    const updateLocationInterval = setInterval(async () => {
      if (deliveryPerson) {
        try {
          const location = await getCurrentLocation();
          setCurrentLocation(location);
        } catch (error) {
          console.error("Failed to update location:", error);
        }
      }
    }, 15000);

    return () => clearInterval(updateLocationInterval);
  }, [deliveryPerson]);

  const handleAcceptOrder = async (orderId, customerLat, customerLng) => {
    if (!deliveryPerson) return alert("Delivery person data is missing.");

    try {
      const location = await getCurrentLocation();

      if (!location) {
        alert("Failed to get your location. Please enable location services.");
        return;
      }

      setCurrentLocation(location);

      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        state: "onDeliver",
        deliverer: {
          id: deliveryPerson.id,
          name: deliveryPerson.name,
          location,
        },
        customerLocation: {
          lat: Number(customerLat),
          lng: Number(customerLng),
        },
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, state: "onDeliver", deliverer: { ...deliveryPerson, location } }
            : order
        )
      );
    } catch (error) {
      console.error("Error:", error);
      alert(`Error getting location: ${error.message || error}`);
    }
  };

  if (loading)
    return (
      <div className="text-center text-lg mt-8">
        <FaMotorcycle className="animate-spin mx-auto text-gray-500 text-3xl" />
        Loading orders...
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        📦 Delivery Dashboard
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders available for delivery.</p>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`p-4 border rounded-lg shadow-lg flex items-center space-x-4 ${
                order.state === "onDeliver" && order.deliverer?.id === userId
                  ? "bg-green-200 border-green-500"
                  : "bg-white border-gray-300"
              }`}
            >
              <img
                src={order.image || "/placeholder.png"}
                alt={order.name}
                className="w-20 h-20 object-cover rounded-md shadow-sm"
              />

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">{order.name}</h2>
                <p className="text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="text-red-500 mr-2" />
                  {order.address}
                </p>
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={`font-bold ${
                      order.state === "ready" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {order.state}
                  </span>
                </p>
              </div>

              {order.state === "ready" ? (
                <button
                  className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                  onClick={() => handleAcceptOrder(order.id, order.customerLat, order.customerLng)}
                >
                  Accept & Navigate
                </button>
              ) : order.deliverer?.id === userId ? (
                <a
                  href={getNavigationLink(currentLocation, {
                    lat: order.customerLat,
                    lng: order.customerLng,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Navigate to Customer
                </a>
              ) : (
                <span className="text-sm font-medium text-red-500">In Delivery</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Interactive Map */}
      {currentLocation && orders.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Your Location</h2>
          <DeliveryMap
            deliveryLocation={currentLocation}
            customerLocation={{
              lat: orders[0].customerLat,
              lng: orders[0].customerLng,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DeliveryPersonHome;
