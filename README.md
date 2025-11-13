# EcoPack+ 🌱

Aplicación Web Progresiva (PWA) para la gestión de empaques biodegradables con trazabilidad digital.

## 📋 Características

- **Autenticación**: Sistema completo de login y registro con Firebase Authentication
- **CRUD Completo**: Crear, leer, actualizar y eliminar empaques biodegradables
- **Trazabilidad Digital**: Cada empaque tiene un código QR único para seguimiento
- **Búsqueda Avanzada**: Filtrar empaques por ID, material, estado o código QR
- **Dashboard Interactivo**: Estadísticas en tiempo real y gestión visual
- **PWA**: Instalable en dispositivos móviles y de escritorio
- **Diseño Responsivo**: Interfaz optimizada para todos los dispositivos

## 🚀 Tecnologías

- **Framework**: Next.js 16 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Autenticación**: Firebase Authentication
- **Base de Datos**: Cloud Firestore
- **Despliegue**: Vercel

## 📦 Campos del CRUD

Cada empaque biodegradable incluye:

- **ID del empaque**: Identificador único del producto
- **Tipo de material**: Maíz, caña u otro material biodegradable
- **Fecha de fabricación**: Registro temporal de creación
- **Estado**: En producción, distribuido o reciclado
- **Código QR**: Generado automáticamente para trazabilidad
- **Usuario**: Vinculado al creador del empaque

## 🔐 Configuración de Firebase

### 1. Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Firebase Authentication (Email/Password)
4. Crea una base de datos Cloud Firestore

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
\`\`\`

### 3. Configurar reglas de Firestore

En Firebase Console, ve a Firestore Database > Reglas y configura:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /packages/{packageId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
\`\`\`

## 💻 Instalación y Uso

### Instalación

\`\`\`bash
# Usando el comando de shadcn (recomendado)
npx shadcn@latest init ecopack-plus

# O instalar dependencias manualmente
npm install
\`\`\`

### Desarrollo

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Producción

\`\`\`bash
npm run build
npm start
\`\`\`

## 🌐 Despliegue en Vercel

1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno de Firebase en el dashboard de Vercel
3. Despliega automáticamente

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📊 Flujo de Datos

\`\`\`
Usuario → Autenticación (Firebase Auth) → Dashboard
                                            ↓
                                    Firestore Database
                                            ↓
                                    CRUD Operations
                                            ↓
                        Crear / Leer / Actualizar / Eliminar
                                            ↓
                                    Actualización UI
\`\`\`

## 🔒 Medidas de Seguridad

### Implementadas

- ✅ Validación de formularios (correo, contraseña, campos CRUD)
- ✅ Autenticación obligatoria para acceder al dashboard
- ✅ Variables de entorno para proteger claves de Firebase
- ✅ Reglas de seguridad en Firestore (solo el usuario puede ver sus datos)
- ✅ HTTPS obligatorio en producción (Vercel)
- ✅ Manejo de errores con mensajes amigables
- ✅ Protección contra SQL injection (NoSQL - Firestore)
- ✅ Sanitización de entradas del usuario

### Recomendaciones adicionales

- 🔐 Implementar rate limiting en autenticación
- 🔐 Agregar verificación de correo electrónico
- 🔐 Implementar autenticación multifactor (MFA)
- 🔐 Configurar CORS en Firebase
- 🔐 Monitorear logs de seguridad en Firebase Console

## 🧪 Pruebas

### Pruebas manuales en navegador

1. **Registro de usuario**:
   - Ir a `/auth/register`
   - Crear una cuenta con email y contraseña válidos
   - Verificar redirección al dashboard

2. **Login**:
   - Ir a `/auth/login`
   - Iniciar sesión con credenciales creadas
   - Verificar acceso al dashboard

3. **CRUD de empaques**:
   - Crear nuevo empaque con el botón "Nuevo Empaque"
   - Buscar empaques usando el campo de búsqueda
   - Ver detalles haciendo clic en el ícono de ojo
   - Editar empaque desde la vista de detalles
   - Eliminar empaque con el ícono de papelera

### Pruebas con herramientas

**Firebase Console**: Verificar que los datos se guardan correctamente en Firestore

**DevTools**:
- Network: Verificar peticiones a Firebase
- Console: Revisar errores de JavaScript
- Application: Verificar PWA manifest y service workers

## 📱 Funcionalidad PWA

La aplicación es una PWA completa:

- ✅ Manifest.json configurado
- ✅ Íconos para instalación (192x192 y 512x512)
- ✅ Theme color adaptativo (light/dark mode)
- ✅ Instalable en dispositivos móviles y escritorio
- ✅ Experiencia offline básica (Next.js service worker)

### Instalar como PWA

**En Chrome/Edge**:
1. Visita la aplicación
2. Busca el ícono de instalación en la barra de direcciones
3. Haz clic en "Instalar"

**En iOS Safari**:
1. Visita la aplicación
2. Toca el botón de compartir
3. Selecciona "Agregar a pantalla de inicio"

## 🌳 Estructura de Ramas (Versionamiento)

\`\`\`
main (producción - v1.0.0)
  ↓
develop (desarrollo)
  ↓
feature/crud-empaques (características específicas)
feature/auth-system
feature/pwa-config
\`\`\`

### Comandos Git útiles

\`\`\`bash
# Crear rama de desarrollo
git checkout -b develop

# Crear rama de característica
git checkout -b feature/nueva-caracteristica

# Fusionar a develop
git checkout develop
git merge feature/nueva-caracteristica

# Fusionar a main (producción)
git checkout main
git merge develop
git tag v1.0.0
\`\`\`

## 📄 Licencia

Este proyecto es parte de un proyecto educativo de negocio sostenible.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama de característica (\`git checkout -b feature/AmazingFeature\`)
3. Commit tus cambios (\`git commit -m 'Add some AmazingFeature'\`)
4. Push a la rama (\`git push origin feature/AmazingFeature\`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas:

1. Revisa la documentación de Firebase
2. Verifica que todas las variables de entorno estén configuradas
3. Consulta los logs en Firebase Console
4. Revisa la consola del navegador para errores

---

Hecho con 💚 para un futuro más sostenible
\`\`\`
