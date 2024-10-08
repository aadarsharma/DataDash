import { useState, useEffect } from 'react';
import { fetchTransactions } from '../api';
import TransactionStatistics from './TransactionStatistics';
import BarChart from './BarChart';
import { months } from '../constants';

const TransactionTable = () => {
  const [selectedMonth, setSelectedMonth] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);  // Added loading state
  const [error, setError] = useState(null);      // Added error state

  useEffect(() => {
    loadTransactions();
  }, [selectedMonth, searchTerm, currentPage]);

  const loadTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTransactions(selectedMonth, searchTerm, currentPage);
      setTransactions(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      setError('Error fetching transactions.');
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md transition-colors duration-500">
      <div className="controls flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="month-select" className="font-semibold text-gray-800 dark:text-gray-300">Select Month:</label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300"
        />
      </div>

      {loading ? (
        <div className="text-center text-lg text-gray-800 dark:text-gray-300">Loading transactions...</div>
      ) : error ? (
        <div className="text-center text-red-600 dark:text-red-400">{error}</div>
      ) : (
        <>
          <TransactionStatistics selectedMonth={selectedMonth} />

          <table className="min-w-full table-auto border-collapse mb-6">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-left text-gray-800 dark:text-gray-300">
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Title</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Description</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Price</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Category</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Sold</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Date of Sale</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300">
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">{transaction.title}</td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">{transaction.description}</td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">{transaction.price}</td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">{transaction.category}</td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">{transaction.sold ? 'Yes' : 'No'}</td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-700">{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-3 text-center text-gray-800 dark:text-gray-300">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination flex justify-center items-center space-x-4 pb-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-500 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-800 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-500 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <BarChart selectedMonth={selectedMonth} />
        </>
      )}
    </div>
  );
};

export default TransactionTable;
