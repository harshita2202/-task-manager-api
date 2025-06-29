const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS so frontend (e.g., Vercel) can call the backend
app.use(cors({
  origin: 'https://habit-tracker-one-ecru.vercel.app/', // replace with your actual Vercel URL
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
 
app.get('/api/test', (req, res) => {
  res.json({ message: "✅ API working fine!" });
});

// ✅ Use PORT from environment (Render assigns this automatically)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});