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
  const [pageTitle, setPageTitle] = useState('');
  const pageRoute = useLocation();

  useEffect(() => {
    // Dynamically update the page title based on route
    const currentPage = linksTo.find((menu) => menu.link === pageRoute.pathname);
    setPageTitle(currentPage?.title || 'Admin Dashboard');
  }, [pageRoute.pathname]);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <nav className="space-y-4">
          {linksTo.map((menu, index) => (
            <NavLink
              to={menu.link}
              key={index}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg font-medium ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {menu.title}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 p-6">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">{pageTitle}</h2>
        </div>
        {/* Content Outlet */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
