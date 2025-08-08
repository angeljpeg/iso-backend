# Módulo de Estadías

Este módulo permite a los profesores llevar un control de las estadías de los alumnos, basándose en la estructura de la tabla de Excel proporcionada.

## Estructura del Módulo

### Entidades

1. **Estadia**: Representa una estadía con su profesor responsable y período
2. **EstadiaAlumno**: Representa un alumno inscrito en una estadía
3. **ProgresoMensual**: Representa el progreso de un alumno en un mes específico

### Funcionalidades

- Crear y gestionar estadías
- Registrar alumnos en estadías
- Evaluar el progreso mensual de cada alumno (4 meses)
- Registrar acciones tomadas cuando un alumno no muestra avance
- Generar reportes completos

## Endpoints Disponibles

### Estadías

- `POST /estadias` - Crear nueva estadía
- `GET /estadias` - Obtener todas las estadías (Coordinadores/Moderadores)
- `GET /estadias/profesor` - Obtener estadías del profesor autenticado
- `GET /estadias/:id` - Obtener estadía específica
- `PATCH /estadias/:id` - Actualizar estadía
- `DELETE /estadias/:id` - Eliminar estadía (soft delete)

### Alumnos de Estadía

- `POST /estadias/alumnos` - Agregar alumno a estadía
- `GET /estadias/alumnos/all` - Obtener todos los alumnos (Coordinadores/Moderadores)
- `GET /estadias/alumnos/estadia/:estadiaId` - Obtener alumnos de una estadía
- `GET /estadias/alumnos/:id` - Obtener alumno específico
- `PATCH /estadias/alumnos/:id` - Actualizar alumno
- `DELETE /estadias/alumnos/:id` - Eliminar alumno (soft delete)

### Progreso Mensual

- `POST /estadias/progreso` - Registrar progreso mensual
- `GET /estadias/progreso/alumno/:estadiaAlumnoId` - Obtener progreso de un alumno
- `GET /estadias/progreso/:id` - Obtener progreso específico
- `PATCH /estadias/progreso/:id` - Actualizar progreso
- `DELETE /estadias/progreso/:id` - Eliminar progreso

### Reportes

- `GET /estadias/reporte/:estadiaId` - Obtener reporte completo de una estadía

## Estructura de Datos

### Crear Estadía
```json
{
  "nombreProfesor": "Dr. Juan Pérez",
  "periodo": "2024-1",
  "observacionesGenerales": "Estadía en desarrollo de software"
}
```

### Agregar Alumno
```json
{
  "nombreAlumno": "María García",
  "matricula": "2024001",
  "carrera": "Ingeniería en Sistemas",
  "estadiaId": "uuid-de-la-estadia",
  "observacionesGenerales": "Alumna destacada"
}
```

### Registrar Progreso Mensual
```json
{
  "estadiaAlumnoId": "uuid-del-alumno",
  "mes": 1,
  "avance": "si",
  "accionesTomadas": "Se realizaron sesiones de asesoría adicionales",
  "fechaEvaluacion": "2024-02-15",
  "observaciones": "Excelente progreso en el desarrollo del proyecto"
}
```

## Roles y Permisos

- **Profesores**: Pueden crear y gestionar sus propias estadías, alumnos y progreso
- **Coordinadores/Moderadores**: Pueden ver todas las estadías y generar reportes

## Validaciones

- No se puede registrar progreso duplicado para el mismo alumno y mes
- Los profesores solo pueden gestionar sus propias estadías
- Validación de datos requeridos en todos los endpoints
