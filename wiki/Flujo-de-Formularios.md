# Flujo de Formularios del Director

El módulo del Director ha sido rediseñado para optimizar la eficiencia, eliminar el estado intermedio de borradores masivos y unificar el flujo de trabajo en una sola vista estilo CRUD denominada **Reportes de Gestión**.

---

## 🔄 Rediseño del Flujo de Trabajo

El flujo anterior obligaba al Director a trabajar en dos secciones separadas del sidebar: "Formularios" (para el llenado masivo o individual) y "Resultados" (para ver los datos ingresados). 

El flujo actual unifica la experiencia:

```txt
[Menú Lateral: Reportes de Gestión]
       │
       ▼
[Vista Unificada: Respuestas de la Carrera] ◄──────────────┐
       │ (Muestra tabla de envíos e historial)             │
       ├───► Botón [+ Registrar Reporte]                   │ Recarga en
       │         │ (Despliega panel lateral de inserción)  │ tiempo real
       │         ▼                                         │
       │     [Formulario Dinámico Nuevo] ──────────────────┤
       │                                                   │
       └───► Acción [Editar] (Icono Lápiz en fila)         │
                 │ (Despliega panel lateral de edición)    │
                 ▼                                         │
             [Formulario Dinámico Precargado] ─────────────┘
```

---

## 🛠️ Componentes Clave del Motor de Formularios

El renderizado dinámico se apoya en los siguientes componentes modulares:

### 1. `ResponsesPanel.tsx`
Es la pantalla de control maestra de cada módulo (Estudiantes, Docentes, Graduados, Becas).
*   Renderiza la tabla de datos (`DataTable`) con las columnas dinámicas derivadas del formulario y las columnas fijas de control (Fecha, Usuario, Acciones).
*   Contiene el botón de creación principal y los disparadores del panel lateral (`Sheet` de Shadcn).

### 2. `EntityFormSheet.tsx` (`src/shared/ui/entity-form-sheet.tsx`)
Un contenedor lateral reutilizable y estilizado con efectos de desenfoque de fondo (glassmorphism) que envuelve el formulario específico de cada módulo para evitar recargar la página principal o perder el contexto de la tabla.

### 3. `DynamicForm.tsx` (`src/shared/components/DynamicForm.tsx`)
El motor de renderizado de campos basado en **TanStack Form**.
*   Procesa la metadata de `FormTemplateDef` (título, descripción, campos, tipos, obligatoriedad).
*   Dibuja de forma reactiva el input adecuado: números, textos o menús desplegables (`Select`).
*   Gestiona el estado interno del formulario y ejecuta las validaciones locales de formato al escribir.

### 4. `useReportSubmission.ts` (`src/features/reports/hooks/useReportSubmission.ts`)
El hook maestro que gestiona el ciclo de vida de la transacción de datos:
*   Mapea los datos del formulario interno hacia los documentos estructurados de Firestore.
*   Diferencia automáticamente si se trata de un nuevo envío (mutación de inserción en Firebase) o de una actualización (mutación de edición).
*   Lanza diálogos de confirmación (`AlertDialogCustom`) y alertas de notificación rápidas (`Toast`).

---

## 🔒 Sistema de Bloqueos y Dependencia de Pasos

Para garantizar que los Directores ingresen la información en la secuencia estadística correcta, existe un flujo secuencial mandatorio de pasos (Step Lock):

1.  **Consulta de progreso**: El hook `useDirectorProgress()` lee la colección `/director_progress/{email}` en Firestore para recuperar el listado de pasos completados por la carrera.
2.  **Validación en Sidebar**: En la barra lateral (`DashboardSidebar.tsx`), los enlaces correspondientes a los formularios que superan el paso activo se muestran bloqueados visualmente (deshabilitados).
3.  **Validación en ResponsesPanel**: En caso de que se intente ingresar directamente por URL a una sección no autorizada, `ResponsesPanel.tsx` valida la condición de bloqueo:
    ```typescript
    const isStepLocked = useMemo(() => {
        // Bloquea si el paso del formulario es superior al paso activo disponible
        return template.step > currentActiveStep;
    }, [...]);
    ```
    Si el paso está bloqueado, se restringe la visualización y se impide la inserción de nuevos registros hasta que se completen las etapas previas.
