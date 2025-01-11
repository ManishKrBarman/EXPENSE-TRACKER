const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const port = 3000;
const app = express();


// Middleware
app.use(express.static(path.join(__dirname)));  // Serve static files from the Angular app [maintains the styles and scripts]
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies


// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/history', (req, res) => {
    res.sendFile(path.join(__dirname, 'history.html'));
});


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/expenser');
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

    await transaction.save();
    console.log('Transaction Saved:', transaction);
    res.sendStatus(200);
});



// Server listening
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});