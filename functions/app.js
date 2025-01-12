require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const serverless = require('serverless-http');

const port = process.env.PORT || 3000;
const app = express();
const router = express.Router();


router.get("/", (req, res) => {
    res.send("App is running..");
});

app.use("/.netlify/functions/app", router);
module.exports.handler = serverless(app);


// Middleware
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from the Angular app [maintains the styles and scripts]
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
})

const Transaction = new mongoose.Schema({
    description: String,
    amount: Number,
    date: Date,
    category: String,
    editCount: Number
});

const TransactionModel = mongoose.model('Transaction', Transaction);


// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/history', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/history.html'));
});

app.post('/add-transaction', async (req, res) => {
    const { description, amount, date, category, transactionType } = req.body;

    // Store amount as negative for withdrawals
    const adjustedAmount = transactionType === 'Withdraw' ? -Math.abs(amount) : Math.abs(amount);

    const transaction = new TransactionModel({
        description,
        amount: adjustedAmount,
        date,
        category,
        editCount: 0,
    });

    try {
        await transaction.save();
        res.status(200).json({ message: 'Transaction added successfully!' });
    } catch (error) {
        console.error('Error saving transaction:', error);
        res.status(404).json({ message: 'Internal server error.' });
    }
});


// Server listening
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});