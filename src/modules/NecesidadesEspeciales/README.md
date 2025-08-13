# Módulo de Necesidades Especiales

Este módulo permite gestionar el registro de requisitos para las necesidades especiales de educación de los alumnos.

## Características

- **Registro completo** de necesidades especiales con todos los campos requeridos
- **Validación de datos** con DTOs y decoradores de validación
- **Búsquedas avanzadas** con múltiples filtros
- **Relación con carga académica** para vincular con alumnos específicos
- **Soft delete** para mantener historial de registros
- **Control de acceso** basado en roles (admin, profesor, coordinador)

## Campos del Registro

### Información Básica

- **Fecha**: Fecha del registro
- **Nombre del Alumno**: Nombre completo del estudiante
- **Número de Matrícula**: Identificador único del alumno
- **Programa Educativo**: Carrera o programa de estudio
- **Fecha de Revisión**: Fecha en que se revisó el registro
- **Número de Revisión**: Número secuencial de la revisión

### Tipos de Necesidades Especiales

#### 1. Excepciones Conductuales

- Agitación, agresividad, deambulación errática
- Vocalizaciones repetidas, desinhibición verbal y conductual
- Trastornos de la alimentación y del sueño

#### 2. Excepciones Comunicacionales

- Dificultad para transmitir mensajes
- Dificultad para entender significados
- Trastorno mixto del lenguaje receptivo-expresivo

#### 3. Excepciones Intelectuales

- Limitaciones en funcionamiento mental
- Cuidado personal y destrezas sociales

#### 4. Excepciones Físicas

- Discapacidad motriz y sensorial (auditiva, visual)
- Problemas cardíacos y otras enfermedades

#### 5. Excepciones de Superdotación

- Habilidad intelectual significativamente elevada

#### 6. Otras Necesidades

- Campo libre para especificar necesidades adicionales

## Endpoints Disponibles

### POST `/necesidades-especiales`

Crear un nuevo registro de necesidades especiales.

**Roles permitidos**: admin, profesor, coordinador

### GET `/necesidades-especiales`

Obtener todos los registros con filtros opcionales.

**Parámetros de consulta**:

- `nombreAlumno`: Filtrar por nombre del alumno
- `numeroMatricula`: Filtrar por número de matrícula
- `programaEducativo`: Filtrar por programa educativo
- `nombreProfesor`: Filtrar por nombre del profesor
- `cargaAcademicaId`: Filtrar por ID de carga académica
- `excepcionesConductuales`: Filtrar por excepciones conductuales
- `excepcionesComunicacionales`: Filtrar por excepciones comunicacionales
- `excepcionesIntelectuales`: Filtrar por excepciones intelectuales
- `excepcionesFisicas`: Filtrar por excepciones físicas
- `excepcionesSuperdotacion`: Filtrar por excepciones de superdotación
- `fechaDesde` y `fechaHasta`: Filtrar por rango de fechas
- `page` y `limit`: Paginación

**Roles permitidos**: admin, profesor, coordinador

### GET `/necesidades-especiales/:id`

Obtener un registro específico por ID.

**Roles permitidos**: admin, profesor, coordinador

### GET `/necesidades-especiales/carga-academica/:cargaAcademicaId`

Obtener todos los registros de necesidades especiales para una carga académica específica.

**Roles permitidos**: admin, profesor, coordinador

### PATCH `/necesidades-especiales/:id`

Actualizar un registro existente.

**Roles permitidos**: admin, profesor, coordinador

### DELETE `/necesidades-especiales/:id`

Eliminar un registro (soft delete).

**Roles permitidos**: admin, coordinador

## Estructura de Archivos

```
src/modules/NecesidadesEspeciales/
├── entities/
│   ├── necesidades-especiales.entity.ts
│   └── index.ts
├── dto/
│   ├── create-necesidades-especiales.dto.ts
│   ├── update-necesidades-especiales.dto.ts
│   ├── query-necesidades-especiales.dto.ts
│   ├── necesidades-especiales-response.dto.ts
│   └── index.ts
├── necesidades-especiales.service.ts
├── necesidades-especiales.controller.ts
├── necesidades-especiales.module.ts
├── index.ts
└── README.md
```

## Relaciones

- **CargaAcademica**: Cada registro de necesidades especiales está vinculado a una carga académica específica
- **Usuario**: A través de la carga académica se puede acceder a la información del profesor

## Validaciones

- Todos los campos obligatorios están validados
- Las fechas se validan como fechas válidas
- Los campos de texto tienen límites de longitud apropiados
- Se valida la existencia de la carga académica antes de crear/actualizar

## Seguridad

- Autenticación JWT requerida para todos los endpoints
- Control de acceso basado en roles
- Solo administradores y coordinadores pueden eliminar registros
- Los profesores pueden crear, leer y actualizar registros

## Uso del Módulo

### 1. Importar en AppModule

```typescript
import { NecesidadesEspecialesModule } from './modules/NecesidadesEspeciales/necesidades-especiales.module';

@Module({
  imports: [
    // ... otros módulos
    NecesidadesEspecialesModule,
  ],
})
export class AppModule {}
```

### 2. Ejecutar Seeds

```typescript
import { seedNecesidadesEspeciales } from './seeds/necesidades-especiales.seed';

// En tu función de seed principal
await seedNecesidadesEspeciales(dataSource);
```

## Ejemplos de Uso

### Crear un registro

```typescript
const createDto = {
  fecha: new Date(),
  nombreAlumno: 'Juan Pérez',
  numeroMatricula: '2024001',
  programaEducativo: 'Ingeniería en Sistemas',
  fechaRevision: new Date(),
  numeroRevision: 1,
  excepcionesConductuales: true,
  especificacionConductual: 'Requiere ambiente tranquilo durante exámenes',
  excepcionesComunicacionales: false,
  excepcionesIntelectuales: false,
  excepcionesFisicas: false,
  excepcionesSuperdotacion: false,
  cargaAcademicaId: 1,
};

const necesidades = await necesidadesEspecialesService.create(createDto);
```

### Buscar con filtros

```typescript
const queryDto = {
  programaEducativo: 'Ingeniería en Sistemas',
  excepcionesConductuales: true,
  page: 1,
  limit: 10,
};

const resultado = await necesidadesEspecialesService.findAll(queryDto);
```

## Notas de Implementación

- El módulo utiliza TypeORM para la persistencia de datos
- Implementa soft delete para mantener historial
- Incluye paginación en las consultas
- Maneja errores apropiadamente con códigos HTTP correctos
- Documentación completa con Swagger/OpenAPI
