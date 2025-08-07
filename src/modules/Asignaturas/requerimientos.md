# Módulo: Gestión de Asignaturas

## 1. Resumen Ejecutivo

Este módulo tiene como objetivo permitir la creación, consulta, edición y eliminación de asignaturas en el sistema, así como su relación con otros elementos como planes de estudio, profesores o temas. Está orientado a coordinadores académicos y usuarios administrativos.

## 2. Objetivos del Módulo

- Gestionar la información académica básica de cada asignatura.

- Asociar asignaturas a planes de estudio y cuatrimestres.

- Relacionar asignaturas con profesores, temas y unidades didácticas.

- Facilitar la trazabilidad y organización curricular.

## 3. Actores del Sistema

| Actor       | Descripción                                              |
| ----------- | -------------------------------------------------------- |
| Coordinador | Puede crear, editar y eliminar asignaturas.              |
| Moderador   | Puede ver asignaturas y relacionarlas con otros módulos. |
| Profesor    | Solo puede visualizar las asignaturas asignadas.         |

## 4. Requerimientos Funcionales

### 4.1 Crear Asignatura

- RF-01: El coordinador puede registrar una nueva asignatura proporcionando:
  - Nombre
  - Carrera

### 4.2 Listar Asignaturas

- RF-02: Todos los roles pueden consultar la lista de asignaturas.

- RF-03: Se debe permitir filtrar por plan de estudios, semestre o tipo.

### 4.3 Editar Asignatura

- RF-04: El coordinador puede modificar los datos de una asignatura.

- RF-05: No se debe permitir editar una asignatura que esté ligada a clases activas o evaluaciones.

### 4.4 Eliminar Asignatura

- RF-06: El coordinador puede eliminar una asignatura si no está vinculada a ningún curso, clase o evaluación vigente.

### 4.5 Ver Detalles de Asignatura

- RF-07: El sistema debe permitir visualizar información detallada de cada asignatura, incluyendo vínculos con:
  - Temas registrados

## 5. Requerimientos No Funcionales

- RNF-01: El sistema debe validar claves únicas por asignatura.

- RNF-02: El sistema debe permitir búsquedas con respuesta menor a 1 segundo.

- RNF-03: El módulo debe estar integrado con el sistema de autenticación y roles.

- RNF-04: Toda acción crítica (eliminar, modificar) debe requerir confirmación.

## 6. Relaciones con Otros Módulos

| Módulo Relacionado | Tipo de Relación                                              |
| ------------------ | ------------------------------------------------------------- |
| Carga Academica    | Una asignatura pertenece a la carga academica de un profesor. |
| Temas              | Una asignatura contiene múltiples temas.                      |

## 7. Casos de Uso Clave

- CU-01: Crear nueva asignatura

- CU-02: Consultar lista de asignaturas (nombre, carrera, con paginacion, activas o inactivas)

- CU-04: Editar información de asignatura

- CU-05: Activar/Desactivar asignatura

- CU-06: Ver detalles de asignatura por ID

## 8. Modelo de Datos Básico (Resumen)

```typescript
interface Asignatura {
  id: string;
  nombre: string;
  carrera: string;
}
```

## 9. Validaciones Relevantes

El nombre no puede dos asignaturas con el mismo nombre con la misma carrera.

No se puede eliminar una asignatura ligada a evaluaciones existentes.

## 10. Extras

Para consultar sobre Temas por favor ir a su archivo
./src/modules/Temas/requerimientos.md
./src/modules/CargaAcademica/requerimientos.md (aun no construccion)
