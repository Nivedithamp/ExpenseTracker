import { Routes, Route, Link } from 'react-router-dom'
import UserManagement from './pages/UserManagement.jsx'
import ExpenseManagement from './pages/ExpenseManagement.jsx'
import TotalCostByCategory from './pages/TotalCostByCategory.jsx'

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '200px', borderRight: '1px solid #ccc', padding: '1rem' }}>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/">User Management</Link></li>
            <li><Link to="/expenses">Expense Management</Link></li>
            <li><Link to="/totals">Total Cost by Category</Link></li>
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<UserManagement />} />
          <Route path="/expenses" element={<ExpenseManagement />} />
          <Route path="/totals" element={<TotalCostByCategory />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
