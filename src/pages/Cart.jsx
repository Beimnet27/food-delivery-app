import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Your Cart</h1>
      {cart.length > 0 ? (
        <div>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center mb-4">
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md" />
                <div className="flex-1 ml-4">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-300">${item.price} x {item.quantity}</p>
                  <div>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-700 text-white py-1 px-2 rounded-md mr-2"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-700 text-white py-1 px-2 rounded-md"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-lg"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="text-right mt-6">
            <h3 className="text-xl font-bold">Total: ${calculateTotal()}</h3>
            <button className="bg-green-500 text-white py-2 px-6 mt-4 rounded-lg hover:bg-green-400">
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-300">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
