# Taller 6 Frontend - Secure Authentication Client

Cliente web asíncrono con HTML/JavaScript que se conecta al backend Spring Boot mediante HTTPS/TLS.

---

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

### UI/UX
- ✅ **Diseño moderno** - Interfaz limpia y profesional
- ✅ **Responsive** - Adaptable a móviles y tablets
- ✅ **Animaciones suaves** - Transiciones CSS
- ✅ **Font Awesome** - Iconos vectoriales

---

## 📁 Estructura del Proyecto

```
taller6Front/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos modernos
├── js/
│   └── app.js              # TODO EL CÓDIGO JAVASCRIPT (377 líneas)
├── README.md               # Este archivo
└── APACHE_SETUP.md         # Guía de configuración Apache
```

---

## 🔧 Configuración

### 1. Configurar URL del Backend

Edita `js/config.js`:

```javascript
const CONFIG = {
    // Desarrollo local
    API_BASE_URL: 'https://areptaler6.duckdns.org:8443',
    
    // Producción (AWS)
    // API_BASE_URL: 'https://api.tu-dominio.com:8443',
};
```

### 2. Ejecutar Localmente

#### Opción A: Servidor HTTP Simple (Python)
```bash
# Python 3
cd taller6Front
python -m http.server 8081

# Acceder a: http://localhost:8081
```

#### Opción B: Live Server (VS Code)
1. Instala extensión "Live Server"
2. Click derecho en `index.html` → "Open with Live Server"
3. Se abre en: `http://127.0.0.1:5500`

#### Opción C: Apache (Producción)
Ver guía completa: **[APACHE_SETUP.md](APACHE_SETUP.md)**

---

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

---

## 🔐 Seguridad Implementada

### 1. HTTPS/TLS
Todas las peticiones al backend usan HTTPS:
```javascript
// En config.js
API_BASE_URL: 'https://localhost:8443'
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

---

## 📊 Arquitectura

### Flujo de Autenticación

```
┌─────────────┐         HTTPS/TLS        ┌──────────────┐
│             │◄──────────────────────────►│              │
│   Cliente   │   Async JavaScript/Fetch  │   Backend    │
│  (Browser)  │                            │ Spring Boot  │
│             │   JSON Request/Response    │   (8443)     │
└─────────────┘                            └──────────────┘
      │                                            │
      │ 1. POST /api/auth/register                │
      │────────────────────────────────────────────►
      │                                            │
      │ 2. 201 Created {id, username, email}      │
      │◄────────────────────────────────────────────
      │                                            │
      │ 3. POST /api/auth/login                   │
      │────────────────────────────────────────────►
      │                                            │
      │ 4. 200 OK {id, username, email}           │
      │◄────────────────────────────────────────────
      │                                            │
      │ 5. GET /api/users                         │
      │────────────────────────────────────────────►
      │                                            │
      │ 6. 200 OK [users array]                   │
      │◄────────────────────────────────────────────
```

### Servicios JavaScript

1. **ApiService** (`api.js`)
   - Maneja todas las peticiones HTTP
   - Implementa timeout y retry
   - Procesa respuestas JSON

2. **AuthService** (`auth.js`)
   - Gestiona registro y login
   - Almacena sesión en localStorage
   - Verifica autenticación

3. **UsersService** (`users.js`)
   - CRUD de usuarios
   - Formatea datos para visualización
   - Maneja errores específicos

4. **App** (`app.js`)
   - Controla navegación entre secciones
   - Gestiona estado de UI
   - Muestra notificaciones toast

---

## 🎨 Personalización

### Cambiar Colores
Edita variables CSS en `css/styles.css`:
```css
:root {
    --primary-color: #2563eb;    /* Azul principal */
    --secondary-color: #10b981;  /* Verde secundario */
    --danger-color: #ef4444;     /* Rojo de error */
}
```

### Agregar Nuevas Secciones
1. Agrega HTML en `index.html`
2. Crea función de navegación en `app.js`
3. Agrega estilos en `styles.css`

---

## 🐛 Troubleshooting

### Problema: "Error de conexión"
**Causa**: Backend no está corriendo o URL incorrecta

**Solución**:
1. Verifica que el backend esté corriendo:
   ```bash
   cd taller6Back
   mvn spring-boot:run
   ```
2. Verifica la URL en `js/config.js`
3. Verifica que el puerto sea `8443` (HTTPS)

### Problema: "Mixed Content" en navegador
**Causa**: Frontend en HTTP intentando conectar a HTTPS

**Solución**:
- Sirve el frontend también con HTTPS usando Apache
- O usa `http://localhost` para desarrollo local

### Problema: Certificado SSL no confiable
**Causa**: Certificado autofirmado en desarrollo

**Solución**:
1. Abre `https://localhost:8443` en el navegador
2. Click en "Avanzado" → "Continuar"
3. Acepta el certificado
4. Recarga la aplicación frontend

### Problema: CORS Error
**Causa**: Backend no permite el origen del frontend

**Solución**:
Verifica `CorsConfig.java` en el backend:
```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:8081",
    "https://localhost:8081"
));
```

---

## 📦 Despliegue en Producción

### 1. Preparar Archivos
```bash
# Actualizar URL de producción
# Editar js/config.js
API_BASE_URL: 'https://api.tu-dominio.com:8443'
```

### 2. Configurar Apache
Ver guía completa: **[APACHE_SETUP.md](APACHE_SETUP.md)**

### 3. Copiar Archivos al Servidor
```bash
# En servidor AWS EC2
sudo mkdir -p /var/www/taller6
sudo chown -R ec2-user:ec2-user /var/www/taller6

# Desde local
scp -r taller6Front/* ec2-user@tu-ip:/var/www/taller6/
```

### 4. Configurar HTTPS en Apache
```bash
# Generar certificados Let's Encrypt
sudo certbot --apache -d frontend.tu-dominio.com
```

---

## 🧪 Testing

### Pruebas Manuales

1. **Registro**
   - ✅ Validación de campos
   - ✅ Email duplicado (debe fallar)
   - ✅ Usuario duplicado (debe fallar)
   - ✅ Contraseña corta (debe fallar)

2. **Login**
   - ✅ Credenciales correctas
   - ✅ Credenciales incorrectas (debe fallar)
   - ✅ Usuario no existe (debe fallar)

3. **Dashboard**
   - ✅ Cargar lista de usuarios
   - ✅ Ver perfil propio
   - ✅ Logout

### Pruebas de Seguridad

1. **HTTPS**
   ```bash
   # Verificar que usa HTTPS
   curl -I https://localhost:8443/api/users
   ```

2. **XSS Protection**
   - Intenta registrar usuario con `<script>alert('xss')</script>`
   - Debe mostrarse como texto, no ejecutarse

---

## 📚 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript ES6+** - Async/await, clases, módulos
- **Fetch API** - Peticiones HTTP nativas
- **Font Awesome 6** - Iconos vectoriales
- **LocalStorage** - Persistencia de sesión

---

## 🎯 Cumplimiento del Taller

| Requisito | Estado |
|-----------|--------|
| ✅ Cliente HTML/JavaScript | Implementado |
| ✅ Async/Await | Implementado |
| ✅ Comunicación HTTPS | Implementado |
| ✅ Conexión con Backend | Implementado |
| ✅ UI Moderna | Implementado |
| ✅ Responsive Design | Implementado |
| ⏳ Apache Server | Documentado |
| ⏳ AWS Deployment | Documentado |

---

## 📝 Próximos Pasos

1. ✅ Frontend implementado
2. ⏳ Configurar Apache para servir frontend
3. ⏳ Desplegar en AWS EC2
4. ⏳ Configurar Let's Encrypt para HTTPS
5. ⏳ Conectar frontend y backend en producción

---

## 📞 Soporte

Para problemas o preguntas:
1. Revisa la sección Troubleshooting
2. Verifica los logs del navegador (F12 → Console)
3. Verifica los logs del backend

---

**¡Frontend listo para conectar con tu backend seguro! 🚀**
