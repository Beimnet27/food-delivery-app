import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { HiMenuAlt1 } from "react-icons/hi";
import { IoCloseCircle } from "react-icons/io5";

const linksTo = [
  { link: "/dashboard/customerList", title: "Customers List" },
  { link: "/dashboard/deliveryManagement", title: "Delivery Persons List" },
  { link: "/dashboard/orderManagement", title: "New Orders" },
];

const AdminDashboard = () => {
  const [pageTitle, setPageTitle] = useState("");
  const pageRoute = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const infoRefTwo = useRef(null);

  const handleClickOutside = (event) => {
    if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    const currentPage = linksTo.find((menu) => menu.link === pageRoute.pathname);
    setPageTitle(currentPage?.title || "Admin Dashboard");
  }, [pageRoute.pathname]);

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col pt-5 space-y-3 w-full">
      {/* Navbar */}
      <div className="w-full flex items-center justify-between bg-gray-800 p-4 fixed top-0 z-50">
        <h1 className="text-lg sm:text-xl font-bold text-white">{pageTitle}</h1>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-white sm:hidden"
        >
          {showMenu ? <IoCloseCircle size={24} /> : <HiMenuAlt1 size={24} />}
        </button>
      </div>

      {/* Layout */}
      <div className="flex flex-col sm:flex-row pt-16">
        {/* Sidebar */}
        <div
          className={`${
            showMenu
              ? "fixed sm:relative flex w-full sm:w-1/5 bg-gray-900 text-white h-full z-40"
              : "hidden sm:flex sm:w-1/5"
          }`}
        >
          <div
            ref={infoRefTwo}
            className="flex flex-col space-y-5 w-full p-4 sm:h-auto h-screen overflow-y-auto"
          >
            {linksTo.map((menu, index) => (
              <NavLink
                key={index}
                to={menu.link}
                onClick={() => setShowMenu(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium ${
                  pageRoute.pathname === menu.link
                    ? "bg-gray-700"
                    : "hover:bg-gray-800"
                }`}
              >
                {menu.title}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
