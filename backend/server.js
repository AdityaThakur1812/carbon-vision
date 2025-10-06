const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Test route
app.get('/', (req, res) => res.send('API Running'));

// 🔹 Safe route logger
if (app._router) {
  app._router.stack.forEach(r => {
    if (r.route && r.route.path) {
      console.log(`Route: ${r.route.path}`);
    } else if (r.name === 'router') {
      r.handle.stack.forEach(handler => {
        if (handler.route) {
          console.log(`Route: /api/users${handler.route.path}`);
        }
      });
    }
  });
}

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
