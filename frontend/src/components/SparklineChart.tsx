import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface VisitorData {
    _id: string;
    hotel: string;
    arrival_date_year: number;
    arrival_date_month: string;
    arrival_date_day_of_month: number;
    adults: number;
    children: number;
    babies: number;
    country: string;
}

const SparklineChart: React.FC = () => {
    const [userData, setUserData] = useState<VisitorData[]>([]);
    const [adultsData, setAdultsData] = useState<{ date: string; count: number }[]>([]);
    const [childrenData, setChildrenData] = useState<{ date: string; count: number }[]>([]);
    const [adultsVolume, setAdultsVolume] = useState(0);
    const [childrenVolume, setChildrenVolume] = useState(0);
    const [adultsAvg, setAdultsAvg] = useState(0);
    const [childrenAvg, setChildrenAvg] = useState(0);

    const fetchPosts = async () => {
        try {
            const response = await fetch("https://datachecks.onrender.com/api/data");
            const data: VisitorData[] = await response.json();
            setUserData(data);
            aggregateVisitorData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const aggregateVisitorData = (data: VisitorData[]) => {
        const adultsMap: { [key: string]: number } = {};
        const childrenMap: { [key: string]: number } = {};

        data.forEach(item => {
            const dateKey = `${item.arrival_date_year}-${item.arrival_date_month}-${item.arrival_date_day_of_month}`;
            adultsMap[dateKey] = (adultsMap[dateKey] || 0) + item.adults;
            childrenMap[dateKey] = (childrenMap[dateKey] || 0) + item.children;
        });

        const adultsArray = Object.entries(adultsMap).map(([date, count]) => ({ date, count }));
        const childrenArray = Object.entries(childrenMap).map(([date, count]) => ({ date, count }));

        setAdultsData(adultsArray);
        setChildrenData(childrenArray);

        const adultsTotal = adultsArray.reduce((sum, item) => sum + item.count, 0);
        const childrenTotal = childrenArray.reduce((sum, item) => sum + item.count, 0);

        setAdultsVolume(adultsTotal);
        setChildrenVolume(childrenTotal);

        setAdultsAvg(Math.round(adultsTotal / adultsArray.length));
        setChildrenAvg(Math.round(childrenTotal / childrenArray.length));
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const sparklineChartOptions = (color: string, label: string): ApexOptions => ({
        chart: {
            type: "area",
            height: 300,
            width: 500,
            sparkline: { enabled: true },
            toolbar: { show: false },
            zoom: { enabled: false },
            background: "#ffffff"
        },
        stroke: { curve: "smooth", width: 2 },
        colors: [color],
        dataLabels: { enabled: false },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 0.1,
                opacityFrom: 0.6,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            }
        },
        markers: { size: 4 },
        tooltip: {
            enabled: true,
            x: {
                formatter: (value, { dataPointIndex }) => adultsData[dataPointIndex]?.date || "",
            },
            y: {
                formatter: (value) => `${value} visitors`
            }
        },
        title: {
            text: label,
            align: "center",
            style: { fontSize: "18px", color: "#333" }
        }
    });

    const barChartOptions = (data: { date: string; count: number }[]): ApexOptions => ({
        chart: {
            type: "bar",
            height: 100, 
            width: 300,  
            sparkline: { enabled: true },
            toolbar: { show: false },
        },
        xaxis: {
            categories: data.map(item => item.date),
            title: {
                text: "Date",
                style: {
                    fontSize: "10px",
                    color: "#333"
                }
            },
            labels: {
                show: false, 
            },
            tooltip: {
                enabled: false
            }
        },
        yaxis: {
            title: {
                text: "Number of Visitors",
                style: {
                    fontSize: "10px",
                    color: "#333"
                }
            },
            labels: {
                show: false, 
            }
        },
        colors: ["#74b9ff"],
        plotOptions: {
            bar: {
                columnWidth: "70%",
                borderRadius: 4,
                distributed: false,
            }
        },
        tooltip: {
            enabled: true,
            x: {
                formatter: (value, { dataPointIndex }) => data[dataPointIndex]?.date || "",
            },
            y: {
                formatter: (value) => `${value} visitors`
            }
        },
        grid: {
            borderColor: '#e0e0e0',
            row: {
                colors: ['#f9f9f9', '#fff'],
                opacity: 0.5
            }
        },
    });

    const getLast10DaysData = (data: { date: string; count: number }[]) => {
        return data.slice(-10);
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "40px", padding: "20px", background: "#ffffff", flexDirection: window.innerWidth <= 1087 ? 'column' : 'row',}}>
            <div style={{ textAlign: "center", width: window.innerWidth <= 1087 ? '100px' : '540px', padding: "20px", borderRadius: "8px"}}>
                <h4>Total Adult Visitors</h4>
                {adultsData.length > 0 ? (
                    <>
                        <ApexCharts
                            options={sparklineChartOptions("#00b894", "Adults")}
                            series={[{ name: "Adults", data: adultsData.map(item => item.count) }]}
                            type="area"
                            height={300}
                            width={window.innerWidth <= 1087 ? '160px' : '500px'}
                        />
                        <div style={{ marginTop: "10px", fontSize: "14px" }}>
                            <p><strong>Volume:</strong> {adultsVolume}</p>
                            <p><strong>Avg Last 10 Days:</strong> {adultsAvg}</p>
                            <p><strong>Change:</strong> {Math.round(((adultsData[adultsData.length - 1]?.count || 0) - (adultsData[adultsData.length - 10]?.count || 0)) / (adultsData[adultsData.length - 10]?.count || 1) * 100)}%</p>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <ApexCharts
                                    options={barChartOptions(getLast10DaysData(adultsData))}
                                    series={[{ name: "Last 10 Days", data: getLast10DaysData(adultsData).map(item => item.count) }]}
                                    type="bar"
                                    height={100} 
                                    width={300} 
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>

            <div style={{ textAlign: "center", width: window.innerWidth <= 1087 ? '100px' : '540px', padding: "20px", borderRadius: "8px" }}>
                <h4>Total Children Visitors</h4>
                {childrenData.length > 0 ? (
                    <>
                        <ApexCharts
                            options={sparklineChartOptions("#d63031", "Children")}
                            series={[{ name: "Children", data: childrenData.map(item => item.count) }]}
                            type="area"
                            height={300}
                            width={window.innerWidth <= 1087 ? '160px' : '500px'}
                        />
                        <div style={{ marginTop: "10px", fontSize: "14px" }}>
                            <p><strong>Volume:</strong> {childrenVolume}</p>
                            <p><strong>Avg Last 10 Days:</strong> {childrenAvg}</p>
                            <p><strong>Change:</strong> {Math.round(((childrenData[childrenData.length - 1]?.count || 0) - (childrenData[childrenData.length - 10]?.count || 0)) / (childrenData[childrenData.length - 10]?.count || 1) * 100)}%</p>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <ApexCharts
                                    options={barChartOptions(getLast10DaysData(childrenData))}
                                    series={[{ name: "Last 10 Days", data: getLast10DaysData(childrenData).map(item => item.count) }]}
                                    type="bar"
                                    height={100} 
                                    width={300} 
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default SparklineChart;
