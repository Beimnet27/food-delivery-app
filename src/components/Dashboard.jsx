import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const linksTo = [
  {
    link: '/dashboard/customerList',
    title: 'Customers List',
  },
  {
    link: '/dashboard/deliveryManagement',
    title: 'Delivery Persons List',
  },
  {
    link: '/dashboard/orderManagement',
    title: 'New Orders',
  },
];

const AdminDashboard = () => {

  const [customers, setCustomers] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
 const [pageTitle, setPageTitle] = useState();
  const [loading, setLoading] = useState(true);
  const pageRoute = useLocation();

  useEffect(() => {
    if (pageRoute.pathname === '/dashboard/customerList') {
        setPageTitle('Users List')
    } else if (pageRoute.pathname === '/dashboard/deliveryManagement') {
        setPageTitle('Delivery Persons')
    } else if (pageRoute.pathname === '/dashboard/orderManagement') {
        setPageTitle('Orders List')
    }
    // } else if (pageRoute.pathname === '/dashboard/statsics') {
    //     setPageTitle('Resturant Statistics')
    // } else {
    //     setPageTitle('Users list')
        
    // }
}, [pageRoute.pathname])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex">
        {/* Sidebar Menu */}
        <div className="w-1/4 p-4 border-r">
          <nav className="flex flex-col space-y-3">
            {linksTo.map((menu, index) => (
              <NavLink
                to={menu.link}
                key={index}
                className={({ isActive }) =>
                  `px-4 py-2 rounded ${
                    isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-100'
                  }`
                }
              >
                {menu.title}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="w-3/4 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
