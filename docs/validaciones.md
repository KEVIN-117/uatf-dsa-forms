# Documentación de Validaciones y Reglas Cruzadas - UATF Forms

Este documento detalla el sistema multi-nivel de validación y reglas de negocio del sistema **UATF Forms**. Las validaciones están estructuradas en tres capas principales:

1. **Validaciones Locales de Formato (Frontend)**: Aseguran que la información básica ingresada por el usuario sea coherente y correcta en el momento de la escritura.
2. **Validaciones Cruzadas entre Pasos (Base de Datos a Frontend)**: Reglas de negocio que condicionan el ingreso de datos numéricos según lo reportado en pasos o módulos previos dentro de la misma gestión/periodo.
3. **Reglas de Seguridad y Acceso en la Base de Datos (Firestore Rules)**: Restricciones a nivel de servidor que protegen la integridad de los datos e implementan el aislamiento jerárquico por carrera.

---

## 1. Validaciones Locales de Formato (en `DynamicForm.tsx`)

Estas validaciones se ejecutan dinámicamente en el cliente tan pronto como el usuario escribe en los campos del formulario. Utilizan expresiones regulares de precisión para reducir errores humanos de entrada:

### A. Número de Celular
- **Campos objetivo**: Nombre del campo es `cel` o contiene la palabra "celular".
- **Regla de negocio**: Debe poseer exactamente 8 dígitos numéricos y comenzar con el dígito **6** o **7** (formato oficial de telefonía móvil de Bolivia).
- **Expresión Regular**: `/^[67]\d{7}$/`
- **Mensaje de Error**: `"El celular debe tener 8 dígitos y comenzar con 6 o 7"`

### B. Nombres y Apellidos
- **Campos objetivo**: Nombre del campo es `nombres`, `paterno`, `materno`, o incluye "nombre" o "apellido".
- **Regla de negocio**: Solo se permiten caracteres alfabéticos (mayúsculas, minúsculas, vocales con acento, la letra eñe, diéresis) y espacios. Se rechazan números y caracteres especiales.
- **Expresión Regular**: `/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/`
- **Mensaje de Error**: `"Este campo sólo acepta letras y espacios"`

### C. Carnet de Identidad (C.I.)
- **Campos objetivo**: Nombre del campo es `ci` o contiene "carnet" o "c.i.".
- **Regla de negocio**: Permite el número de carnet inicial seguido opcionalmente de un espacio o guion y caracteres alfanuméricos para indicar extensiones departamentales (ej: `1234567`, `1234567 PT`, `1234567-1F`).
- **Expresión Regular**: `/^\d+(?:[-\s][a-zA-Z0-9]+)?$/`
- **Mensaje de Error**: `"Formato inválido (ej: 1234567 o 1234567 PT)"`

---

## 2. Validaciones de Reglas Cruzadas entre Pasos

Estas reglas previenen que se registren inconsistencias estadísticas entre diferentes etapas del reporte de gestión anual. Utilizan ganchos personalizados (`useSubmittedTotals`, `useSubmittedResponseLimits`) que realizan consultas agregadas a Firestore en tiempo real para el periodo activo.

### A. Límites por Modalidad (Paso-a-Paso)
Se aplican en formularios que desglosan información por modalidades de ingreso académico.
- **Flujo Estudiantes (Paso 2 vs Paso 1)**:
  - Los admitidos registrados en **Postulantes Admitidos** (Paso 2) por modalidad (ej: "Examen P.S.A.", "Curso Preuniversitario") no pueden ser superiores a la cantidad de postulantes reportados en **Postulantes** (Paso 1) para esa misma modalidad y sexo.
- **Implementación técnica**: El hook `useSubmittedResponseLimits` mapea la respuesta anterior de la siguiente manera:
  ```json
  {
    "EXAMEN P.S.A.": { "masculino": 10, "femenino": 12 },
    "CURSO PREUNIVERSITARIO": { "masculino": 15, "femenino": 20 }
  }
  ```
  Al seleccionar una modalidad, la validación local de `DynamicForm` bloquea dinámicamente ingresos que superen estos topes.
- **Mensaje de Error**: `"El valor no puede ser mayor a {límite} (límite del formulario anterior)"`

### B. Límites Cruzados de Totales Acumulados
Se valida que el volumen de estudiantes registrados en formularios de flujo lógico posterior no supere las metas o límites establecidos en formularios raíz:

| Formulario Origen (Límite) | Formulario Destino (Validado) | Regla de Negocio |
| :--- | :--- | :--- |
| **Paso 2: Postulantes Admitidos** | **Paso 4: Matrícula Nuevos** | La cantidad de estudiantes nuevos matriculados por sexo no puede superar el total de postulantes admitidos en esa gestión. |
| **Paso 3: Matrícula** | **Paso 5: Estudiantes Programados** | El número de estudiantes programados para cursar materias por sexo no puede ser mayor a la matrícula total reportada. |
| **Paso 3: Matrícula** (Módulo Estudiantes) | **Pasos 10-14: Módulo Becarios** (Alimentación, Auxiliares, Investigación, etc.) | La cantidad de becarios asignados por tipo de beca y sexo no puede ser mayor a la matrícula global de la carrera. |

- **Implementación técnica**: 
  - El hook `useSubmittedTotals` suma dinámicamente todas las respuestas de Firestore para un `templateId` y `periodId` específico del programa del director.
  - Al renderizarse el formulario en modo creación (desde el sidebar) o edición (a través de `ResponsesPanel.tsx`), estos totales se inyectan a `<DynamicForm>` como la propiedad `crossStepLimits`.
- **Mensaje de Error**: `"El valor no puede ser mayor a {total} (total registrado en el paso anterior de la gestión)"`

---

## 3. Reglas de Seguridad y Acceso (Firestore Rules)

Esta es la última capa de defensa del sistema. Aunque un usuario malintencionado intente saltarse las validaciones visuales del frontend modificando el código de la consola, las reglas escritas en `firestore.rules` bloquearán cualquier acción de escritura no autorizada directamente en los servidores de Google Firebase.

### A. Control Jerárquico por Roles
- **Administrador (`administrator`)**: Posee permisos completos de lectura y escritura (`read, write: if isAdmin()`) sobre todas las colecciones del sistema (Usuarios, Parámetros de Referencia, Plantillas de Formulario y Respuestas).
- **Director (`director`)**: Solo tiene permisos para consultar información de soporte básico (modalidades, facultades) y gestionar reportes de su respectiva carrera.

### B. Aislamiento Estricto de Respuestas (`student`, `teacher`, `graduate`, `scholarships`)
Para garantizar la confidencialidad entre facultades y carreras, las reglas imponen un filtro geográfico digital:
- **Lectura**: Un Director solo puede consultar los documentos de respuesta si su `programId` coincide exactamente con el `programId` embebido en su token de autenticación:
  ```javascript
  allow read: if isDirector() && (resource == null || resource.data.programId == request.auth.token.programId);
  ```
- **Creación**: Al registrar un nuevo reporte, el servidor valida que el Director no intente inyectar registros para otra carrera:
  ```javascript
  allow create: if isDirector() && request.resource.data.programId == request.auth.token.programId;
  ```
- **Modificación**: Solo se autoriza si el registro pertenece a la carrera del Director tanto antes como después del cambio:
  ```javascript
  allow update: if isDirector() && resource.data.programId == request.auth.token.programId && request.resource.data.programId == request.auth.token.programId;
  ```
- **Eliminación**: Restringida a registros de su propia carrera.

### C. Control de Flujo de Progreso (`director_progress` y `form-status`)
- Los directores únicamente pueden leer y escribir su propio estado de progreso o estado de formularios (`request.auth.token.email == progressId` o `request.auth.uid == statusId`), impidiendo que un director marque como completado el trabajo de otro.
