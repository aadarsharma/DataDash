import TransactionTable from './components/TransactionTable';
import { useEffect, useState } from 'react';

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="bg-slate-100 min-h-screen dark:bg-gray-900 p-8 transition-colors duration-500">
      {/* Relative container for positioning the theme toggle */}
      <div className="relative mb-8">
        {/* Centering the heading */}
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-300 transition-colors duration-500">
          Transaction Dashboard
        </h1>
        
        {/* Theme Toggle positioned to the right */}
        <div
          onClick={toggleTheme}
          className={`${
            theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
          } absolute right-0 top-1/2 transform -translate-y-1/2 inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-500`}
        >
          <span
            className={`${
              theme === 'dark' ? 'translate-x-6 bg-yellow-400' : 'translate-x-1 bg-gray-800'
            } inline-block w-4 h-4 transform rounded-full transition-transform duration-300`}
          ></span>
        </div>
      </div>

      <TransactionTable />
    </div>
  );
};

export default App;
