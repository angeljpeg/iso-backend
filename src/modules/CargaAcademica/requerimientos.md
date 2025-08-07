## 1. Resumen Ejecutivo

El módulo de Carga Académica permite asignar a los profesores las materias (asignaturas) que impartirán a cada grupo durante un cuatrimestre. Esta relación es fundamental para la gestión del calendario, horarios, evaluaciones y seguimiento académico.

## 2. Objetivos del Módulo

- Asignar de manera explícita qué profesor imparte qué asignatura a qué grupo.
- Validar que un mismo profesor no tenga asignaciones duplicadas.
- Permitir consultar y gestionar fácilmente la carga académica de cualquier docente.
- Integrarse con los módulos de grupos, profesores, asignaturas y cuatrimestres.

## 3. Actores del Sistema

| Actor       | Descripción                                                     |
| ----------- | --------------------------------------------------------------- |
| Coordinador | Puede crear, editar y eliminar asignaciones de carga académica. |
| Moderador   | Puede visualizar la carga académica.                            |
| Profesor    | Puede consultar su propia carga académica.                      |

## 4. Requerimientos Funcionales

### 4.1 Asignar Carga Académica

- RF-01: El coordinador puede registrar una asignación proporcionando:
  - Profesor (profesor_id)
  - Asignatura (asignatura_id)
  - Grupo (grupo_id)

- RF-02: El sistema debe validar que no exista una asignación duplicada con la misma combinación de profesor, grupo y asignatura.

- RF-03: El sistema debe asociar automáticamente la relación al cuatrimestre del grupo.

### 4.2 Listar Carga Académica

- RF-04: Se debe poder consultar la carga académica por:
  - Profesor
  - Cuatrimestre
  - Grupo
  - Asignatura

### 4.3 Editar Carga Académica

- RF-05: El coordinador puede modificar la asignatura o el grupo asignado a un profesor.

### .4 Eliminar Asignación

- RF-06: El coordinador puede eliminar una asignación si no tiene evaluaciones ligadas (opcional según la lógica del sistema).

### 4.5 Ver Carga de un Profesor

- RF-07: El sistema debe mostrar al profesor sus asignaturas, grupos y cuatrimestres correspondientes.

## 5. Requerimientos No Funcionales

- RNF-01: La combinación profesor_id + grupo_id + asignatura_id debe ser única.
- RNF-02: Las asignaciones deben cargarse en menos de 1 segundo por búsqueda.
- RNF-03: Todas las acciones deben ser auditables.

## 6. Relaciones con Otros Módulos

| Módulo Relacionado | Relación                                              |
| ------------------ | ----------------------------------------------------- |
| Profesores         | Cada asignación pertenece a un profesor.              |
| Asignaturas        | Cada asignación refiere a una materia impartida.      |
| Grupos             | Cada asignación refiere al grupo que recibe la clase. |
| Cuatrimestres      | Se deduce a partir del grupo (grupo → cuatrimestre).  |

## 7. Casos de Uso Clave

- CU-01: Asignar asignatura a profesor y grupo
- CU-02: Consultar carga académica de un profesor
- CU-03: Modificar asignación existente
- CU-04: Eliminar asignación inválida o duplicada
- CU-05: Ver resumen de carga por cuatrimestre

## 8. Modelo de Datos Básico (Resumen)

```typescript

CargaAcademica {
id: string;
profesor_id: string; // FK a Profesor
asignatura_id: string; // FK a Asignatura
grupo_id: string; // FK a Grupo
cuatrimestre_id: string; // Deducido desde Grupo
}
```

Nota: cuatrimestre_id puede inferirse desde el grupo_id, pero podría almacenarse explícitamente para eficiencia.

## 9. Validaciones Importantes

1. Unicidad de Asignación Exacta
   - No puede existir una asignación duplicada con la misma combinación de:
     - profesor_id
     - grupo_id
     - asignatura_id
     - ➤ Ejemplo inválido: Asignar dos veces a María Pérez la materia de “Matemáticas” en el grupo TI 1-1.

2. No duplicar carga entre profesores en un mismo grupo/cuatrimestre
   - No se debe permitir que más de un profesor tenga asignada la misma asignatura y grupo dentro del mismo cuatrimestre.
     - ➤ Esto evita conflictos de autoría o responsabilidad de clase.
     - ➤ Ejemplo inválido: Asignar “Programación I” al grupo TI 2-1 del cuatrimestre Enero 2025 - Abril 2025 a dos profesores distintos.

3. Referencias válidas y activas
   - El profesor_id, grupo_id y asignatura_id deben hacer referencia a registros existentes y marcados como activos en sus respectivos módulos.

4. Verificación del cuatrimestre del grupo
   - El grupo debe estar asociado a un cuatrimestre válido (es decir, que no esté eliminado, expirado sin autorización, o malformado).

5. Evitar asignaciones en cuatrimestres pasados
   - No se deben crear asignaciones nuevas en cuatrimestres ya finalizados sin autorización especial.

## 10. Ejemplo de Asignación

| Profesor            | Asignatura       | Grupo  | Cuatrimestre            |
| ------------------- | ---------------- | ------ | ----------------------- |
| Prof. María López   | Programación I   | TI 1-1 | Enero 2025 - Abril 2025 |
| Prof. Daniel García | Bases de Datos I | TI 1-1 | Enero 2025 - Abril 2025 |
| Prof. Ana Ruiz      | Programación I   | TI 1-2 | Enero 2025 - Abril 2025 |
