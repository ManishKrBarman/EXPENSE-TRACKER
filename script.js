const monthElement = document.getElementById('month');
const balanceElement = document.getElementById('balance');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const dateTimeInput = document.getElementById('date-time');
const categorySelect = document.getElementById('category');
const addDepositButton = document.getElementById('add-deposit');
const addWithdrawButton = document.getElementById('add-withdraw');


const currentDate = new Date();
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
monthElement.textContent = `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;


let transactions = JSON.parse(localStorage.getItem('transactions')) || [];  // Get transactions from local storage
let warningAmount = 500;  // Warning amount for low balance


addDepositButton.addEventListener('click', () => addTransaction('deposit'));
addWithdrawButton.addEventListener('click', () => addTransaction('withdraw'));


// Add transaction function
function addTransaction(type) {
    const description = descriptionInput.value.trim();
    const amount = +amountInput.value;
    const dateTime = dateTimeInput.value;
    const category = categorySelect.value;


    if (!description) {
        alert('Please enter a valid description.');
        return;
    } else if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    } else if (!dateTime) {
        alert('Please enter a valid date and time.');
        return;
    }


    // Create transaction object
    const transaction = {
        id: generateID(),
        description,
        amount: type === 'deposit' ? amount : -amount,
        date: dateTime,
        category,
        editCount: 0
    };

    transactions.push(transaction);
    updateLocalStorage();
    updateBalance();


    // Show toast for deposit or withdraw
    const toastMessage = `₹${Math.abs(amount)} ${type === 'deposit' ? 'added' : 'deducted'} successfully`;
    showToast(toastMessage, type === 'deposit' ? 'positive' : 'negative');

    descriptionInput.value = '';
    amountInput.value = '';
    dateTimeInput.value = '';
}


// Generate unique ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}


// Update balance function
function updateBalance() {
    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0).toFixed(2); // Calculate total balance with [reduce] method
    balanceElement.textContent = `Current Balance: ₹${balance}`;
    balanceElement.style.backgroundColor = balance < warningAmount ? '#dc3545' : '#28a745';
}

// Show toast message
function showToast(message, type = 'positive') {
    let toast = document.getElementById('toast');

    // Create toast dynamically if it doesn't exist
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = ''; // Clear previous classes
    toast.classList.add(type === 'negative' ? 'negative' : 'positive');
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}


// Update local storage function
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}


updateBalance();

// Dark Mode
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
}
const darkModeToggle = document.createElement('button');
// darkModeToggle.textContent = 'Dark Mode';
darkModeToggle.classList.add('btn');
darkModeToggle.style.marginBottom = '10px';
darkModeToggle.addEventListener('click', toggleDarkMode);
document.getElementById('head').append(darkModeToggle);