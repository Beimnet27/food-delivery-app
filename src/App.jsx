import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import CartContext from "./context/CartContext";

import ServiceLogin from "./pages/serviceLogin";
import ServiceRegister from "./pages/serviceRegister";
import ServiceHome from "./pages/serviceHome";

import WebService from "./pages/WebService";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import PaymentSuccess from "./pages/PaymentSuccess";

import DeliveryLogin from "./pages/DeliveryLogin";
import DeliveryHome from "./pages/DeliveryHome";

import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./components/Dashboard";
import CustomerList from "./components/customerList";
import DeliveryManagement from "./components/deliveryManagement";
import OrderManagement from "./components/orderManagement";
import PrivateRoute from "./components/privateRoute";

import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <AuthContextProvider>
      <React.StrictMode>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Welcome />} />
              <Route path="/webService" element={<WebService />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/cart-context" element={<CartContext />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />

              {/* Service Routes */}
              <Route path="/serviceLogin" element={<ServiceLogin />} />
              <Route path="/serviceRegister" element={<ServiceRegister />} />
              <Route path="/serviceHome" element={<ServiceHome />} />

              {/* User Routes */}
              <Route path="/home" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />

              {/* Delivery Person Routes */}
              <Route path="/deliveryLogin" element={<DeliveryLogin />} />
              <Route path="/deliveryHome" element={<DeliveryHome />} />

              {/* Admin Routes */}
              <Route path="/adminLogin" element={<AdminLogin />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }>
                <Route path="customerList" element={<CustomerList />} />
                <Route path="deliveryManagement" element={<DeliveryManagement />} />
                <Route path="orderManagement" element={<OrderManagement />} />
              </Route>
            </Routes>
          </main>

          {/* Footer - Always Visible */}
          <Footer />
        </div>
       </React.StrictMode>
      </AuthContextProvider>
    </Router>
  );
};

export default App;
