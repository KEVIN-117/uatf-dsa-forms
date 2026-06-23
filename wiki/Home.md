# Bienvenido a la Wiki de UATF Forms

**UATF Forms** es una plataforma dinámica de construcción y gestión de formularios diseñada para recolectar, validar y analizar reportes de gestión universitaria (estudiantes, becarios, docentes y graduados). Está construida con tecnologías de última generación para garantizar velocidad, tipado estricto y seguridad en tiempo real.

Esta Wiki contiene la documentación técnica detallada para desarrolladores y administradores del sistema.

---

## 📌 Tabla de Contenidos

### 1. [Estructura y Arquitectura del Proyecto](Estructura-y-Arquitectura.md)
Detalles sobre el stack tecnológico principal (**TanStack Start**, **React 19**, **Tailwind CSS 4**), la organización modular de los directorios (`src/features/`, `src/app/`, `src/routes/`) y el flujo de renderizado dinámico.

### 2. [Manual de Desarrollo](Manual-de-Desarrollo.md)
Guía paso a paso para la instalación de dependencias, configuración de variables de entorno (`.env`), ejecución del servidor de desarrollo local, seeding (poblado) inicial de la base de datos de Firebase y compilación para producción.

### 3. [Flujo de Formularios del Director](Flujo-de-Formularios.md)
Descripción de la experiencia unificada del Director ("Reportes de Gestión"). Explica cómo funciona el flujo CRUD en tiempo real reemplazando los borradores masivos anteriores y cómo se integra la edición en caliente mediante hojas laterales (`Sheets`).

### 4. [Validaciones Locales y Reglas Cruzadas](Validaciones-y-Reglas-Cruzadas.md)
Documentación sobre las expresiones regulares locales del lado del cliente (celulares, Carnet de Identidad, nombres) y las validaciones lógicas cruzadas entre los distintos pasos del periodo (por ejemplo, validar que los estudiantes programados no excedan la matrícula).

### 5. [Seguridad y Firebase](Seguridad-y-Firebase.md)
Especificación de los roles del sistema (`administrator` y `director`) y las reglas de seguridad a nivel de servidor en Firestore (`firestore.rules`) que garantizan el aislamiento estricto de los datos por carrera (`programId`).
