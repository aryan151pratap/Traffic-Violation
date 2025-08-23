const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const cors = require('cors');
const connectDB = require('./db.js');

const Backend = require('./routes/backend.js');
const Authentication = require('./routes/auth.js');
const Dashboard = require('./routes/dashboard.js');
const app = express();

connectDB();

app.use(cors({
  origin: ['http://localhost:5173','https://traffic-violation.onrender.com'],
  credentials: true,
}));

app.use(express.json());

app.use('/api', Backend);
app.use('/auth', Authentication);
app.use('/user', Dashboard);


app.get('/', (req, res) => {
	res.send('hello');
})

app.listen(3000);
