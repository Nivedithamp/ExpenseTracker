import { Routes, Route, Link } from 'react-router-dom';
import UserManagement from './pages/UserManagement.jsx';
import ExpenseManagement from './pages/ExpenseManagement.jsx';
import TotalCostByCategory from './pages/TotalCostByCategory.jsx';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <aside>
        <div className="logo">
          <span className="logo-expense">Expense</span>
          <span className="logo-trackr">Trackr</span>
        </div>
        <nav>
          <ul>
            <li><Link to="/">User Management</Link></li>
            <li><Link to="/expenses">Expense Management</Link></li>
            <li><Link to="/totals">Total Cost by Category</Link></li>
          </ul>
        </nav>
      </aside>
      <main>
        <Routes>
          <Route path="/" element={<UserManagement />} />
          <Route path="/expenses" element={<ExpenseManagement />} />
          <Route path="/totals" element={<TotalCostByCategory />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
