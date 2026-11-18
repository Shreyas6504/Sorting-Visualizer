/**
 * Sorting Visualizer - Node.js / Express Static Server
 * Author: Shreyas Shetty (@Shreyas6504)
 */
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', app: 'Sorting Visualizer Engine', author: 'Shreyas' });
});

app.listen(PORT, () => {
  console.log(`✓ Sorting Visualizer server running at http://localhost:${PORT}`);
});
