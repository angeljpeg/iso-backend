# Modulo Asesorias

## Campos

- tema de asesoria
- fecha
- numero de alumnos
- nombre de un alumno
- duracion de la asesoria
- grupo
- nombre profesor
- cuatrimestre

## Relaciones

- CargaAcademica (ya viene con relaciones de usuarios, cuatrimestre y grupos)

## Reglas

Los profesores (profesor_tiempo_completo, profesor_asignatura) son quienes crean, editan y eliminan asesorias (no soft-delete)

## Endpoint principales

- crear asesoria
- actualizar asesoria
- eliminar asesoria
- obtener todas las asesorias (busqueda por nombre de profesores, nombre de cuatrimestres, nombre de grupos, nombre de temas, nombre de asignaturas, nombre de carreras, cuatrimestre actual)

- obtener asesoria por id
- obtener asesoria por carga academica id
