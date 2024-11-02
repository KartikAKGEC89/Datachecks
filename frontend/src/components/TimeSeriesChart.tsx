import React, { useState, useEffect } from 'react';

const TimeSeriesChart = () => {
  const [user, setUser] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("https://datachecks.onrender.com/api/data");
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      {user.length > 0 ? (
        user.map((item, index) => (
          <div key={index}>
            {/* Customize how you display each item here */}
            <p>{JSON.stringify(item)}</p>
          </div>
        ))
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default TimeSeriesChart;
