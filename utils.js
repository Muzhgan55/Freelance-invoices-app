// utils.js

// Generate unique ID
export function generateId() {
  return Date.now();
}

// Formatting currency
export function formatCurrency(num) {
  return '$' + num.toFixed(2);
}

// Calculations
export function countTotalClients(clients) {
  return clients.length;
}

export function countTotalInvoices(invoices) {
  return invoices.length;
}

export function calculateTotalRevenue(invoices) {
  return invoices
    .filter(inv => inv.paid)
    .reduce((sum, inv) => sum + inv.amount, 0);
}

export function countPaidInvoices(invoices) {
  return invoices.filter(inv => inv.paid).length;
}

export function countUnpaidInvoices(invoices) {
  return invoices.filter(inv => !inv.paid).length;
}

// Form validation helpers
export function validateClientName(name) {
  return name.trim().length > 0;
}

export function validateInvoice(amount, clientId) {
  return amount > 0 && clientId !== '';
}