require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { User, Loan, Transaction, Query } = require('./userSchema');



const app = express(); 

app.use(cors());
app.use(express.json()); 

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB database');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});



// Middleware for role-based authorization
const authorize = (roles) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Authorize middleware decoded token:', decoded);
    console.log('Required roles:', roles);
    console.log('Decoded role type:', typeof decoded.role);
    console.log('Roles array:', roles);
    if (decoded.role !== 'admin' && !roles.includes(decoded.role)) {
      console.log('Authorization failed for role:', decoded.role);
      return res.status(403).json({ message: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Authorization error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: 'Error registering user', error });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

// Loan Routes
app.post('/api/loans/apply', authorize(['customer', 'business']), async (req, res) => {
  const { userId, amount, purpose } = req.body;
  try {
    const loan = new Loan({ userId, amount, purpose, status: 'pending' });
    await loan.save();
    res.status(201).json({ message: 'Loan application submitted' });
  } catch (error) {
    res.status(400).json({ message: 'Error submitting application', error });
  }
});

app.get('/api/loans/user/:userId', authorize(['customer', 'business', 'employee', 'admin']), async (req, res) => {
  const { userId } = req.params;
  try {
    const loans = await Loan.find({ userId });
    res.json(loans);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching loans', error });
  }
});

app.get('/api/loans', authorize(['admin']), async (req, res) => {
  try {
    const loans = await Loan.find().populate('userId', 'name email role');
    res.json(loans);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching loans', error });
  }
});

// New endpoint for employees to get pending loans with user details
app.get('/api/loans/pending', authorize(['employee']), async (req, res) => {
  try {
    const loans = await Loan.find({ status: 'pending' }).populate('userId', 'name email role');
    console.log('Pending loans fetched:', loans);
    res.json(loans);
  } catch (error) {
    console.error('Error fetching pending loans:', error);
    res.status(400).json({ message: 'Error fetching pending loans', error });
  }
});

// Transaction Routes
app.get('/api/transactions/user/:userId', authorize(['customer', 'business', 'admin']), async (req, res) => {
  const { userId } = req.params;
  try {
    const transactions = await Transaction.find({ userId });
    res.json(transactions);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching transactions', error });
  }
});

app.get('/api/transactions', authorize(['admin']), async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('userId', 'name email role');
    res.json(transactions);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching transactions', error });
  }
});

// Query Routes
app.post('/api/queries', authorize(['customer', 'business']), async (req, res) => {
  const { userId, query } = req.body;
  try {
    const newQuery = new Query({ userId, query });
    await newQuery.save();
    res.status(201).json({ message: 'Query submitted' });
  } catch (error) {
    res.status(400).json({ message: 'Error submitting query', error });
  }
});

app.get('/api/queries', authorize(['employee', 'admin']), async (req, res) => {
  try {
    const queries = await Query.find().populate('userId', 'name email');
    res.json(queries);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching queries', error });
  }
});

app.post('/api/queries/respond/:queryId', authorize(['employee', 'admin']), async (req, res) => {
  const { queryId } = req.params;
  const { response } = req.body;
  try {
    await Query.findByIdAndUpdate(queryId, { response });
    res.json({ message: 'Response submitted' });
  } catch (error) {
    res.status(400).json({ message: 'Error submitting response', error });
  }
});

// Admin Routes
app.get('/api/users', authorize(['admin']), async (req, res) => {
  try {
    const users = await User.find();
    console.log('Users fetched from DB:', users.length);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(400).json({ message: 'Error fetching users', error });
  }
}); 

app.post('/api/loans/:loanId/decision', authorize(['admin', 'employee']), async (req, res) => {
  const { loanId } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    loan.status = status;
    await loan.save();

    res.json({ message: `Loan ${status} successfully` });
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({ message: 'Error updating loan status', error });
  }
});



app.listen(5000, () => console.log('Server running on port 5000'));
