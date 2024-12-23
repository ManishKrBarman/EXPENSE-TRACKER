const monthElement = document.getElementById('month');
const currentDate = new Date();
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
monthElement.textContent = `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const dateTimeInput = document.getElementById('date-time');
const addDepositButton = document.getElementById('add-deposit');
const addWithdrawButton = document.getElementById('add-withdraw');
const balanceElement = document.getElementById('balance');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let warningAmount = 500;

function sanitizeInput(input) {
    const temp = document.createElement('div');
    temp.textContent = input;
    return temp.innerHTML;
}

function addTransaction(type) {
    const description = sanitizeInput(descriptionInput.value.trim());
    const amount = +amountInput.value;
    const dateTime = dateTimeInput.value;

    if (!description || isNaN(amount) || amount <= 0 || !dateTime) {
        alert('Please enter a valid description, amount, and date.');
        return;
    }
}


const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
}
const darkModeToggle = document.createElement('button');
// darkModeToggle.textContent = 'Dark Mode';
darkModeToggle.classList.add('btn');
darkModeToggle.style.marginBottom = '10px';
darkModeToggle.addEventListener('click', toggleDarkMode);
document.getElementById('head').append(darkModeToggle);

function addTransaction(type) {
    const description = descriptionInput.value.trim();
    const amount = +amountInput.value;
    const dateTime = dateTimeInput.value;

    if (!description || isNaN(amount) || amount <= 0 || !dateTime) {
        alert('Please enter a valid description, amount, and date.');
        return;
    }

    const transaction = {
        id: generateID(),
        description,
        amount: type === 'deposit' ? amount : -amount,
        date: dateTime,
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

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateBalance() {
    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0).toFixed(2);
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

addDepositButton.addEventListener('click', () => addTransaction('deposit'));
addWithdrawButton.addEventListener('click', () => addTransaction('withdraw'));

updateBalance();
