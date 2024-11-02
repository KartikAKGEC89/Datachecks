import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import TimeSeriesChart from './components/TimeSeriesChart';
import SparklineChart from './components/SparklineChart';

function App() {
  return (
    <div className="App">
      <Navbar />
      <TimeSeriesChart />
      <SparklineChart />
    </div>
  );
}

export default App;
