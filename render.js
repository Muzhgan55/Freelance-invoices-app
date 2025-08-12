// render.js
import {
  countTotalClients,
  countTotalInvoices,
  calculateTotalRevenue,
  countPaidInvoices,
  countUnpaidInvoices,
  formatCurrency
} from './utils.js';

// Render dashboard stats
export function renderDashboard(clients, invoices) {
  document.getElementById('totalClients').textContent = countTotalClients(clients);
  document.getElementById('totalInvoices').textContent = countTotalInvoices(invoices);
  document.getElementById('totalRevenue').textContent = formatCurrency(calculateTotalRevenue(invoices));
  document.getElementById('paidCount').textContent = `Paid: ${countPaidInvoices(invoices)}`;
  document.getElementById('unpaidCount').textContent = `Unpaid: ${countUnpaidInvoices(invoices)}`;
}

// Populate client select dropdown in invoice form
export function renderClientOptions(clients) {
  const select = document.getElementById('invoiceClient');
  select.innerHTML = '<option value="">Select client</option>';
  clients.forEach(client => {
    const option = document.createElement('option');
    option.value = client.id;
    option.textContent = client.name;
    select.appendChild(option);
  });
}