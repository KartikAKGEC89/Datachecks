import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import TimeSeriesChart from './components/TimeSeriesChart';
import ColumnChart from './components/ColumnChart';
import SparklineChart from './components/SparklineChart';

function App() {
  return (
    <div className="App">
      <Navbar />
      <TimeSeriesChart />
      <ColumnChart />
      <SparklineChart />
    </div>
  );
}

export default App;
