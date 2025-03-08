
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const birthInfoRoutes = require('./routes/birthInfo');
const deathInfoRoutes = require('./routes/deathInfo');
const userRoutes = require('./routes/user');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/birth-info', birthInfoRoutes);
app.use('/api/death-info', deathInfoRoutes);
app.use('/api/users', userRoutes);
//app.use('/api/birth-death-info', birthDeathRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
