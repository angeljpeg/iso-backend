# Módulo de Tutorias

Este módulo gestiona las sesiones de tutoría académica y el seguimiento individual de los estudiantes.

## Características Principales

- **Gestión de Sesiones de Tutoría**: Crear, editar y eliminar sesiones de tutoría
- **Seguimiento de Estudiantes**: Agregar y gestionar detalles individuales de cada estudiante
- **Estados de Progreso**: Control del estado del profesor y revisión del coordinador
- **Estadísticas**: Reportes por vulnerabilidad y área de canalización
- **Filtros Avanzados**: Búsquedas por múltiples criterios

## Estructura del Módulo

```
Tutorias/
├── entities/           # Entidades de base de datos
├── dto/               # DTOs para validación de datos
├── services/          # Lógica de negocio
├── tutorias.controller.ts    # Controlador principal
├── tutorias.module.ts        # Configuración del módulo
└── README.md          # Este archivo
```

## Entidades

### Tutoria

- **Campos principales**: cuatrimestre, nombreTutor, grupo, carrera, fecha
- **Campos adicionales**: fechaRevision, observaciones, actividadesTutoriaGrupal
- **Estados**: estado (profesor) y estadoRevision (coordinador)
- **Relaciones**: CargaAcademica (ManyToOne), TutoriaDetalle (OneToMany)

### TutoriaDetalle

- **Campos del estudiante**: nombreAlumno, vulnerabilidad, areaCanalizacion
- **Campos de seguimiento**: fueAtendido, causaNoAtencion, presentoMejoria, causoBaja, causaBaja
- **Relaciones**: Tutoria (ManyToOne)

## Enums

### Vulnerabilidad

- `academica` - Problemas académicos
- `personal` - Problemas personales
- `socioeconomica` - Problemas socioeconómicos

### AreaCanalizacion

- `Asesoria` - Servicios de asesoría
- `Medico` - Servicios médicos
- `Psicologo` - Servicios psicológicos
- `Estudiantiles` - Servicios estudiantiles
- `Admon` - Administración
- `Vinculacion` - Vinculación
- `Direccion de Carrera` - Dirección de carrera
- `Otra` - Otras áreas

### EstadoProfesor

- `en progreso` - Tutoria en desarrollo
- `completado` - Tutoria finalizada

### EstadoRevision

- `sin revisar` - Pendiente de revisión
- `revisado` - Revisado por coordinador
- `revisando` - En proceso de revisión
- `aceptado` - Aceptado por coordinador
- `rechazado` - Rechazado por coordinador

## Endpoints

### Tutorias

#### CRUD Principal

- `POST /tutorias` - Crear tutoria
- `GET /tutorias` - Obtener todas las tutorias (con filtros)
- `GET /tutorias/:id` - Obtener tutoria por ID
- `PATCH /tutorias/:id` - Actualizar tutoria
- `DELETE /tutorias/:id` - Eliminar tutoria

#### Búsquedas Especializadas

- `GET /tutorias/profesor/:nombreTutor` - Por profesor
- `GET /tutorias/carrera/:carrera` - Por carrera
- `GET /tutorias/cuatrimestre/:cuatrimestre` - Por cuatrimestre
- `GET /tutorias/carga-academica/:cargaAcademicaId` - Por carga académica

#### Gestión de Estados

- `PATCH /tutorias/:id/estado-revision` - Actualizar estado de revisión

### Detalles de Tutoria

#### CRUD de Detalles

- `POST /tutorias/:id/detalles` - Crear detalle
- `GET /tutorias/:id/detalles` - Obtener detalles de una tutoria
- `GET /tutorias/detalles/:detalleId` - Obtener detalle por ID
- `PATCH /tutorias/detalles/:detalleId` - Actualizar detalle
- `DELETE /tutorias/detalles/:detalleId` - Eliminar detalle

### Estadísticas

- `GET /tutorias/estadisticas/vulnerabilidad` - Estadísticas por vulnerabilidad
- `GET /tutorias/estadisticas/area-canalizacion` - Estadísticas por área

## Validaciones de Negocio

### Creación de Tutoria

- Los estados se establecen por defecto: `en progreso` para profesor, `sin revisar` para coordinador
- Se valida la existencia de la carga académica

### Actualización de Tutoria

- No se puede marcar como completada si hay estudiantes sin atender
- Al completar, se actualiza automáticamente la fecha de revisión

### Gestión de Detalles

- Si un estudiante no fue atendido, debe especificar la causa
- Si un estudiante causó baja, debe especificar la causa

### Estados de Revisión

- No se puede cambiar el estado de una tutoria ya aceptada o rechazada
- Solo se permiten transiciones válidas de estado

## Uso del Módulo

### 1. Crear una Tutoria

```typescript
const nuevaTutoria = await tutoriasService.create({
  cuatrimestre: 'Primer Cuatrimestre 2024',
  nombreTutor: 'Dr. Juan Pérez',
  grupo: 'A',
  carrera: 'Ingeniería en Sistemas',
  fecha: '2024-01-15',
  observaciones: 'Sesión inicial de tutoría',
  actividadesTutoriaGrupal: ['Presentación', 'Diagnóstico grupal'],
  cargaAcademicaId: 1,
});
```

### 2. Agregar Detalles de Estudiante

```typescript
const detalle = await tutoriaDetallesService.create({
  nombreAlumno: 'María García',
  vulnerabilidad: Vulnerabilidad.ACADEMICA,
  areaCanalizacion: AreaCanalizacion.ASESORIA,
  fueAtendido: true,
  presentoMejoria: false,
  causoBaja: false,
  tutoriaId: 1,
});
```

### 3. Actualizar Estado de Revisión

```typescript
await tutoriasService.updateEstadoRevision(1, EstadoRevision.REVISADO);
```

## Filtros de Búsqueda

El endpoint `GET /tutorias` acepta los siguientes parámetros de consulta:

- `cuatrimestre` - Filtrar por cuatrimestre
- `nombreTutor` - Filtrar por nombre del tutor
- `grupo` - Filtrar por grupo
- `carrera` - Filtrar por carrera
- `estado` - Filtrar por estado del profesor
- `estadoRevision` - Filtrar por estado de revisión
- `cargaAcademicaId` - Filtrar por ID de carga académica

## Relaciones

- **CargaAcademica**: Cada tutoria está asociada a una carga académica
- **TutoriaDetalle**: Una tutoria puede tener múltiples detalles de estudiantes
- **Cascada**: Al eliminar una tutoria, se eliminan todos sus detalles

## Notas de Implementación

- No se implementa soft delete (eliminación permanente)
- Los timestamps se generan automáticamente
- Las validaciones se realizan tanto a nivel de DTO como de servicio
- Se incluye documentación completa con Swagger
- Los enums están tipados para TypeScript
