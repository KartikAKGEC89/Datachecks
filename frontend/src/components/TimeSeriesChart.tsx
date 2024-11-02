import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend,
    Title,
    ChartOptions,
    Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Title, Filler);

interface UserData {
    arrival_date_year: number;
    arrival_date_month: string;
    arrival_date_day_of_month: number;
    adults: number;
    children: number;
    babies: number;
    country: string;
}

const monthMapping: { [key: string]: number } = {
    "January": 0,
    "February": 1,
    "March": 2,
    "April": 3,
    "May": 4,
    "June": 5,
    "July": 6,
    "August": 7,
    "September": 8,
    "October": 9,
    "November": 10,
    "December": 11
};

const TimeSeriesChart: React.FC = () => {
    const [userData, setUserData] = useState<UserData[]>([]);
    const [startDate, setStartDate] = useState<string>('2015-07-01');
    const [endDate, setEndDate] = useState<string>('2015-07-10');
    const [filteredData, setFilteredData] = useState<{ date: string; totalVisitors: number }[]>([]);
    const [countryData, setCountryData] = useState<{ country: string; totalVisitors: number }[]>([]);

    const fetchPosts = async () => {
        try {
            const response = await fetch("https://datachecks.onrender.com/api/data");
            const data = await response.json();
            setUserData(data);
            filterData(data, startDate, endDate);
            aggregateCountryData(data, startDate, endDate);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const filterData = (data: UserData[], start: string, end: string) => {
        const startDateObj = new Date(start);
        const endDateObj = new Date(end);
        const aggregatedData: { [key: string]: number } = {};

        data.forEach(item => {
            const { arrival_date_year, arrival_date_month, arrival_date_day_of_month, adults, children, babies } = item;
            const monthNumber = monthMapping[arrival_date_month];
            const itemDate = new Date(arrival_date_year, monthNumber, arrival_date_day_of_month);

            if (itemDate >= startDateObj && itemDate <= endDateObj && !isNaN(itemDate.getTime())) {
                const dateKey = itemDate.toISOString().split('T')[0];
                if (aggregatedData[dateKey]) {
                    aggregatedData[dateKey] += (adults + children + babies);
                } else {
                    aggregatedData[dateKey] = (adults + children + babies);
                }
            }
        });

        const aggregatedArray = Object.entries(aggregatedData).map(([date, totalVisitors]) => ({
            date,
            totalVisitors
        }));

        setFilteredData(aggregatedArray);
    };

    const aggregateCountryData = (data: UserData[], start: string, end: string) => {
        const countryAggregated: { [key: string]: number } = {};
        const startDateObj = new Date(start);
        const endDateObj = new Date(end);

        data.forEach(item => {
            const { arrival_date_year, arrival_date_month, arrival_date_day_of_month, adults, children, babies, country } = item;
            const monthNumber = monthMapping[arrival_date_month];
            const itemDate = new Date(arrival_date_year, monthNumber, arrival_date_day_of_month);

            if (itemDate >= startDateObj && itemDate <= endDateObj && !isNaN(itemDate.getTime())) {
                const totalVisitors = adults + children + babies;

                if (countryAggregated[country]) {
                    countryAggregated[country] += totalVisitors;
                } else {
                    countryAggregated[country] = totalVisitors;
                }
            }
        });

        const countryArray = Object.entries(countryAggregated).map(([country, totalVisitors]) => ({
            country,
            totalVisitors,
        }));

        setCountryData(countryArray);
    };

    const handleEnter = () => {
        filterData(userData, startDate, endDate);
    };
    
  
    const handleEnterCon = () => {
      aggregateCountryData(userData, startDate, endDate);
    };

    const chartData = {
        labels: filteredData.map(item => item.date),
        datasets: [
            {
                label: 'Total Visitors Per Day',
                data: filteredData.map(item => item.totalVisitors),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.3)',
                fill: true,
                tension: 0.5,
                pointRadius: 5,
                pointHoverRadius: 7,
            }
        ]
    };

    const countryChartData = {
        labels: countryData.map(item => item.country),
        datasets: [
            {
                label: 'Total Visitors Per Country',
                data: countryData.map(item => item.totalVisitors),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(153, 102, 255, 0.8)',
            }
        ]
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Visitor Statistics',
                font: {
                    size: 18,
                    weight: 'bold'
                }
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Dates',
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Visitors',
                },
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
            },
        },
    };

    const countryOptions: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Visitors Per Country',
                font: {
                    size: 18,
                    weight: 'bold'
                }
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Countries',
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Visitors',
                },
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
            },
        },
    };

    return (
    <>
        <h2 style={{display:"flex", justifyContent:"center", alignItems:"center", fontSize:"40px"}}>Datachecks Dashboard Hotel Booking Data</h2>
        <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-around', 
            alignItems: 'center', 
            height: '100vh',
            padding: '30px',
        }}>
            <div style={{ 
                width: '45%', 
                height: '500px', 
                display: "flex", 
                flexDirection: 'column', 
                alignItems: "center", 
                justifyContent: "center",
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                padding: '20px',
            }}>
                <h2>Number of Visitors Per Day</h2>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{backgroundColor: '#fff',  border:"1px solid black", padding:"4px"}}>
                        Start Date:
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </label>
                    <label style={{ marginLeft: '10px', backgroundColor: '#fff',  border:"1px solid black", padding:"4px" }}>
                        End Date:
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </label>
                    <button onClick={handleEnter} style={{ marginLeft: '10px', border:"1px solid black", padding:"4px" }}>Enter</button>
                </div>
                <Line options={options} data={chartData} />
            </div>
            <div style={{ 
                width: '45%', 
                height: '500px', 
                display: "flex", 
                flexDirection: 'column', 
                alignItems: "center", 
                justifyContent: "center",
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                padding: '20px',
            }}>
                <h2>Visitors Per Country</h2>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{backgroundColor: '#fff',  border:"1px solid black", padding:"4px"}}>
                        Start Date:
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </label>
                    <label style={{ marginLeft: '10px', backgroundColor: '#fff',  border:"1px solid black", padding:"4px" }}>
                        End Date:
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </label>
                    <button onClick={handleEnterCon} style={{ marginLeft: '10px', border:"1px solid black", padding:"4px" }}>Enter</button>
                </div>
                <Bar options={countryOptions} data={countryChartData} />
            </div>
        </div>
    </>
    );
};

export default TimeSeriesChart;
