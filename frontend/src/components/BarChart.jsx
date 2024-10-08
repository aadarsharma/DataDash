import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { fetchBarChartData } from '../api'; // Ensure this API function is correct
import { months } from '../constants'; // Ensure constants are correct
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ selectedMonth }) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);  
    const [error, setError] = useState(null);      

    // Define the price ranges
    const priceRanges = [
        '0-100',
        '101-200',
        '201-300',
        '301-400',
        '401-500',
        '501-600',
        '601-700',
        '701-800',
        '801-900',
        '901+'
    ];

    // This function will categorize price into the appropriate bucket
    const categorizePrice = (price) => {
        if (price <= 100) return 0;
        else if (price <= 200) return 1;
        else if (price <= 300) return 2;
        else if (price <= 400) return 3;
        else if (price <= 500) return 4;
        else if (price <= 600) return 5;
        else if (price <= 700) return 6;
        else if (price <= 800) return 7;
        else if (price <= 900) return 8;
        else return 9; // 901+ bucket
    };

    useEffect(() => {
        if (selectedMonth !== null) {
            setLoading(true);
            setError(null);

            const loadChartData = async () => {
                try {
                    const data = await fetchBarChartData(selectedMonth);

                    if (Array.isArray(data) && data.length > 0) {
                        // Initialize the counts for each price range
                        const counts = new Array(priceRanges.length).fill(0);

                        // Process the data and map it to the appropriate price range bucket
                        data.forEach(item => {
                            const price = parseInt(item.priceRange, 10);  // Assuming item.priceRange is a numeric value
                            const count = item.count || 0;
                            const bucketIndex = categorizePrice(price);  // Find the correct price bucket
                            counts[bucketIndex] += count;  // Increment the correct bucket
                        });

                        setChartData({
                            labels: priceRanges,
                            datasets: [
                                {
                                    label: 'Number of Items',
                                    data: counts,
                                    backgroundColor: 'rgba(76, 175, 80, 0.6)',
                                    borderColor: 'rgba(76, 175, 80, 1)',
                                    borderWidth: 1,
                                },
                            ],
                        });
                    } else {
                        setError('No data available for this month.');
                        setChartData(null);
                    }
                } catch (error) {
                    console.error('Error fetching bar chart data:', error);
                    setError('Error fetching bar chart data.');
                } finally {
                    setLoading(false);
                }
            };

            loadChartData();
        }
    }, [selectedMonth]);

    const monthName = months.find(month => month.value === selectedMonth)?.label || 'Unknown';
    const isDarkMode = document.documentElement.classList.contains('dark');

    if (loading) {
        return <div className="text-center text-lg animate-pulse text-gray-800 dark:text-gray-300">Loading chart data...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    if (!chartData) {
        return <div className="text-center text-gray-800 dark:text-gray-300">No chart data available.</div>;
    }

    return (
        <div className="chart-container p-6 max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-500">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-gray-300 transition-colors duration-500">
                Bar Chart Stats - {monthName}
            </h2>
            <div className="bar-chart-wrapper relative h-[400px] w-full">
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true, // Start from zero
                                title: {
                                    display: true,
                                    text: 'Number of Items',
                                    color: isDarkMode ? '#F3F4F6' : '#1F2937',
                                    font: {
                                        size: 16,
                                        weight: 'bold',
                                    },
                                },
                                ticks: {
                                    color: isDarkMode ? '#F3F4F6' : '#1F2937',
                                },
                                grid: {
                                    color: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : '#E5E7EB',
                                    borderDash: [5, 5],
                                },
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Price Range',
                                    color: isDarkMode ? '#F3F4F6' : '#1F2937',
                                    font: {
                                        size: 16,
                                        weight: 'bold',
                                    },
                                },
                                ticks: {
                                    color: isDarkMode ? '#F3F4F6' : '#1F2937',
                                    autoSkip: false, // Prevent skipping labels
                                    maxRotation: 0,
                                    minRotation: 0,
                                },
                                grid: {
                                    color: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : '#E5E7EB',
                                },
                            },
                        },
                        plugins: {
                            tooltip: {
                                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                                titleColor: isDarkMode ? 'white' : 'black',
                                bodyColor: isDarkMode ? 'white' : 'black',
                                callbacks: {
                                    label: (context) => `${context.dataset.label}: ${context.raw}`,
                                },
                            },
                            legend: {
                                labels: {
                                    color: isDarkMode ? '#F3F4F6' : '#1F2937',
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

BarChart.propTypes = {
    selectedMonth: PropTypes.number.isRequired,
};

export default BarChart;
