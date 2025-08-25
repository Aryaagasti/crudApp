const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const cors = require('cors'); // Add this line

app.use(express.json());
app.use(cors()); // Add this line to enable CORS for all routes
app.use('/api', userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));