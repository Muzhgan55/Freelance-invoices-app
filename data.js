// data.js

const CLIENTS_KEY = 'clients';
const INVOICES_KEY = 'invoices';

// Load from localStorage or initialize empty arrays
export function loadClients() {
  const raw = localStorage.getItem(CLIENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveClients(clients) {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function loadInvoices() {
  const raw = localStorage.getItem(INVOICES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveInvoices(invoices) {
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}