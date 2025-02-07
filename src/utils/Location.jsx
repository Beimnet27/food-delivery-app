import L from "leaflet";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Function to get current user location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject("Geolocation is not supported by your browser.");
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        reject(error.message || "Unable to retrieve location.");
      }
    );
  });
};

// Function to generate a Google Maps navigation link
export const getNavigationLink = (start, end) => {
  if (!start || !end) return "#"; // Prevent errors if data is missing
  return `https://www.google.com/maps/dir/${start.lat},${start.lng}/${end.lat},${end.lng}`;
};

// Interactive Map Component
export const DeliveryMap = ({ deliveryLocation, customerLocation }) => {
  if (!deliveryLocation || !customerLocation) return <p>Loading map...</p>;

  return (
    <MapContainer
      center={deliveryLocation}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Delivery Person Marker */}
      <Marker
        position={deliveryLocation}
        icon={L.icon({
          iconUrl: "/delivery-person.png",
          iconSize: [30, 30],
        })}
      />

      {/* Customer Marker */}
      <Marker
        position={customerLocation}
        icon={L.icon({
          iconUrl: "/customer.png",
          iconSize: [30, 30],
        })}
      />

      {/* Route Line */}
      <Polyline positions={[deliveryLocation, customerLocation]} color="blue" />
    </MapContainer>
  );
};
