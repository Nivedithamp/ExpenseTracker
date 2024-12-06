import { useEffect, useState } from 'react';
import axios from 'axios';
import './TotalCostByCategory.css';

function TotalCostByCategory() {
  // State to store total costs by category
  const [totals, setTotals] = useState([]);

  // Fetch totals for each category from the backend
  const fetchTotals = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/expenses/totals');
      setTotals(res.data); // Update state with fetched totals
    } catch (error) {
      console.error('Error fetching total costs:', error);
    }
  };

  // Fetch totals when the component mounts
  useEffect(() => {
    fetchTotals();
  }, []);

  return (
    <div className="total-cost-category">
      {/* Page Heading */}
      <h2>Total Cost by Category</h2>

      {/* Table to display total costs by category */}
      <table className="total-cost-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {totals.map((t) => (
            <tr key={t._id}>
              <td>{t._id}</td> {/* Category Name */}
              <td>{t.totalCost}</td> {/* Total Cost */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TotalCostByCategory;
