import { getClients, getInvoices, saveInvoices } from './data.js';

const form = document.getElementById('invoice-form');
const invoiceTableBody = document.getElementById('invoice-table-body');
const cancelEditBtn = document.getElementById('cancel-edit');
const clientSelect = document.getElementById('invoice-client');
let editingInvoiceId = null;

// Populate client dropdown
function loadClientOptions() {
  const clients = getClients();
  clientSelect.innerHTML = '<option value="">Select Client</option>';
  clients.forEach(client => {
    const opt = document.createElement('option');
    opt.value = client.id;
    opt.textContent = client.name;
    clientSelect.appendChild(opt);
  });
}

// Render invoices
function renderInvoices() {
  const invoices = getInvoices();
  invoiceTableBody.innerHTML = '';

  if (invoices.length === 0) {
    invoiceTableBody.innerHTML = `<tr><td colspan="6" class="text-center">No invoices yet</td></tr>`;
    return;
  }

  invoices.forEach(inv => {
    const row = document.createElement('tr');
    const client = getClients().find(c => c.id === inv.clientId);

    row.innerHTML = `
      <td>${client ? client.name : 'Unknown Client'}</td>
      <td>${inv.title}</td>
      <td>$${inv.amount.toFixed(2)}</td>
      <td>${inv.date}</td>
      <td>
        <span class="badge ${inv.paid ? 'bg-success' : 'bg-warning'}">
          ${inv.paid ? 'Paid' : 'Unpaid'}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-success me-2" onclick="togglePaid(${inv.id})">
          ${inv.paid ? 'Mark Unpaid' : 'Mark Paid'}
        </button>
        <button class="btn btn-sm btn-warning me-2" onclick="editInvoice(${inv.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteInvoice(${inv.id})">Delete</button>
      </td>
    `;
    invoiceTableBody.appendChild(row);
  });
}

// Add / Update invoice
form.addEventListener('submit', e => {
  e.preventDefault();

  const clientId = parseInt(clientSelect.value);
  const title = document.getElementById('service-title').value.trim();
  const description = document.getElementById('service-description').value.trim();
  const amount = parseFloat(document.getElementById('invoice-amount').value);
  const date = document.getElementById('invoice-date').value;

  if (!clientId || !title || isNaN(amount) || !date) {
    alert('Please fill in all required fields.');
    return;
  }

  const invoices = getInvoices();

  if (editingInvoiceId) {
    const index = invoices.findIndex(inv => inv.id === editingInvoiceId);
    invoices[index] = { ...invoices[index], clientId, title, description, amount, date };
    editingInvoiceId = null;
    cancelEditBtn.style.display = 'none';
  } else {
    const id = Date.now();
    invoices.push({ id, clientId, title, description, amount, date, paid: false });
  }

  saveInvoices(invoices);
  form.reset();
  renderInvoices();
});

// Edit invoice
window.editInvoice = id => {
  const inv = getInvoices().find(i => i.id === id);
  if (!inv) return;

  document.getElementById('invoice-id').value = inv.id;
  clientSelect.value = inv.clientId;
  document.getElementById('service-title').value = inv.title;
  document.getElementById('service-description').value = inv.description;
  document.getElementById('invoice-amount').value = inv.amount;
  document.getElementById('invoice-date').value = inv.date;

  editingInvoiceId = inv.id;
  cancelEditBtn.style.display = 'inline-block';
};

// Cancel edit
cancelEditBtn.addEventListener('click', () => {
  editingInvoiceId = null;
  form.reset();
  cancelEditBtn.style.display = 'none';
});

// Delete invoice
window.deleteInvoice = id => {
  if (!confirm('Are you sure you want to delete this invoice?')) return;
  const invoices = getInvoices().filter(inv => inv.id !== id);
  saveInvoices(invoices);
  renderInvoices();
});

// Toggle paid/unpaid
window.togglePaid = id => {
  const invoices = getInvoices();
  const index = invoices.findIndex(inv => inv.id === id);
  if (index > -1) {
    invoices[index].paid = !invoices[index].paid;
    saveInvoices(invoices);
    renderInvoices();
  }
};

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  loadClientOptions();
  renderInvoices();
});