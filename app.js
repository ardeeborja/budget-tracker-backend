const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const port = process.env.PORT || 8000;
const app = express();
require('dotenv').config();

// database connection
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// check connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log(`Connected to database`);
});

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200,
// };

const corsOptions = {
  origin: 'https://budget-tracker-sandy-five.vercel.app',
  optionsSuccessStatus: 200,
};

// middlewares
app.use(express.json());

app.use(cors());
app.use(cors(corsOptions));
// app.options('*', cors());

// routes
const categoryRoutes = require('./routes/category');
app.use('/api/category', categoryRoutes);

const transactionRoutes = require('./routes/transaction');
app.use('/api/transaction', transactionRoutes);

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

// app.get('/', (req,res) => res.send('Hello Budget Tracker'));

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
