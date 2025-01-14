
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import DeliveryHome from './pages/DeliveryHome';
import Cart from './pages/Cart';
import CartContext from './context/CartContext';
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
        <Route path="/CartContext" element={<CartContext />} />
        <Route path="/DeliveryLogin" element={<DeliveryLogin />} />
        <Route path="/DeliveryHome" element={<DeliveryHome />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        {
    path: "/dashboardAdx",
    element: <Dashboard />, // Also accessible on desktop
    errorElement: <ErrorCom />,
    children: [
      {
        path: "/dashboardAdx/broadcast",
        element: <Broadcast />,
      },
      {
        path: "/dashboardAdx/managetasks",
        element: <EditTasks />,
      },
      {
        path: "/dashboardAdx/externaltasks",
        element: <ExtrenalTasks />,
      },
      {
        path: "/dashboardAdx/youtube",
        element: <AdminYoutube />,
      },
      {
        path: "/dashboardAdx/wallets",
        element: <AirdropWallets />,
      },
      {
        path: "/dashboardAdx/search",
        element: <Search />,
      },
      {
        path: "/dashboardAdx/stats",
        element: <Statistics />,
      },
    ],
  },
      </Routes>
    </Router>
  );
};

export default App;
