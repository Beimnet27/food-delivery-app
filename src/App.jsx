import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import Home from './pages/Home';
import DeliveryHome from './pages/DeliveryHome';
import Cart from './pages/Cart';
import CartContext from './context/CartContext';
import DeliveryLogin from './pages/DeliveryLogin';
import PaymentSuccess from './pages/PaymentSuccess';
//import AdminDashboard from './components/Dashboard';
import Dashboard from './components/Dashboard'; // Import Dashboard and its children components
//import Broadcast from './components/Broadcast';
import CustomerList from './components/customerList';
import DeliveryManagement from './components/deliveryManagement';
import OrderManagement from './components/orderManagement';
import PrivateRoute from './components/privateRoute';
//import ErrorCom from './components/ErrorCom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cart-context" element={<CartContext />} />
        <Route path="/deliveryLogin" element={<DeliveryLogin />} />
        <Route path="/deliveryHome" element={<DeliveryHome />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="AdminLogin" element={<AdminLogin />} />
  
        {/* Nested Routes for Dashboard */}
        <Route path="/dashboard/*" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute> 
            }
            >
        {/* // errorElement={<ErrorCom />}> */}
          <Route path="customerList" element={<CustomerList />} />
          <Route path="deliveryManagement" element={<DeliveryManagement />} />
          <Route path="orderManagement" element={<OrderManagement />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
