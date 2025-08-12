import { getClients, saveClients } from './data.js';

const form = document.getElementById('client-form');
const clientTableBody = document.getElementById('client-table-body');
const cancelEditBtn = document.getElementById('cancel-edit');
let editingClientId = null;

// Render client list
function renderClients() {
  const clients = getClients();
  clientTableBody.innerHTML = '';

  if (clients.length === 0) {
    clientTableBody.innerHTML = `<tr><td colspan="5" class="text-center">No clients yet</td></tr>`;
    return;
  }

  clients.forEach(client => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${client.name}</td>
      <td>${client.email}</td>
      <td>${client.company}</td>
      <td>${client.notes || ''}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editClient(${client.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteClient(${client.id})">Delete</button>
      </td>
    `;
    clientTableBody.appendChild(row);
  });
}

// Add / Update client
form.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('client-name').value.trim();
  const email = document.getElementById('client-email').value.trim();
  const company = document.getElementById('client-company').value.trim();
  const notes = document.getElementById('client-notes').value.trim();

  if (!name || !email || !company) {
    alert('Please fill in all required fields.');
    return;
  }

  const clients = getClients();

  if (editingClientId) {
    const index = clients.findIndex(c => c.id === editingClientId);
    clients[index] = { id: editingClientId, name, email, company, notes };
    editingClientId = null;
    cancelEditBtn.style.display = 'none';
  } else {
    const id = Date.now();
    clients.push({ id, name, email, company, notes });
  }

  saveClients(clients);
  form.reset();
  renderClients();
});

// Edit client
window.editClient = id => {
  const client = getClients().find(c => c.id === id);
  if (!client) return;

  document.getElementById('client-id').value = client.id;
  document.getElementById('client-name').value = client.name;
  document.getElementById('client-email').value = client.email;
  document.getElementById('client-company').value = client.company;
  document.getElementById('client-notes').value = client.notes;

  editingClientId = client.id;
  cancelEditBtn.style.display = 'inline-block';
};

// Cancel edit
cancelEditBtn.addEventListener('click', () => {
  editingClientId = null;
  form.reset();
  cancelEditBtn.style.display = 'none';
});

// Delete client
window.deleteClient = id => {
  if (!confirm('Are you sure you want to delete this client?')) return;

  const clients = getClients().filter(c => c.id !== id);
  saveClients(clients);
  renderClients();
};

// Initial render
document.addEventListener('DOMContentLoaded', renderClients);