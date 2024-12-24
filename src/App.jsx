
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import DeliveryHome from './pages/DeliveryHome';
import Cart from './pages/Cart';
import DeliveryLogin from './pages/DeliveryLogin';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/DeliveryLogin" element={<DeliveryLogin />} />
        <Route path="/DeliveryHome" element={<DeliveryHome />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
