import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const SparklineChart: React.FC = () => {
  const optionsSpark1: ApexOptions = {
    series: [{
      data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54] // Sample data
    }],
    chart: {
      type: 'area',
      height: 160,
      sparkline: {
        enabled: true
      }
    },
    stroke: {
      curve: 'straight'
    },
    fill: {
      opacity: 0.3
    },
    yaxis: {
      min: 0
    },
    colors: ['#DCE6EC'],
    title: {
      text: '$424,652',
      offsetX: 0,
      style: {
        fontSize: '24px'
      }
    },
    subtitle: {
      text: 'Sales',
      offsetX: 0,
      style: {
        fontSize: '14px'
      }
    }
  };

  return (
    <div>
      <div id="chart-spark1">
        <ReactApexChart
          options={optionsSpark1}
          series={optionsSpark1.series}
          type="area"
          height={160}
        />
      </div>
    </div>
  );
};

export default SparklineChart;
