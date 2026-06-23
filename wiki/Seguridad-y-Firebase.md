# Seguridad y Firebase (Firestore Rules)

El sistema **UATF Forms** utiliza un modelo híbrido de seguridad. Mientras que el frontend implementa validaciones visuales para guiar al usuario, el servidor de base de datos en Firebase Firestore ejecuta reglas estrictas (`firestore.rules`) para bloquear accesos y modificaciones no autorizadas a nivel de API.

---

## 👥 1. Modelo de Roles del Sistema

Los permisos en el backend se basan en atributos específicos (claims personalizados) dentro del token de autenticación del usuario (`request.auth.token`):

### A. Administrador (`role == 'administrator'`)
*   Tiene privilegios globales completos (`allow read, write: if isAdmin()`).
*   Su función principal es gestionar usuarios, inicializar periodos académicos, definir/actualizar plantillas de formularios y visualizar reportes consolidados a nivel de toda la universidad.

### B. Director (`role == 'director'`)
*   Tiene permisos de lectura restringidos a catálogos de soporte.
*   Tiene permisos de lectura y escritura (CRUD) **únicamente** sobre las respuestas pertenecientes a su respectiva carrera (`programId`).
*   Tiene permisos para gestionar su propio estado de avance individual y marcas de progreso.

---

## 🔒 2. Reglas de Aislamiento de Datos por Carrera (Colecciones de Respuestas)

Para evitar que un Director pueda consultar, modificar o eliminar registros de otra carrera o facultad, las colecciones `student`, `teacher`, `graduate` y `scholarships` están protegidas por reglas que interceptan el documento físico:

```javascript
// Ejemplo para la colección 'student'
match /student/{responseId} {
  // 1. El administrador tiene acceso total
  allow read, write: if isAdmin();
  
  // 2. Creación: El programId del nuevo registro debe coincidir con el del token del Director
  allow create: if isDirector() && request.resource.data.programId == request.auth.token.programId;
  
  // 3. Lectura: Solo puede leer si el registro almacenado pertenece a su carrera
  allow read: if isDirector() && (resource == null || resource.data.programId == request.auth.token.programId);
  
  // 4. Edición: Asegura que el registro antiguo y el nuevo pertenezcan a la carrera del Director
  allow update: if isDirector() && resource.data.programId == request.auth.token.programId && request.resource.data.programId == request.auth.token.programId;
  
  // 5. Eliminación: Solo puede borrar documentos de su carrera
  allow delete: if isDirector() && resource.data.programId == request.auth.token.programId;
}
```

### 🧠 ¿Cómo funciona esta validación en el Servidor?
*   `resource`: Representa el documento existente en Firestore antes de realizar la acción (lectura, modificación, eliminación).
*   `request.resource`: Representa los datos que se intentan escribir en el documento (creación, modificación).
*   `request.auth.token.programId`: Es el identificador de la carrera asignado al Director en el momento de crear su usuario en Firebase Auth.

---

## 📂 3. Reglas por Colección Básica

### A. Colección `users`
*   **Permiso de Lectura**: Público (`allow read: if true;`). Esto permite buscar directores registrados durante el proceso de inicio de sesión utilizando su número de C.I.
*   **Permiso de Escritura**: Solo Administradores (`allow write: if isAdmin();`), garantizando que los directores no puedan cambiarse de carrera, editar sus roles o crear cuentas adicionales.

### B. Datos de Referencia (Facultades, Carreras, Modalidades, Plantillas, Periodos)
*   **Lectura**: Permitida para cualquier usuario autenticado en la plataforma.
*   **Escritura**: Exclusiva para administradores. Los directores tienen restringida cualquier alteración a las plantillas o parámetros base de la universidad.

### C. Progreso del Director (`director_progress` y `form-status`)
*   **Lectura y Escritura**: Permitida solo si el usuario que realiza la petición es un administrador, o si su identificador (`uid` o `email`) coincide exactamente con el ID del documento:
    ```javascript
    match /form-status/{statusId} {
      allow read, write: if isAdmin() || (isDirector() && request.auth.uid == statusId);
    }
    match /director_progress/{progressId} {
      allow read, write: if isAdmin() || (isDirector() && request.auth.token.email == progressId);
    }
    ```
    Esto blinda las métricas de avance por carrera, previniendo alteraciones cruzadas entre directores.
