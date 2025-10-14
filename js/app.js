/**
 * Taller 6 Frontend - Single File Application
 * All JavaScript code consolidated in one file
 */

/**
 * Configuration 
 */
const CONFIG = {
    // Backend URL (change for production)
    API_BASE_URL: 'https://areptaler6.duckdns.org:8443',

    // API Endpoints
    ENDPOINTS: {
        AUTH: {
            REGISTER: '/api/auth/register',
            LOGIN: '/api/auth/login'
        },
        USERS: {
            GET_ALL: '/api/users'
        }
    },

    // Storage keys
    STORAGE_KEYS: {
        USER: 'currentUser'
    }
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);

/**
 * API Service - Simplified
 */
class ApiService {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
    }

    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.baseURL}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            console.log(`API: ${method} ${url}`);
            const response = await fetch(url, options);

            if (!response.ok) {
                const error = await response.json().catch(() => ({message: 'Error'}));
                throw new Error(error.message || 'Request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            if (error.message.includes('fetch')) {
                throw new Error('No se puede conectar al servidor');
            }
            throw error;
        }
    }

    async get(endpoint) {
        return this.request(endpoint, 'GET');
    }

    async post(endpoint, data) {
        return this.request(endpoint, 'POST', data);
    }
}

const api = new ApiService();

/**
 * Authentication Service - Simplified
 */
class AuthService {
    constructor() {
        this.currentUser = this.loadUserFromStorage();
    }

    async register(userData) {
        try {
            const response = await api.post(CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
            showToast('Registro exitoso! Ahora puedes iniciar sesión', 'success');
            return response;
        } catch (error) {
            showToast(error.message || 'Error al registrar usuario', 'error');
            throw error;
        }
    }

    async login(credentials) {
        try {
            const response = await api.post(CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
            this.currentUser = response;
            this.saveUserToStorage(response);
            showToast(`Bienvenido ${response.username}!`, 'success');
            return response;
        } catch (error) {
            showToast(error.message || 'Error al iniciar sesión', 'error');
            throw error;
        }
    }

    logout() {
        this.currentUser = null;
        this.clearStorage();
        showToast('Sesión cerrada correctamente', 'info');
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    saveUserToStorage(user) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    }

    loadUserFromStorage() {
        const userJson = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
        return userJson ? JSON.parse(userJson) : null;
    }

    clearStorage() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
    }
}

const authService = new AuthService();

/**
 * Users Service - Simplified
 */
class UsersService {
    async getAllUsers() {
        try {
            const users = await api.get(CONFIG.ENDPOINTS.USERS.GET_ALL);
            return users;
        } catch (error) {
            showToast('Error al cargar usuarios', 'error');
            throw error;
        }
    }
}

const usersService = new UsersService();

/**
 * Main Application Logic - Simplified
 */

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');

    // Setup event listeners
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Check authentication state
    if (authService.isAuthenticated()) {
        showDashboard();
    } else {
        showWelcome();
    }
});

// Navigation functions
function showWelcome() {
    hideAllSections();
    document.getElementById('welcomeSection').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
}

function showLogin() {
    hideAllSections();
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
}

function showRegister() {
    hideAllSections();
    document.getElementById('registerSection').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
}

function showDashboard() {
    hideAllSections();
    document.getElementById('dashboardSection').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'inline-block';

    // Update user info
    const user = authService.getCurrentUser();
    if (user) {
        document.getElementById('dashboardUsername').textContent = user.username;
        document.getElementById('dashboardEmail').textContent = user.email;
        document.getElementById('profileUsername').textContent = user.username;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profileId').textContent = user.id;
        document.getElementById('profileFullName').textContent =
            `${user.firstName || ''} ${user.lastName || ''}`.trim() || '-';
    }

    // Load users
    loadUsers();
}

function hideAllSections() {
    document.getElementById('welcomeSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'none';
}

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + 'Tab').style.display = 'block';
    event.target.classList.add('active');
}

// Toast notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 300);
    }, 4000);
}

// Load users function
async function loadUsers() {
    const loadingEl = document.getElementById('usersLoading');
    const tableEl = document.getElementById('usersTable');

    try {
        loadingEl.style.display = 'block';
        tableEl.innerHTML = '';

        const users = await usersService.getAllUsers();

        loadingEl.style.display = 'none';

        if (users.length === 0) {
            tableEl.innerHTML = '<p>No hay usuarios registrados</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'users-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Nombre</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.firstName || ''} ${user.lastName || ''}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        tableEl.appendChild(table);
    } catch (error) {
        console.error('Error loading users:', error);
        loadingEl.style.display = 'none';
        tableEl.innerHTML = '<p>Error al cargar usuarios</p>';
    }
}

// Form handlers
async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Iniciando sesión...';

        const credentials = {
            username: form.username.value.trim(),
            password: form.password.value
        };

        await authService.login(credentials);
        form.reset();
        showDashboard();
    } catch (error) {
        console.error('Login error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Iniciar Sesión';
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creando cuenta...';

        const userData = {
            username: form.username.value.trim(),
            email: form.email.value.trim(),
            password: form.password.value,
            firstName: form.firstName.value.trim(),
            lastName: form.lastName.value.trim()
        };

        await authService.register(userData);
        form.reset();
        setTimeout(() => showLogin(), 1500);
    } catch (error) {
        console.error('Register error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Crear Cuenta';
    }
}

function handleLogout() {
    authService.logout();
    showWelcome();
}
