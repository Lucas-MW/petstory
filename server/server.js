require ('dotenv').config ();
const express = require ('express');
const cors = require ('cors');
const mongoose = require ('mongoose');

const app = express ();
const PORT = process.env.PORT || 3000;

//middleware
app.use (cors ());
app.use (express.json ());

//connect to MongoDB
mongoose.connect (process.env.MONGODB_URI || 'mongodb://localhost:27017/petstory')
  .then (() => console.log ('MongoDB connected'))
  .catch (err => console.log ('MongoDB connection error',err));

//test routes
app.get ('/', (req, res) => {
  res.json ({message:'PetStory server is running'});
});


//import routes
const customersRoutes = require ('./routes/customers');
app.use ('/api/customers', customersRoutes);

const historyRoutes = require('./routes/history');
app.use('/api/history', historyRoutes);

const checkInRoutes = require('./routes/checkin');
app.use('/api/checkin', checkInRoutes);

const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

const reportsRoutes = require('./routes/reports');
app.use('/api/reports', reportsRoutes);

//start server
app.listen (PORT, () => {
  console.log (`Server is running on port ${PORT}`);
});