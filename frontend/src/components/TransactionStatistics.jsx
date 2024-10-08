import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchStatistics } from '../api';
import { months } from '../constants';

const TransactionStatistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({
    totalAmount: 0.0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStatistics = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchStatistics(selectedMonth);
        setStatistics({
          totalAmount: data.totalSaleAmount || 0,
          totalSoldItems: data.soldItems || 0,
          totalNotSoldItems: data.notSoldItems || 0,
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError('Error fetching statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [selectedMonth]);

  const monthName = months.find(month => month.value === selectedMonth)?.label || 'Unknown';

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return <div className="text-center text-lg text-gray-800 dark:text-gray-300 animate-pulse">Loading statistics...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="bg-green-200 dark:bg-green-800 border-dotted border-4 border-green-500 dark:border-slate-50 rounded-lg p-6 mb-4 max-w-xl mx-auto transition-colors duration-500">
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-300 transition-colors duration-500">
        Statistics for {monthName}
      </h2>
      <div className="statistic-item text-lg mb-2 text-gray-800 dark:text-gray-300 transition-colors duration-500">
        <strong>Total Amount of Sales:</strong> {formatCurrency(statistics.totalAmount)}
      </div>
      <div className="statistic-item text-lg mb-2 text-gray-800 dark:text-gray-300 transition-colors duration-500">
        <strong>Total Sold Items:</strong> {statistics.totalSoldItems}
      </div>
      <div className="statistic-item text-lg text-gray-800 dark:text-gray-300 transition-colors duration-500">
        <strong>Total Not Sold Items:</strong> {statistics.totalNotSoldItems}
      </div>
    </div>
  );
};

TransactionStatistics.propTypes = {
  selectedMonth: PropTypes.number.isRequired,
};

export default TransactionStatistics;
