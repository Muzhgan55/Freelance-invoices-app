// main.js
import {
  loadClients,
  saveClients,
  loadInvoices,
  saveInvoices
} from './data.js';

import {
  generateId,
  validateClientName,
  validateInvoice
} from './utils.js';

import {
  renderDashboard,
  renderClientOptions
} from './render.js';

let clients = loadClients();
let invoices = loadInvoices();

// Render dashboard and client options on page load
function initialize() {
  renderDashboard(clients, invoices);
  renderClientOptions(clients);
  loadRandomQuote();
}

// Add Client Form Handler
const clientForm = document.getElementById('clientForm');
clientForm.addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('clientName');
  const name = input.value.trim();

  if (!validateClientName(name)) {
    input.classList.add('is-invalid');
    return;
  }
  input.classList.remove('is-invalid');

  // Check duplicate names (case-insensitive)
  const exists = clients.some(c => c.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    alert('Client name already exists.');
    return;
  }

  const newClient = { id: generateId(), name };
  clients.push(newClient);
  saveClients(clients);

  renderDashboard(clients, invoices);
  renderClientOptions(clients);

  clientForm.reset();
});

// Add Invoice Form Handler
const invoiceForm = document.getElementById('invoiceForm');
invoiceForm.addEventListener('submit', e => {
  e.preventDefault();

  const clientId = document.getElementById('invoiceClient').value;
  const amountStr = document.getElementById('invoiceAmount').value;
  const amount = parseFloat(amountStr);
  const paid = document.getElementById('invoicePaid').checked;

  if (!validateInvoice(amount, clientId)) {
    if (!clientId) document.getElementById('invoiceClient').classList.add('is-invalid');
    else document.getElementById('invoiceClient').classList.remove('is-invalid');

    if (!(amount > 0)) document.getElementById('invoiceAmount').classList.add('is-invalid');
    else document.getElementById('invoiceAmount').classList.remove('is-invalid');

    return;
  }

  document.getElementById('invoiceClient').classList.remove('is-invalid');
  document.getElementById('invoiceAmount').classList.remove('is-invalid');

  const newInvoice = {
    id: generateId(),
    clientId: parseInt(clientId),
    amount,
    paid
  };

  invoices.push(newInvoice);
  saveInvoices(invoices);

  renderDashboard(clients, invoices);

  invoiceForm.reset();
});

// Load random motivational quote
async function loadRandomQuote() {
  try {
    const res = await fetch('/data/quotes.json');
    if (!res.ok) throw new Error('Failed to fetch quotes');
    const quotes = await res.json();
    if (!Array.isArray(quotes) || quotes.length === 0) throw new Error('Invalid quotes data');

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    document.getElementById('quoteText').textContent = `"${randomQuote.text || 'No quote available.'}"`;
    document.getElementById('quoteAuthor').textContent = `— ${randomQuote.author || 'Unknown'}`;

  } catch (err) {
    console.error(err);
    document.getElementById('quoteText').textContent = 'Failed to load quote.';
    document.getElementById('quoteAuthor').textContent = '';
  }
}

window.addEventListener('DOMContentLoaded', initialize);