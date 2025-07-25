import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [wishes, setWishes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/wishes')
      .then(res => setWishes(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>All Wishes</h1>
      {wishes.map(wish => (
        <div key={wish._id}>
          <h3>{wish.title}</h3>
          <p>{wish.description}</p>
          <button>Donate</button>
        </div>
      ))}
    </div>
  );
};

export default Home;
