// src/components/TransactionTable.jsx
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

  useEffect(() => {
    loadTransactions();
  }, [selectedMonth, searchTerm, currentPage]);

  const loadTransactions = async () => {
    try {
      const data = await fetchTransactions(selectedMonth, searchTerm, currentPage);
      setTransactions(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching transactions:', error);
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
    <div className="p-8 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      <div className="controls flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="month-select" className="font-semibold">Select Month:</label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="p-2 border border-gray-300 rounded-md"
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
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>

      <TransactionStatistics selectedMonth={selectedMonth} />

      <table className="min-w-full table-auto border-collapse mb-6">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">Title</th>
            <th className="p-3 border-b">Description</th>
            <th className="p-3 border-b">Price</th>
            <th className="p-3 border-b">Category</th>
            <th className="p-3 border-b">Sold</th>
            <th className="p-3 border-b">Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border-b">{transaction.title}</td>
                <td className="p-3 border-b">{transaction.description}</td>
                <td className="p-3 border-b">{transaction.price}</td>
                <td className="p-3 border-b">{transaction.category}</td>
                <td className="p-3 border-b">{transaction.sold ? 'Yes' : 'No'}</td>
                <td className="p-3 border-b">{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-3 text-center">No transactions found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination flex justify-center items-center space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      <BarChart selectedMonth={selectedMonth} />
    </div>
  );
};

export default TransactionTable;
