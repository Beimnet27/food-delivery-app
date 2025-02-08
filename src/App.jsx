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
import Dashboard from './components/Dashboard'; // Import Dashboard and its children components
import CustomerList from './components/customerList';
import DeliveryManagement from './components/deliveryManagement';
import OrderManagement from './components/orderManagement';
import PrivateRoute from './components/privateRoute';
import { AuthContextProvider } from './context/AuthContext';
import Orders from './pages/Orders';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/home" element={
          <AuthContextProvider>
          <Home />
          </AuthContextProvider> 
        }/>
        <Route path="/cart" element={
          <AuthContextProvider>
            <Cart />
            </AuthContextProvider>
          } />
        <Route path="/orders" element={
          <AuthContextProvider>
            <Orders />
          </AuthContextProvider>
        } />

        <Route path="/cart-context" element={<CartContext />} />
        
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
        
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
    </Router>
  );
};

export default App;
