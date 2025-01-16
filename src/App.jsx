import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import DeliveryHome from './pages/DeliveryHome';
import Cart from './pages/Cart';
import CartContext from './context/CartContext';
import DeliveryLogin from './pages/DeliveryLogin';
//import AdminDashboard from './components/Dashboard';
import Dashboard from './components/Dashboard'; // Import Dashboard and its children components
//import Broadcast from './components/Broadcast';
import customerList from './components/customerList';
import deliveryManagement from './components/deliveryManagement';
import orderManagement from './components/orderManagement';
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
        <Route path="/delivery-login" element={<DeliveryLogin />} />
        <Route path="/delivery-home" element={<DeliveryHome />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* Nested Routes for Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} errorElement={<ErrorCom />}>
          <Route path="customerList" element={<customerList />} />
          <Route path="deliveryManagement" element={<deliveryManagement />} />
          <Route path="orderManagement" element={<orderManagement />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
