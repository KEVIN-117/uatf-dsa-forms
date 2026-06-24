# Control de Envíos de Formularios: Single vs Multi-Submit

## Contexto

Los directores envían reportes a través de formularios dinámicos (`FormTemplateDef`). Actualmente no hay control sobre cuántas veces se puede enviar un formulario. Se necesita:

1. **Formularios de envío único** → una vez enviado, el botón "Registrar Reporte" se deshabilita.
2. **Formularios multi-envío** (tienen un campo `select`) → se permite un envío por cada opción del select, deshabilitando las opciones ya usadas.

## Análisis del Estado Actual

### Modelo de datos relevante

- [FormTemplateDef](file:///c:/Users/MSI%20CYBORG%2014/profile/del/uatf-forms/src/shared/types/dynamic-form.ts#L29-L40): Define un formulario con `fields`, `module`, `step`, `hasBulk`.
- [FormFieldDef](file:///c:/Users/MSI%20CYBORG%2014/profile/del/uatf-forms/src/shared/types/dynamic-form.ts#L10-L20): Cada campo tiene `type` (text, number, select...) y `options` (para selects).
- [FormResponseDef](file:///c:/Users/MSI%20CYBORG%2014/profile/del/uatf-forms/src/shared/types/dynamic-form.ts#L42-L54): Cada respuesta guarda `response: Record<string, any>` donde se almacenan los valores.

### Flujo de envío actual

El director accede al formulario desde:
- Rutas directas de reporte (e.g., `StudentReport`, `TeacherReport`, etc.)
- El panel de respuestas (`ResponsesPanel`) con el botón "Registrar Reporte" que abre un `EntityFormSheet`

El hook [useReportSubmission](file:///c:/Users/MSI%20CYBORG%2014/profile/del/uatf-forms/src/features/reports/hooks/useReportSubmission.ts) maneja toda la lógica de submit.

### Lo que ya existe

- [useSubmittedModalities](file:///c:/Users/MSI%20CYBORG%2014/profile/del/uatf-forms/src/features/reports/hooks/useSubmittedModalidades.ts#L26-L58): Ya extrae las modalidades enviadas de un formulario **anterior** para filtrar opciones en el formulario **siguiente**.
- [useGetResponses](file:///c:/Users/MSI%20CYBORG%2014/profile/del/uatf-forms/src/shared/hooks/useFormResponses.ts#L66-L110): Ya trae las respuestas del formulario **actual** filtradas por usuario y programa.

## Propuesta de Estrategia

### Enfoque: Derivar el tipo de envío del propio template

**No se necesita un campo nuevo en `FormTemplateDef`**. La regla se puede inferir así:

> Si el template tiene al menos un campo `select` con `options` → es **multi-envío** (un envío por opción del select).
> Si el template NO tiene ningún campo `select` con `options` → es **single-envío**.

### Componentes del cambio

---

### 1. Nuevo hook: `useSubmissionGuard`

Ubicación: `src/features/reports/hooks/useSubmissionGuard.ts`

Este hook centraliza la lógica de control de envíos. Recibe el `template` y las `responses` del usuario actual, y devuelve:

```typescript
interface SubmissionGuard {
  /** Si el botón de crear reporte debe estar deshabilitado */
  canSubmit: boolean;
  /** Mensaje explicativo cuando no se puede enviar */
  disabledReason: string | null;
  /** Para formularios multi-envío: opciones del select que ya fueron usadas */
  usedSelectValues: string[];
  /** Tipo de envío inferido */
  submissionType: "single" | "multi";
}
```

**Lógica interna:**

```
1. Buscar en template.fields el primer campo de tipo "select" con options
2. Si NO existe → submissionType = "single"
   - Si ya hay ≥ 1 respuesta del usuario actual → canSubmit = false
3. Si SÍ existe → submissionType = "multi"
   - Extraer de las respuestas del usuario los valores usados para ese campo select
   - usedSelectValues = valores ya enviados
   - Si todas las opciones disponibles ya fueron usadas → canSubmit = false
```

---

### 2. Filtrar opciones de select usadas en el formulario

En los componentes de reporte (`StudentReport`, `GraduatesReport`, etc.) y en `ResponsesPanel`, al construir el template filtrado:

- Para formularios **multi-envío**: filtrar el `options` del campo select para **remover las opciones ya usadas** (las que están en `usedSelectValues`).
- Esto se puede hacer en el `filteredTemplate` existente o en un nuevo paso de transformación.

---

### 3. Deshabilitar botón "Registrar Reporte" en `ResponsesPanel`

En [ResponsesPanel.tsx#L548-L556](file:///c:/Users/MSI%20CYBORG%2014/profile/del/uatf-forms/src/features/dashboard/screens/ResponsesPanel.tsx#L548-L556), donde está el botón:

```tsx
{!isReadOnly && !isStepLocked && userRole === "director" && (
  <Button
    onClick={() => setCreateSheetOpen(true)}
    className="font-semibold"
    disabled={!canSubmit}  // ← NUEVO
  >
    <Plus className="size-4 mr-2" />
    {canSubmit ? "Registrar Reporte" : disabledReason}
  </Button>
)}
```

---

### 4. Deshabilitar formulario en rutas directas de reporte

En `StudentReport`, `TeacherReport`, `GraduatesReport`, y `ScholarshipReport`: usar el mismo hook y, si `!canSubmit`, mostrar un mensaje en lugar del formulario.

---

## Open Questions

> [!IMPORTANT]
> **¿Qué campo select determina el control multi-envío?**
> Veo que en los formularios de estudiantes y graduados el campo clave es `"modalidad"`. ¿Siempre es el campo `modalidad` el que determina cuántos envíos se permiten? ¿O hay otros campos select que también aplican (por ejemplo, algún formulario que tenga un select de "tipo" o "nivel_academico")?

Esto es clave, el campo select que determina si es multi-envio o no es solo de lo modulos de estudiantes, becas y graduados pero el de docentes queda fuera, seria bueno hacer esto solo para esos modulos y no para docentes, este por defecto sera multi-envio

> [!IMPORTANT]
> **¿El control aplica solo a directores o también a admins?**
> Los admins actualmente no crean respuestas desde `ResponsesPanel` (el botón "Registrar Reporte" solo aparece para directores). ¿Los admins deberían poder crear respuestas sin restricción, o también deberían estar controlados?

Seria bueno que para el admin no haya esta restriccion, pero aun no es necesario tomarlo en cuenta, en un futuro se puede implementar.

> [!IMPORTANT]
> **¿Formularios tipo `hasBulk: true` siguen la misma regla?**
> Los templates con `hasBulk: true` usan un layout más ancho para envío masivo. ¿Estos formularios bulk también deben controlarse con la misma lógica, o la lógica bulk ya maneja esto de otra forma?

la logica bulk ya es esta deprecada, antes se usaba pero ahora ya casi no es necesario tomarlo en cuenta.

> [!IMPORTANT]
> **¿Se debe agregar un flag explícito en `FormTemplateDef`?**
> La inferencia automática (tiene select → multi, no tiene → single) es simple y no requiere cambios en Firestore. Pero si en el futuro hubiera un formulario con select que NO debería ser multi-envío, tendría problemas. ¿Preferirías un campo explícito como `allowMultipleSubmissions: boolean` en el template?

si, seria bueno tomarlo en cuenta para escalibilidad

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| [NEW] `src/features/reports/hooks/useSubmissionGuard.ts` | Nuevo hook con la lógica de control |
| [MODIFY] `ResponsesPanel.tsx` | Consumir el hook, deshabilitar botón, filtrar opciones usadas |
| [MODIFY] `student.tsx` | Consumir el hook, mostrar mensaje si no puede enviar |
| [MODIFY] `teacher.tsx` | Consumir el hook, mostrar mensaje si no puede enviar |
| [MODIFY] `graduates.tsx` | Consumir el hook, mostrar mensaje si no puede enviar |
| [MODIFY] `scholarship.tsx` | Consumir el hook, mostrar mensaje si no puede enviar |

## Plan de Verificación

1. Verificar que un formulario sin selects se bloquea después del primer envío
2. Verificar que un formulario con select permite un envío por opción
3. Verificar que las opciones ya usadas no aparecen en el select
4. Verificar que el botón muestra mensaje apropiado cuando está deshabilitado
5. Verificar que la edición de respuestas existentes sigue funcionando
6. Verificar que la eliminación de una respuesta "libera" la opción del select
