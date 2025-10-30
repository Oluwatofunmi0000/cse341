 const express = require('express');
const app = express();
const PORT = 8080;

// Fake data (this matches what frontend expects)
const data = {
  title: "My First API",
  description: "This data comes from the backend!",
  link: "https://example.com",
  image: "data:image/png;base64,iVBORw0K..." // this is just a sample base64 image string
};

// Create a GET endpoint
app.get('/api/data', (req, res) => {
  res.json(data);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
