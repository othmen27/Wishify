import React from 'react';

const Leaderboard = () => {
  // Placeholder data
  const topDonors = [
    { name: 'Alice', amount: 200 },
    { name: 'Bob', amount: 150 },
    { name: 'Charlie', amount: 100 },
  ];

  return (
    <div>
      <h1>Leaderboard</h1>
      <ul>
        {topDonors.map((donor, idx) => (
          <li key={idx}>{donor.name}: ${donor.amount}</li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
