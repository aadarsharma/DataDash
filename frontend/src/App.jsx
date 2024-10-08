// src/App.jsx
import TransactionTable from './components/TransactionTable';

const App = () => {
  return (
    <div className="bg-slate-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center pb-8">Transaction Dashboard</h1>
      <TransactionTable />
    </div>
  );
};

export default App;
