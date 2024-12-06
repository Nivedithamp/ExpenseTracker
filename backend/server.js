const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Middleware 
app.use(express.json());

app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/users', userRoutes); // for user management
app.use('/api/expenses', expenseRoutes); // for expense management

const port = process.env.PORT || 5002;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
