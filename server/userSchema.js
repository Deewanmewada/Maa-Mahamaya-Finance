const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountType: { type: String, enum: ['customer', 'business', 'employee', 'admin'], required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  businessCategory: { type: String }, // Added business category field
  employeeRole: { type: String }, // Added employee role field
  createdAt: { type: Date, default: Date.now },
});

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  purpose: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['payment', 'deposit'], required: true },
  createdAt: { type: Date, default: Date.now },
});

const querySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  query: { type: String, required: true },
  response: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Loan: mongoose.model('Loan', loanSchema),
  Transaction: mongoose.model('Transaction', transactionSchema),
  Query: mongoose.model('Query', querySchema),
};
