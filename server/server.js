require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { User, Loan, Transaction, Query } = require('./userSchema');
const OTP = require('./userOtp');
const nodemailer = require('nodemailer');

const app = express(); 

app.use(cors());
app.use(express.json()); 

// ✅ Root route added for Render testing
app.get('/', (req, res) => {
  res.send('✅ Maa Mahamaya Finance backend is running!');
});

  
// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB database');

  // Check if admin user exists, if not create it
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  try {
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminUser = new User({
        name: 'Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        address: 'N/A',
        pincode: 'N/A',
        mobileNumber: 'N/A',
      });
      await adminUser.save();
      console.log('Admin user created with fixed credentials');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Middleware for role-based authorization
const authorize = (roles) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin' && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Nodemailer transporter setup (configure with your email service credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Function to send OTP email
async function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Maa Mahamaya Finance Registration',
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Nodemailer sendMail error:', error);
    throw error;
  }
}

// Endpoint to request OTP
app.post('/api/auth/request-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered. Please login or use a different email.' });
    }

    // Check if OTP already sent and not expired
    const existingOtp = await OTP.findOne({ email });
    if (existingOtp && existingOtp.expiresAt > new Date()) {
      return res.status(400).json({ message: 'OTP already sent. Please check your email.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this email
    await OTP.deleteOne({ email });

    // Store new OTP with expiration (10 minutes)
    const otpDoc = new OTP({ email, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
    await otpDoc.save();

    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

  try {
    const record = await OTP.findOne({ email });
    if (!record) return res.status(400).json({ message: 'OTP not found or expired' });

    if (record.expiresAt < new Date()) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    // Do not delete OTP here; keep it until registration completes
    // await OTP.deleteOne({ email });

    res.json({ message: 'OTP verified' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role, address, pincode, mobileNumber, otp } = req.body;
  console.log('Register API received data:', { name, email, password, role, address, pincode, mobileNumber, otp });

  // Disallow registration with role 'admin'
  if (role === 'admin') {
    return res.status(403).json({ message: 'Registration as admin is not allowed' });
  }

  // Validate that all required fields are present
  if (!name || !email || !password || !role || !address || !pincode || !mobileNumber || !otp) {
    return res.status(400).json({ message: 'All fields including OTP are required' });
  }

  try {
    const record = await OTP.findOne({ email });
    if (!record) return res.status(400).json({ message: 'OTP not found or expired' });
    if (record.expiresAt < new Date()) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: 'OTP expired' });
    }
    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    await OTP.deleteOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role, address, pincode, mobileNumber });
    const savedUser = await user.save();
    console.log('User saved in DB:', savedUser.toObject()); // Use toObject() to log plain JS object
    const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        address: savedUser.address,
        pincode: savedUser.pincode,
        mobileNumber: savedUser.mobileNumber
      }
    });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(400).json({ message: 'Error registering user', error: error.message });
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

app.get('/api/loans/pending', authorize(['employee']), async (req, res) => {
  try {
    const loans = await Loan.find({ status: 'pending' }).populate('userId', 'name email role');
    res.json(loans);
  } catch (error) {
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
    res.json(users);
  } catch (error) {
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
    res.status(500).json({ message: 'Error updating loan status', error });
  }
});

// ✅ Server start (Render-compatible)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
