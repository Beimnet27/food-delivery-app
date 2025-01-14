import { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';

  const linksTo = [
    {
        link: '/dashboardAdx/usersList',
        title: 'Customers List',
    },
    {
        link: '/dashboardAdx/deliveryperson',
        title: 'Delivery Persons List',
    },
    {
        link: '/dashboardAdx/orderslist',
        title: 'New Orders',
    },
    {
        link: '/dashboardAdx/statsics',
        title: 'Statistics',
    }
] 

const AdminDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pageRoute.pathname === '/dashboardAdx/usersList') {
        setPageTitle('Users List')
    } else if (pageRoute.pathname === '/dashboardAdx/deliveryperson') {
        setPageTitle('Delivery Persons')
    } else if (pageRoute.pathname === '/dashboardAdx/orderslist') {
        setPageTitle('Orders List')
    } else if (pageRoute.pathname === '/dashboardAdx/statsics') {
        setPageTitle('Resturant Statistics')
    } else {
        setPageTitle('Users list')
        
    }
}, [pageRoute.pathname])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const customersResponse = await fetch("/api/customers");
        const deliveryPersonsResponse = await fetch("/api/delivery-persons");
        const ordersResponse = await fetch("/api/orders");

        setCustomers(await customersResponse.json());
        setDeliveryPersons(await deliveryPersonsResponse.json());
        setOrders(await ordersResponse.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId, userType) => {
    try {
      await fetch(`/api/${userType}/${userId}`, { method: "DELETE" });
      alert(`${userType} deleted successfully!`);
      if (userType === "customers") {
        setCustomers((prev) => prev.filter((user) => user.id !== userId));
      } else if (userType === "delivery-persons") {
        setDeliveryPersons((prev) => prev.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error(`Error deleting ${userType}:`, error);
    }
  };

  const handleAddDeliveryPerson = async (email) => {
    try {
      await fetch("/api/delivery-persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      alert("Delivery person added successfully! Invitation sent.");
    } catch (error) {
      console.error("Error adding delivery person:", error);
    }
  };

  if (loading) return <div>Loading data...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        {/* Customers Section */}
        <section className="p-4 border rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-semibold mb-4">Customers</h2>
          <ul>
            {customers.map((customer) => (
              <li key={customer.id} className="flex justify-between items-center mb-2">
                <span>{customer.name} ({customer.email})</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteUser(customer.id, "customers")}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Delivery Persons Section */}
        <section className="p-4 border rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-semibold mb-4">Delivery Persons</h2>
          <ul>
            {deliveryPersons.map((dp) => (
              <li key={dp.id} className="flex justify-between items-center mb-2">
                <span>{dp.name} ({dp.email})</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteUser(dp.id, "delivery-persons")}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <h3 className="font-semibold">Add Delivery Person</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const email = e.target.elements.email.value;
                handleAddDeliveryPerson(email);
                e.target.reset();
              }}
            >
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="border p-2 rounded mr-2"
                required
              />
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                Add
              </button>
            </form>
          </div>
        </section>

        {/* Orders Section */}
        <section className="p-4 border rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-semibold mb-4">Orders</h2>
          <ul>
            {orders.map((order) => (
              <li key={order.id} className="flex justify-between items-center mb-2">
                <span>Order #{order.id} - {order.state}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => alert("Order management not implemented yet.")}
                >
                  Manage
                </button>
              </li>
            ))}
          </ul>
        </section>
        <div className="flex flex-col space-y-3 w-full pt-8">
                      {linksTo.map((menu, index) => (
                        <NavLink
                          to={menu.link}
                          onClick={() => setShowMenu(false)}
                          key={index}
                          className={`${
                            pageRoute.pathname === menu.link ? 'bg-[#424242]' : ''
                          } px-2 py-3 flex rounded-[6px] items-center space-x-1 font-medium`}
                        >
                          <span>{menu.title}</span>
                        </NavLink>
                      ))}
                      {/* <LogoutButton /> */}
                    </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
