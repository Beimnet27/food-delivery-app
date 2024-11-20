
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Welcome to Food Delivery</h1>
      <p>Order your favorite meals from the best restaurants!</p>
      <div>
        <Link to="/login">
          <button style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>Login</button>
        </Link>
        <Link to="/signup">
          <button style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
