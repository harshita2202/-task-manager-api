const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');

// Enable CORS so frontend (e.g., Vercel) can call the backend
app.use(cors({
  origin: 'https://habit-tracker-one-ecru.vercel.app', // removed trailing slash
  credentials: true
}));
app.use(express.json()); // to parse JSON request bodies

// ✅ Root route for Render test
app.get('/', (req, res) => {
  res.send('✅ Backend is live and working on Render!');
});

// 🔧 Add your API routes below
// Example:
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working fine!' });
});

app.use('/api/auth', authRoutes);

console.log('Auth routes loaded:', typeof authRoutes);
console.log('Registered routes:');
app._router.stack.forEach(r => {
  if (r.route && r.route.path) {
    console.log(r.route.path, Object.keys(r.route.methods));
  }
});

// ✅ Use PORT from environment (Render assigns this automatically)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});