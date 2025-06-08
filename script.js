
const loader = document.getElementById('loader');
const dataContainer = document.getElementById('data-container');
const searchInput = document.getElementById('searchInput');
const pagination = document.getElementById('pagination');

const API_URL = 'https://jsonplaceholder.typicode.com/users';
let users = [];
let currentPage = 1;
const usersPerPage = 3;

// Завантажити дані
async function fetchData() {
    loader.classList.remove('hidden');
    try {
        const cached = localStorage.getItem('users');
        if (cached) {
            users = JSON.parse(cached);
        } else {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Помилка при завантаженні даних');
            users = await response.json();
            localStorage.setItem('users', JSON.stringify(users));
        }
        displayUsers(users);
    } catch (error) {
        dataContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
    } finally {
        loader.classList.add('hidden');
    }
}

function displayUsers(data) {
    const filtered = data.filter(user =>
        user.name.toLowerCase().includes(searchInput.value.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / usersPerPage);
    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const currentUsers = filtered.slice(start, end);

    dataContainer.innerHTML = currentUsers.map(user =>
        `<div class="user"><strong>${user.name}</strong><br>${user.email}</div>`
    ).join('');

    pagination.innerHTML = Array.from({length: totalPages}, (_, i) =>
        `<button onclick="goToPage(${i + 1})">${i + 1}</button>`
    ).join(' ');
}

function goToPage(page) {
    currentPage = page;
    displayUsers(users);
}

searchInput.addEventListener('input', () => displayUsers(users));

fetchData();
