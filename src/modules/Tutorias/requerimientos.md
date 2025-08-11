# Modulo Tutorias

## Campos

- Cuatrimestre
- Nombre del Tutor
- Grupo
- Carrera
- Fecha (terminado)
- Fecha (revision)

- Nombre del Alumnos
- Vulnerabilidad
- area en la que fue canalizados el problema
- fue antendido por el area (si o no)
- causa del porque no
- presento mejoria (si o no)
- Causo baja (si o no)
- Causa de baja
- observaciones (opcional)
- actividades de tutoria grupal (5)

### Campos (enums, const, etc)

- vulnerabilidades:
  1. academica
  2. personal
  3. socioeconomica

- areas

1. Asesoria
2. Medico
3. Psicologo
4. Estudiantiles
5. Admon
6. Vinculacion
7. Direccion de Carrera
8. Otra

- Causas por las que no fue atendido:

1. No había personal que atendiera en el área
2. El alumno no asistió al área canalizada.

- causa de baja:

1. Sin causa conocida.
2. Incumplimiento de expectativas.
3. Reprobación.
4. Problemas económicos.
5. Motivos personales.
6. Distancia de la UT.
7. Problemas de trabajo.
8. Cambio de UT.
9. Cambio de carrera.
10. Faltas al reglamento escolar.
11. Otras causas ( específique en Observaciones)

- estado (profesor):

1. en progreso
2. completado

- estado revision (coordinador):

1. sin revisar
2. revisado
3. revisando
4. aceptado
5. rechazado

## Reglas

- El profesor puede agregar un alumno a las tutorias y a lo largo del cuatrimestre responde los detalles

## Relaciones

- Modulo CargaAcademica (ya tiene todas las relaciones)

## Endpoints principales

Crear tutoria
Crear Detalles
Editar Tutoria
Editar Detalles
Eliminar Tutoria (No Softdelete)
Eliminar Detalles (No Softdelete)

Buscar todas las tutorias (Nombre carrera - Nombre profesor - nombre cuatrimestre - Nombre Grupo)

Tutoria por ID
Detalle por ID
Detalles por Tutoria
Tutoria por carga academica
