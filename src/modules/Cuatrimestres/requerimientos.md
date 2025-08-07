## 1. Resumen Ejecutivo

El módulo de Cuatrimestres permite registrar los periodos académicos en la plataforma. Cada cuatrimestre se define por su fecha de inicio y fecha de fin, a partir de las cuales se genera automáticamente un nombre descriptivo. Este módulo es clave para la planificación académica, inscripción de grupos y asignación de clases.

## 2. Objetivos del Módulo

Registrar nuevos cuatrimestres con validación de duración.

Generar automáticamente un nombre legible basado en las fechas de inicio y fin.

Garantizar que los cuatrimestres tengan una duración de 4 meses.

Permitir la visualización de periodos activos e históricos.

## 3. Actores del Sistema

| Actor       | Descripción                                   |
| ----------- | --------------------------------------------- |
| Coordinador | Puede crear, editar y eliminar cuatrimestres. |
| Moderador   | Puede visualizar los cuatrimestres.           |

## 4. Requerimientos Funcionales

### 4.1 Crear Cuatrimestre

- RF-01: El coordinador puede registrar un nuevo cuatrimestre proporcionando:
  - Fecha de inicio
  - Fecha de fin

- RF-02: El sistema debe validar que exista una diferencia exacta de 4 meses entre ambas fechas (±3 días de tolerancia si aplica).

- RF-03: El sistema debe generar automáticamente el nombre con el siguiente formato:
  [Mes Inicio] [Año Inicio] - [Mes Fin] [Año Fin]
  Ejemplo: Enero 2025 - Abril 2025

### 4.2 Listar Cuatrimestres

- RF-04: El sistema debe mostrar una lista de cuatrimestres ordenados por fecha de inicio descendente.

- RF-05: Se puede filtrar por año o rango de fechas.

### 4.3 Editar Cuatrimestre

- RF-06: El coordinador puede modificar la fecha de inicio o fin si el cuatrimestre no está en uso por grupos activos.
- RF-07: Al modificar fechas, el nombre se debe regenerar automáticamente.

### 4.4 Eliminar Cuatrimestre

- RF-08: El coordinador puede eliminar cuatrimestres que no estén asociados a ningún grupo, asignatura o clase.
- RF-09: Se debe confirmar la eliminación.

### 4.5 Ver Detalles de Cuatrimestre

- RF-10: Se debe permitir visualizar:
  - Nombre generado
  - Fecha de inicio
  - Fecha de fin
  - Estado (Activo / Finalizado / Próximo)

## 5. Requerimientos No Funcionales

- RNF-01: El nombre generado debe estar disponible en todos los módulos que muestren períodos.
- RNF-02: El sistema debe rechazar fechas con duración menor o mayor a 4 meses ±10 días.
- RNF-03: Las fechas deben manejarse en formato ISO (YYYY-MM-DD) internamente.

## 6. Casos de Uso Clave

- CU-01: Registrar nuevo cuatrimestre
- CU-02: Consultar cuatrimestres disponibles
- CU-03: Editar fechas de cuatrimestre
- CU-04: Eliminar cuatrimestre sin uso
- CU-05: Visualizar información detallada del periodo

## 7. Reglas y Validaciones

- La duración entre fecha_inicio y fecha_fin debe ser de 4 meses (±3 días).
- nombre se genera automáticamente en el formato:
  - [Mes inicio] [Año inicio] - [Mes fin] [Año fin]
- No puede haber cuatrimestres superpuestos en fechas.
- No se puede eliminar un cuatrimestre con datos asociados.

## 8. Ejemplos de Nombre Generado

| Fecha Inicio | Fecha Fin  | Nombre generado                  |
| ------------ | ---------- | -------------------------------- |
| 2025-01-12   | 2025-04-15 | Enero 2025 - Abril 2025          |
| 2025-05-01   | 2025-08-01 | Mayo 2025 - Agosto 2025          |
| 2025-09-05   | 2025-12-05 | Septiembre 2025 - Diciembre 2025 |
