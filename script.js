// Get logged-in user
const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
if (!loggedInUser) {
  window.location.href = 'index.html';
}

let transactions = loggedInUser.transactions || [];

// DOM Elements
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const addBtn = document.getElementById('addBtn');
const transactionList = document.getElementById('transactionList');
const balanceDisplay = document.getElementById('balance');
const chartCanvas = document.getElementById('chart').getContext('2d');
const logoutBtn = document.getElementById('logoutBtn');
const exportBtn = document.getElementById('exportBtn');

// Initialize Chart
const chart = new Chart(chartCanvas, {
  type: 'pie',
  data: {
    labels: ['Income', 'Expense'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#2ecc71', '#e74c3c'],
    }],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
  },
});

// Update Chart
function updateChart() {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  chart.data.datasets[0].data = [income, expense];
  chart.update();
}

// Add Transaction
function addTransaction(e) {
  e.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = +amountInput.value;
  const type = typeInput.value;

  if (description === '' || isNaN(amount) || amount <= 0) {
    alert('Please enter valid details');
    return;
  }

  const transaction = {
    id: Date.now(),
    description,
    amount,
    type,
  };

  transactions.push(transaction);
  updateLocalStorage();
  renderTransactions();
  updateBalance();
  updateChart();

  descriptionInput.value = '';
  amountInput.value = '';
}

// Render Transactions
function renderTransactions() {
  transactionList.innerHTML = '';
  transactions.forEach((transaction) => {
    const li = document.createElement('li');
    li.classList.add(transaction.type);
    li.innerHTML = `
      <span>${transaction.description}</span>
      <span>$${transaction.amount.toFixed(2)}</span>
      <button onclick="deleteTransaction(${transaction.id})">X</button>
    `;
    transactionList.appendChild(li);
  });
}

// Delete Transaction
function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateLocalStorage();
  renderTransactions();
  updateBalance();
  updateChart();
}

// Update Balance
function updateBalance() {
  const balance = transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);
  balanceDisplay.textContent = `$${balance.toFixed(2)}`;
  balanceDisplay.style.color = balance >= 0 ? '#2ecc71' : '#e74c3c';
}

// Update Local Storage
function updateLocalStorage() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const updatedUsers = users.map((user) => {
    if (user.username === loggedInUser.username) {
      return { ...user, transactions };
    }
    return user;
  });
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  localStorage.setItem('loggedInUser', JSON.stringify({ ...loggedInUser, transactions }));
}

// Export Data as CSV
exportBtn.addEventListener('click', () => {
  const headers = ['Description', 'Amount', 'Type'];
  const rows = transactions.map((t) => [t.description, t.amount, t.type]);
  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.csv';
  a.click();
  URL.revokeObjectURL(url);
});

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'index.html';
});

// Initialize App
function init() {
  renderTransactions();
  updateBalance();
  updateChart();
}

// Event Listeners
addBtn.addEventListener('click', addTransaction);
init();