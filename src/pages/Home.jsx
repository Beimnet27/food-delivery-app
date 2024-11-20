

const Home = () => {
  const foods = [
    { id: 1, name: 'Pizza', price: '$10' },
    { id: 2, name: 'Burger', price: '$8' },
    { id: 3, name: 'Pasta', price: '$12' },
  ];

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Restaurant Menu</h1>
      <ul>
        {foods.map((food) => (
          <li key={food.id} style={{ margin: '1rem 0' }}>
            <strong>{food.name}</strong> - {food.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
