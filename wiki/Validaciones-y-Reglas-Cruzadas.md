# Validaciones Locales y Reglas Cruzadas

El sistema **UATF Forms** implementa múltiples capas de validaciones para asegurar la consistencia y veracidad de los datos recolectados, previniendo errores humanos de tipeo o inconsistencias estadísticas en los reportes de gestión.

---

## 📱 1. Validaciones Locales de Formato (Frontend)

Estas validaciones ocurren en tiempo real en el navegador mediante el componente `DynamicForm.tsx`, utilizando expresiones regulares para restringir los caracteres de entrada:

### A. Número de Celular
*   **Campos**: Campos llamados `cel` o cuya etiqueta contenga la palabra "celular".
*   **Regla**: Debe tener exactamente 8 caracteres numéricos y comenzar obligatoriamente con el dígito **6** o **7** (formato oficial de telefonía móvil de Bolivia).
*   **Expresión Regular**: `/^[67]\d{7}$/`
*   **Mensaje de error**: `"El celular debe tener 8 dígitos y comenzar con 6 o 7"`

### B. Nombres y Apellidos
*   **Campos**: Campos llamados `nombres`, `paterno`, `materno`, o cuya etiqueta incluya "nombre" o "apellido".
*   **Regla**: Solo se aceptan caracteres alfabéticos (mayúsculas, minúsculas, vocales acentuadas, la eñe, diéresis) y espacios simples. Se rechazan números y símbolos especiales.
*   **Expresión Regular**: `/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/`
*   **Mensaje de error**: `"Este campo sólo acepta letras y espacios"`

### C. Carnet de Identidad (C.I.)
*   **Campos**: Campos llamados `ci` o etiquetas que incluyan "carnet" o "c.i.".
*   **Regla**: Debe comenzar con dígitos numéricos y opcionalmente puede finalizar con la extensión del departamento o caracteres complementarios antecedidos por un guion o espacio (ej: `1234567`, `1234567 PT`, `1234567-1F`).
*   **Expresión Regular**: `/^\d+(?:[-\s][a-zA-Z0-9]+)?$/`
*   **Mensaje de error**: `"Formato inválido (ej: 1234567 o 1234567 PT)"`

---

## 📊 2. Reglas Cruzadas de Validación de Negocio

Estas validaciones cruzan datos entre diferentes formularios o pasos de la misma gestión anual, asegurando la consistencia estadística de la información agregada.

### A. Límites por Modalidad (Paso-a-Paso)
Se aplican en formularios secuenciales que desglosan datos numéricos por modalidades.
*   **Caso de Uso**: El número de admitidos registrados en **Postulantes Admitidos** (Paso 2) para una modalidad específica (ej: "Examen P.S.A.", "Ingreso Especial") y sexo no puede ser mayor que el reportado originalmente en **Postulantes** (Paso 1) para esa misma modalidad y sexo.
*   **Lógica técnica**: El hook `useSubmittedResponseLimits` lee los envíos del paso anterior de la base de datos de Firestore y los formatea como un mapa de límites:
    ```typescript
    limits[modalidad] = { masculino: limitM, femenino: limitF }
    ```
    Al ingresar datos, el componente evalúa si superan el límite correspondiente a la modalidad seleccionada.
*   **Mensaje de error**: `"El valor no puede ser mayor a {límite} (límite del formulario anterior)"`

### B. Límites Cruzados de Totales Acumulados
Garantizan que la suma total por sexo de ciertos formularios no supere la capacidad o el límite de los pasos de referencia clave:

| Paso Origen (Límite Máximo) | Paso Destino (Validado) | Lógica de Negocio |
| :--- | :--- | :--- |
| **Paso 2: Postulantes Admitidos** | **Paso 4: Matrícula Nuevos** | El número de estudiantes nuevos matriculados por sexo no puede superar la cantidad de admitidos en esa gestión. |
| **Paso 3: Matrícula** | **Paso 5: Estudiantes Programados** | Los estudiantes programados para cursar materias no pueden superar el total de matriculados en la gestión por sexo. |
| **Paso 3: Matrícula** | **Módulo Becarios** (Pasos 10 al 14) | Los cupos de becarios asignados por sexo (ej: Beca Alimentación, Trabajo, Docencia) no pueden exceder la matrícula total de la carrera. |

*   **Lógica técnica**: El hook `useSubmittedTotals` consulta los registros de Firestore y suma dinámicamente los valores numéricos correspondientes al paso origen (`templateId`) del periodo activo. Estos totales consolidados se inyectan en el formulario destino mediante la propiedad `crossStepLimits`.
*   **Mensaje de error**: `"El valor no puede ser mayor a {total} (total registrado en el paso anterior de la gestión)"`
