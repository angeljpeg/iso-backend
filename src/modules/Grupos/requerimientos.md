## 1. Resumen Ejecutivo

El módulo de Grupos permite la creación, consulta, edición y eliminación de los grupos escolares dentro de una institución educativa. Cada grupo está definido por su carrera, cuatrimestre y número secuencial (cuando existen varios grupos del mismo nivel). Este módulo es esencial para organizar asignaciones académicas, profesores y estudiantes.

## 2. Objetivos del Módulo

- Permitir registrar grupos por carrera y cuatrimestre.
- Asignar un número de grupo para diferenciar entre múltiples grupos del mismo nivel.
- Generar automáticamente un nombre legible y estandarizado para cada grupo.
- Integrarse con módulos de asignaturas, usuarios, carga académica, entre otros.

## 3. Actores del Sistema

| Actor       | Descripción                                |
| ----------- | ------------------------------------------ |
| Coordinador | Puede crear, editar y eliminar grupos.     |
| Moderador   | Puede visualizar grupos.                   |
| Profesor    | Solo puede visualizar los grupos asignados |

## 4. Requerimientos Funcionales

### 4.1 Crear Grupo

- RF-01: El coordinador puede registrar un grupo proporcionando:
  - Carrera (seleccionada de un catálogo)
  - Número de cuatrimestre (ej. 1, 2, 3…)
  - Número de grupo (ej. 1, 2, 3…)
- RF-02: El sistema generará automáticamente el nombre del grupo con la siguiente estructura:

```less
[Siglas Carrera] [Número Grupo] - [Número Cuatrimestre]
Ejemplo: TI 2 - 1 → Tecnologías de la Información, segundo grupo del primer cuatrimestre
```

### 4.2 Listar Grupos

- RF-03: El sistema debe mostrar una lista de todos los grupos registrados, con filtros por:
  - Carrera
  - Cuatrimestre
  - Año académico (si aplica)

### 4.3 Editar Grupo

- RF-04: El coordinador puede modificar la carrera, cuatrimestre o número de grupo.
- RF-05: Al editar, se debe actualizar el nombre automáticamente según los nuevos valores.

### 4.4 Eliminar Grupo

- RF-06: El coordinador puede eliminar un grupo solo si no está asociado a clases activas o estudiantes asignados.

### 4.5 Ver Detalles de Grupo

- RF-07: Se puede visualizar la información completa de un grupo, incluyendo:
  - Nombre
  - Carrera
  - Cuatrimestre
  - Número de grupo
  - Estudiantes asociados (opcional)
  - Asignaturas asignadas (opcional)

## 5. Requerimientos No Funcionales

- RNF-01: El nombre debe generarse dinámicamente y mostrarse en interfaces de usuario.
- RNF-02: La gestión debe responder en menos de 1 segundo por acción CRUD.

## 6. Casos de Uso Clave

- CU-01: Crear nuevo grupo académico
- CU-02: Consultar grupos existentes
- CU-03: Editar grupo existente
- CU-04: Eliminar grupo no vinculado
- CU-05: Ver detalles de un grupo

## 7. Validaciones

- El número de cuatrimestre debe estar entre 1 y el total permitido por la carrera (15).
- El número de grupo debe ser positivo (mínimo 1).

## 8. Ejemplos de Grupos Válidos

| Carrera                            | Cuatrimestre | Número Grupo | Nombre generado |
| ---------------------------------- | ------------ | ------------ | --------------- |
| Tecnologías de la Información (TI) | 1            | 1            | TI 1 - 1        |
| Tecnologías de la Información (TI) | 1            | 2            | TI 2 - 1        |
| Contaduría Pública (CP)            | 3            | 1            | CP 1 - 3        |
