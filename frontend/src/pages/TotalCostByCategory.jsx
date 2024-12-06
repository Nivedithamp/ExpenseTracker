import { useEffect, useState } from 'react'
import axios from 'axios'
import './TotalCostByCategory.css';

function TotalCostByCategory() {
  const [totals, setTotals] = useState([])

  const fetchTotals = async () => {
    const res = await axios.get('http://localhost:5002/api/expenses/totals')
    setTotals(res.data)
  }

  useEffect(() => {
    fetchTotals()
  }, [])

  return (
    <div className="total-cost-category">
      <h2>Total Cost by Category</h2>
      <table className="total-cost-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {totals.map(t => (
            <tr key={t._id}>
              <td>{t._id}</td>
              <td>{t.totalCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TotalCostByCategory