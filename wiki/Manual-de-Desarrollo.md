# Manual de Desarrollo y Despliegue

Esta guía cubre los pasos necesarios para configurar, ejecutar, realizar pruebas y compilar el proyecto **UATF Forms** en un entorno de desarrollo local o producción.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu máquina:
*   [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada).
*   [PNPM](https://pnpm.io/) (El gestor de paquetes de alto rendimiento utilizado en este repositorio).
*   Una cuenta de [Firebase Console](https://console.firebase.google.com/) con un proyecto activo.

---

## ⚙️ Configuración Inicial

### 1. Clonar el repositorio e instalar dependencias
```bash
pnpm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto. Puedes tomar como base el archivo `.env.example` provisto. Este archivo almacena las credenciales de conexión con Firebase:

```env
# Configuración del Cliente Firebase
VITE_FIREBASE_API_KEY="tu-api-key"
VITE_FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="tu-proyecto-id"
VITE_FIREBASE_STORAGE_BUCKET="tu-proyecto.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="tu-messaging-sender-id"
VITE_FIREBASE_APP_ID="tu-app-id"

# Puerto del Servidor de Desarrollo
PORT=3000
```

### 3. Agregar credenciales de Servidor Firebase (Admin SDK)
Para poder ejecutar el seeding de datos directamente desde tu terminal, es necesario descargar una clave privada de Cuenta de Servicio:
1.  Ve a **Configuración del proyecto > Cuentas de servicio** en Firebase Console.
2.  Haz clic en **Generar nueva clave privada**.
3.  Guarda el archivo JSON descargado en la raíz del proyecto con el nombre:
    -   `serviceAccountKey.json` (para entorno local/producción)
    -   `serviceAccountKey.dev.json` (para entorno de desarrollo/testing)

---

## 🚀 Comandos del Ciclo de Vida

### Ejecución en Desarrollo
Inicia el servidor de desarrollo local de TanStack Start en `http://localhost:3000`:
```bash
pnpm dev
```

### Compilación para Producción
Genera la versión optimizada para desplegar. Compila los recursos de frontend cliente y el punto de entrada Express para el servidor:
```bash
pnpm build
```

### Ejecutar Tests
Corre la suite de pruebas unitarias configurada en Vitest:
```bash
pnpm test
```

### Formateo y Verificación de Código (Biome)
Para mantener la uniformidad estilística y libre de malas prácticas:
```bash
# Formatear todos los archivos
pnpm format

# Ejecutar el Linter para buscar problemas
pnpm lint

# Ejecutar diagnóstico de calidad completo (Linter, Formatter, importaciones)
pnpm check
```

---

## 💾 Inicialización y Seeding de Base de Datos

El script de seeding inserta los catálogos y datos predefinidos de carreras, facultades, modalidades de admisión, modalidades de graduación, usuarios y plantillas de formulario base en Firestore.

Ejecuta el siguiente comando para poblar la base de datos vacía:
```bash
pnpm seed
```

> [!CAUTION]
> El comando de seeding reescribirá la estructura fundamental de plantillas e ingresará cuentas de prueba. Asegúrate de apuntar a la base de datos correspondiente configurando la variable de entorno y los archivos de credenciales correctos.

### Usuarios de Prueba Seeded por Defecto:
*   **Administrador**: `admin@uatf.edu` / clave: `Admin123!` (Acceso completo al panel administrativo).
*   **Director (Ejemplo)**: Cuenta configurada por Carnet de Identidad (C.I.) y asociada a una carrera específica.
