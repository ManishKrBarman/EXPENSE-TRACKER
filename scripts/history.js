const historyList = document.getElementById('history-list');
const filterBtn = document.getElementById('filter-btn');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');


const transactions = JSON.parse(localStorage.getItem('transactions')) || [];


// Function to sort and display transactions
function displayTransactions(filteredTransactions = null) {
    historyList.innerHTML = '';

    // Use the filtered list or the entire transaction list
    const transactionList = filteredTransactions || transactions;

    // Group transactions by date
    const groupedByDate = transactionList.reduce((acc, transaction) => {
        const date = transaction.date.split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(transaction);
        return acc;
    }, {});

    // Sort transactions within each date by time
    for (const date in groupedByDate) {
        groupedByDate[date].sort((b, a) => new Date(a.date) - new Date(b.date));
    }

    // Display each day's transactions
    Object.keys(groupedByDate).sort((b, a) => new Date(a) - new Date(b)).forEach(date => {
        const dayCard = document.createElement('div');
        dayCard.classList.add('card');
        dayCard.innerHTML = `<h3>${date.split('-').reverse().join('-')}</h3>`;

        groupedByDate[date].forEach(transaction => {
            const transactionItem = document.createElement('div');
            transactionItem.classList.add('transaction-item');
            if (transaction.amount < 0) {
                transactionItem.classList.add('negative');
            }
            transactionItem.innerHTML = `
            <strong>₹${Math.abs(transaction.amount)}</strong>
            <span>${transaction.date.split('T')[1]}</span>
            <span>${transaction.category}</span>
            ${transaction.amount > 0 ? '🟢' : '🔴'} ${transaction.description}
            `;
            dayCard.appendChild(transactionItem);
        });

        historyList.appendChild(dayCard);
    });
}


// Filter transactions between two dates
function filterTransactionsByDateRange() {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    if (!startDateInput.value || !endDateInput.value) {
        alert('Please select both start and end dates.');
        return;
    }

    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
    });

    displayTransactions(filteredTransactions);
}


// Event listener for search button
filterBtn.addEventListener('click', filterTransactionsByDateRange);


// Show toast message
function showToast(message, type = 'positive') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('positive', 'negative');
    if (type === 'negative') toast.classList.add('negative');

    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}


// Add a transaction (for demo purposes)
function addTransaction(amount, description) {
    const newTransaction = {
        amount: amount,
        description: description,
        date: new Date().toISOString() // Using the current date for the transaction
    };
    transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    displayTransactions();
    showToast(`₹${Math.abs(amount)} ${amount > 0 ? 'added' : 'deducted'} successfully`, amount > 0 ? 'positive' : 'negative');
}


// Initial display of transactions
displayTransactions();