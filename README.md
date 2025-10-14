# Taller 6 Frontend - Secure Authentication Client

Cliente web asíncrono con HTML/JavaScript que se conecta al backend Spring Boot mediante HTTPS/TLS.

## 🚀 Características

### Seguridad
- ✅ **Comunicación HTTPS** - Todas las peticiones cifradas con TLS
- ✅ **Async/Await** - JavaScript asíncrono moderno
- ✅ **Fetch API** - Peticiones HTTP nativas
- ✅ **XSS Protection** - Escape de HTML en datos de usuario

### Funcionalidad
- ✅ **Registro de usuarios** - Formulario completo con validaciones
- ✅ **Login** - Autenticación con backend
- ✅ **Dashboard** - Visualización de usuarios registrados
- ✅ **Perfil de usuario** - Información del usuario actual
- ✅ **Notificaciones Toast** - Feedback visual de operaciones

## 📁 Estructura del Proyecto

```
taller6Front/
├── .gitignore
├── LICENSE
├── README.md
├── arepF.pem
├── css/
│   └── styles.css
├── httpd.conf
├── index.html
└── js/
    └── app.js
```

## 🔧 Configuración

### 1. Configurar URL del Backend
Edita `js/app.js` (líneas 9-28):
```javascript
const CONFIG = {
    API_BASE_URL: 'https://areptaler6.duckdns.org:8443', // Cambiar según el entorno
};
```

### 2. Ejecutar Localmente

#### Opción A: Servidor HTTP Simple (Python)
```bash
cd taller6Front
python -m http.server 8081
```

#### Opción B: Live Server (VS Code)
1. Instala extensión "Live Server"
2. Click derecho en `index.html` → "Open with Live Server"

## 🌐 Uso de la Aplicación

### 1. Página de Bienvenida
- Muestra características de seguridad
- Botones para Login y Registro

### 2. Registro
1. Click en "Registrarse"
2. Completa el formulario:
   - Nombre y Apellido
   - Usuario (mínimo 3 caracteres)
   - Email válido
   - Contraseña (mínimo 6 caracteres)
3. Click en "Crear Cuenta"
4. Redirige automáticamente al Login

### 3. Login
1. Click en "Iniciar Sesión"
2. Ingresa usuario y contraseña
3. Click en "Iniciar Sesión"
4. Accede al Dashboard

### 4. Dashboard
- **Tab Usuarios**: Lista de todos los usuarios registrados
- **Tab Mi Perfil**: Información del usuario actual
- **Botón Logout**: Cerrar sesión

## 🔐 Seguridad Implementada

### 1. HTTPS/TLS
Todas las peticiones al backend usan HTTPS:
```javascript
// En app.js
API_BASE_URL: 'https://areptaler6.duckdns.org:8443'
```

### 2. Async/Await
Peticiones asíncronas modernas:
```javascript
async function handleLogin(event) {
    const response = await authService.login(credentials);
    // ...
}
```

### 3. Error Handling
Manejo robusto de errores:
```javascript
try {
    await api.post('/api/auth/login', data);
} catch (error) {
    showToast(error.message, 'error');
}
```

### 4. XSS Protection
Escape de HTML en datos de usuario:
```javascript
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

### 5. Timeout en Peticiones
Timeout de 10 segundos para evitar bloqueos:
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);
```

## 📚 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript ES6+** - Async/await, clases, módulos
- **Fetch API** - Peticiones HTTP nativas
- **Font Awesome 6** - Iconos vectoriales
- **LocalStorage** - Persistencia de sesión


