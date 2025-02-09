import { useEffect, useState } from "react";
import { db } from "../firebase/firestore";
import { collection, updateDoc, doc, getDoc, query, where, onSnapshot, setDoc, arrayRemove } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { getCurrentLocation, getNavigationLink, DeliveryMap } from "../utils/Location"; 
import { FaMotorcycle, FaMapMarkerAlt, FaPhoneAlt, FaStar } from "react-icons/fa";

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
      
      // Fetch all orders documents
      return onSnapshot(ordersRef, (snapshot) => {
        let allOrders = [];
  
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (Array.isArray(data.orders)) {
            // Extract orders that are "ready" or "onDeliver"
            const filteredOrders = data.orders.filter(order => 
              order.state === "ready" || order.state === "onDeliver"
            );
  
            allOrders.push(...filteredOrders);
          }
        });
  
        setOrders(allOrders);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
    };
  
    const unsubscribe = fetchOrders();
    return () => unsubscribe();
  }, []);
  

  // ✅ Auto-update delivery person's location
  useEffect(() => {
    const updateLocationInterval = setInterval(async () => {
      if (userId) {
        try {
          const location = await getCurrentLocation();
          setCurrentLocation(location);
        } catch (error) {
          console.error("Failed to update location:", error);
        }
      }
    }, 15000);

    return () => clearInterval(updateLocationInterval);
  }, [userId]);

  // ✅ Accept Order and start delivery
  const handleAcceptOrder = async (order) => {
    if (!userId) return alert("Delivery person data is missing.");

    try {
      const location = await getCurrentLocation();
      if (!location?.lat || !location?.lng) {
        alert("Failed to get your location. Enable GPS and try again.");
        return;
      }

      setCurrentLocation(location);

      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, {
        state: "onDeliver",
        deliverer: {
          id: userId,
          name: "Your Name", // Replace with dynamic name
          location,
        },
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, state: "onDeliver", deliverer: { id: userId, name: "Your Name", location } } : o
        )
      );
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  // ✅ Mark Order as Delivered
  const markAsDelivered = async (order) => {
    try {
      const orderRef = doc(db, "orders", order.id);
      const completedOrderRef = doc(db, "completedOrders", `${userId}_${order.id}`);

      // ✅ Move order to completedOrders
      await setDoc(completedOrderRef, { ...order, state: "completed" });

      // ✅ Remove from orders collection
      await updateDoc(orderRef, { state: "completed" });

      setOrders((prevOrders) => prevOrders.filter((o) => o.id !== order.id));

      alert("Order marked as delivered!");
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

// ✅ Open Google Maps
const openMap = (lat, lng) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  window.open(googleMapsUrl, "_blank");
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
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">📦 Delivery Dashboard</h1>
  
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
                <img src={order.items[0]?.image || "/placeholder.png"} alt="Food" className="w-20 h-20 rounded-md shadow-sm" />
  
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">{order.items[0]?.name}</h2>
                  <p className="text-gray-600 flex items-center">
                    <FaMapMarkerAlt className="text-red-500 mr-2" /> {order.customerLat}, {order.customerLng}
                  </p>
                  <p className="text-sm">
                    Status: <span className="font-bold text-blue-500">{order.state}</span>
                  </p>
                  <p className="text-sm flex items-center">
                    <FaPhoneAlt className="text-green-500 mr-2" />
                    <a href={`tel:${order.phoneNumber}`} className="text-blue-600 underline">
                      {order.phoneNumber}
                    </a>
                  </p>
                </div>
  
                {order.state === "ready" ? (
                  <button
                    className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                    onClick={() => handleAcceptOrder(order)}
                  >
                    Accept & Navigate
                  </button>
                ) : order.deliverer?.id === userId ? (
                  <>
                    <button
                      onClick={() => openMap(order.customerLat, order.customerLng)}
                      className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                      Track Order
                    </button>
                    <button
                      onClick={() => markAsDelivered(order)}
                      className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                    >
                      Mark as Delivered
                    </button>
                  </>
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






// import { useEffect, useState } from "react";
// import { collection, doc, query, updateDoc, setDoc, onSnapshot, where } from "firebase/firestore";
// import { FaMapMarkerAlt, FaMotorcycle } from "react-icons/fa";
// import { db } from "../firebaseConfig"; // Ensure correct Firestore import
// import DeliveryMap from "./DeliveryMap"; // Your map component
// import { getCurrentLocation } from "../utils/location"; // Your location helper function

// const DeliveryPage = ({ userId }) => {
//   const [orders, setOrders] = useState([]);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch orders (ready & onDeliver)
//   useEffect(() => {
//     const fetchOrders = () => {
//       const ordersRef = collection(db, "orders");
//       const q = query(ordersRef, where("state", "in", ["ready", "onDeliver"]));

//       return onSnapshot(q, (snapshot) => {
//         setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//         setLoading(false);
//       }, (error) => {
//         console.error("Error fetching orders:", error);
//         setLoading(false);
//       });
//     };

//     const unsubscribe = fetchOrders();
//     return () => unsubscribe();
//   }, []);

//   // ✅ Auto-update delivery person's location
//   useEffect(() => {
//     const updateLocationInterval = setInterval(async () => {
//       if (userId) {
//         try {
//           const location = await getCurrentLocation();
//           setCurrentLocation(location);
//         } catch (error) {
//           console.error("Failed to update location:", error);
//         }
//       }
//     }, 15000);

//     return () => clearInterval(updateLocationInterval);
//   }, [userId]);

//   // ✅ Accept Order and start delivery
//   const handleAcceptOrder = async (order) => {
//     if (!userId) return alert("Delivery person data is missing.");

//     try {
//       const location = await getCurrentLocation();
//       if (!location?.lat || !location?.lng) {
//         alert("Failed to get your location. Enable GPS and try again.");
//         return;
//       }

//       setCurrentLocation(location);

//       const orderRef = doc(db, "orders", order.id);
//       await updateDoc(orderRef, {
//         state: "onDeliver",
//         deliverer: {
//           id: userId,
//           name: "Your Name", // Replace with dynamic name
//           location,
//         },
//       });

//       setOrders((prev) =>
//         prev.map((o) =>
//           o.id === order.id ? { ...o, state: "onDeliver", deliverer: { id: userId, name: "Your Name", location } } : o
//         )
//       );
//     } catch (error) {
//       console.error("Error accepting order:", error);
//     }
//   };

//   // ✅ Mark Order as Delivered
//   const markAsDelivered = async (order) => {
//     try {
//       const orderRef = doc(db, "orders", order.id);
//       const completedOrderRef = doc(db, "completedOrders", `${userId}_${order.id}`);

//       // ✅ Move order to completedOrders
//       await setDoc(completedOrderRef, { ...order, state: "completed" });

//       // ✅ Remove from orders collection
//       await updateDoc(orderRef, { state: "completed" });

//       setOrders((prevOrders) => prevOrders.filter((o) => o.id !== order.id));

//       alert("Order marked as delivered!");
//     } catch (error) {
//       console.error("Error completing order:", error);
//     }
//   };

//   if (loading)
//     return (
//       <div className="text-center text-lg mt-8">
//         <FaMotorcycle className="animate-spin mx-auto text-gray-500 text-3xl" />
//         Loading orders...
//       </div>
//     );

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//         📦 Delivery Dashboard
//       </h1>

//       {orders.length === 0 ? (
//         <p className="text-center text-gray-500">No orders available for delivery.</p>
//       ) : (
//         <div className="grid gap-6">
//           {orders.map((order) => (
//             <div
//               key={order.id}
//               className={`p-4 border rounded-lg shadow-lg ${
//                 order.state === "onDeliver" && order.deliverer?.id === userId
//                   ? "bg-green-200 border-green-500"
//                   : "bg-white border-gray-300"
//               }`}
//             >
//               {/* Displaying Order Items */}
//               <div className="flex items-center space-x-4">
//                 {order.items.map((item, index) => (
//                   <img
//                     key={index}
//                     src={item.image || "/placeholder.png"}
//                     alt={item.name}
//                     className="w-20 h-20 object-cover rounded-md shadow-sm"
//                   />
//                 ))}
//               </div>

//               <div className="flex-1">
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   Order #{order.id}
//                 </h2>
//                 <p className="text-gray-600 flex items-center">
//                   <FaMapMarkerAlt className="text-red-500 mr-2" />
//                   {order.address || "No Address Provided"}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Status:{" "}
//                   <span className={`font-bold ${order.state === "ready" ? "text-green-600" : "text-red-500"}`}>
//                     {order.state}
//                   </span>
//                 </p>
//                 <p className="text-sm text-gray-500">Phone: {order.phoneNumber}</p>
//                 <p className="text-sm text-gray-500">Payment Status: {order.status}</p>
//               </div>

//               {/* Order Actions */}
//               {order.state === "ready" ? (
//                 <button
//                   className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
//                   onClick={() => handleAcceptOrder(order)}
//                 >
//                   Accept & Navigate
//                 </button>
//               ) : order.deliverer?.id === userId ? (
//                 <>
//                   <a
//                     href={`https://www.google.com/maps/dir/?api=1&destination=${order.customerLat},${order.customerLng}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
//                   >
//                     Navigate to Customer
//                   </a>
//                   <button
//                     className="px-5 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ml-2"
//                     onClick={() => markAsDelivered(order)}
//                   >
//                     Mark as Delivered
//                   </button>
//                 </>
//               ) : (
//                 <span className="text-sm font-medium text-red-500">In Delivery</span>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Map */}
//       {currentLocation && orders.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Your Location</h2>
//           <DeliveryMap deliveryLocation={currentLocation} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default DeliveryPage;
