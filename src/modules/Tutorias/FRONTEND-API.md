# FRONTEND-API - Tutorias (Reportes clave)

Guía rápida para consumir desde el frontend los endpoints más importantes del módulo de Tutorías, enfocada en reportes y listados agregados.

## Autenticación y Roles

- Autenticación: Bearer JWT (`Authorization: Bearer <token>`)
- Roles requeridos:
  - Profesor: `PROFESOR_ASIGNATURA`, `PROFESOR_TIEMPO_COMPLETO`
  - Coordinador: `COORDINADOR` (necesario para exportación)

## Entidades base

### Tutoria

- `id: string (uuid)`
- `cuatrimestre: string`
- `nombreTutor: string`
- `grupo: string`
- `carrera: string`
- `fecha: string | Date`
- `fechaRevision?: string | Date`
- `observaciones?: string`
- `actividadesTutoriaGrupal?: string[]`
- `estado: 'en progreso' | 'completado'`
- `estadoRevision: 'sin revisar' | 'revisado' | 'revisando' | 'aceptado' | 'rechazado'`
- `cargaAcademicaId: string (uuid)`

### TutoriaDetalle

- `id: string (uuid)`
- `tutoriaId: string (uuid)`
- `nombreAlumno: string`
- `vulnerabilidad: 'academica' | 'personal' | 'socioeconomica'`
- `areaCanalizacion: 'Asesoria' | 'Medico' | 'Psicologo' | 'Estudiantiles' | 'Admon' | 'Vinculacion' | 'Direccion de Carrera' | 'Otra'`
- `fueAtendido: boolean`
- `causaNoAtencion?: string (enum)`
- `presentoMejoria: boolean`
- `causoBaja: boolean`
- `causaBaja?: string (enum)`

## Endpoints de Reportes - Tutorias

Base: `/reportes/tutorias`

### 1) GET /resumen-general

- Query opcional: `fechaDesde`, `fechaHasta` (ISO string), `carrera`, `profesorId`
- Respuesta:

```json
{
  "totalTutorias": 25,
  "totalDetalles": 120,
  "totalCarreras": 4,
  "totalProfesores": 10,
  "distribucionVulnerabilidad": {
    "academica": 50,
    "personal": 40,
    "socioeconomica": 30
  },
  "distribucionAreaCanalizacion": {
    "Asesoria": 30,
    "Psicologo": 20,
    "Medico": 10
  },
  "distribucionEstadoProfesor": { "en progreso": 12, "completado": 13 },
  "distribucionEstadoRevision": {
    "sin revisar": 8,
    "revisado": 10,
    "revisando": 3,
    "aceptado": 2,
    "rechazado": 2
  }
}
```

### 2) GET /por-vulnerabilidad

- Query opcional: `fechaDesde`, `fechaHasta`, `carrera`
- Respuesta (array):

```json
[
  {
    "tipo": "academica",
    "total": 50,
    "porcentaje": 41.67,
    "detalles": [
      {
        "id": "uuid",
        "nombreAlumno": "Juan Pérez",
        "carrera": "TIDSM",
        "nombreTutor": "Mtro. López",
        "fecha": "2024-05-10T00:00:00.000Z",
        "fueAtendido": true,
        "presentoMejoria": false,
        "causoBaja": false
      }
    ]
  }
]
```

### 3) GET /por-area

- Query opcional: `fechaDesde`, `fechaHasta`, `carrera`
- Respuesta (array): igual a `/por-vulnerabilidad` pero con `area`

### 4) GET /por-carrera

- Query opcional: `fechaDesde`, `fechaHasta`
- Respuesta (array):

```json
[
  {
    "carrera": "TIDSM",
    "totalDetalles": 40,
    "vulnerabilidad": { "academica": 20, "personal": 10, "socioeconomica": 10 },
    "areas": { "Asesoria": 12, "Psicologo": 8, "Medico": 5 }
  }
]
```

### 5) GET /por-profesor

- Query opcional: `fechaDesde`, `fechaHasta`, `profesorId`
- Respuesta (array):

```json
[
  {
    "profesorId": "uuid",
    "nombreProfesor": "Mtro. López",
    "totalTutorias": 5,
    "totalDetalles": 22,
    "vulnerabilidad": { "academica": 12, "personal": 6, "socioeconomica": 4 },
    "areas": { "Asesoria": 7, "Psicologo": 5 }
  }
]
```

### 6) GET /tendencias-mensuales

- Query: `anio` (default: actual), opcional `carrera`
- Respuesta (array 12 meses):

```json
[
  {
    "mes": "Enero",
    "totalTutorias": 4,
    "totalDetalles": 18,
    "variacionTutorias": -20.0,
    "variacionDetalles": 12.5
  }
]
```

### 7) GET /exportar-excel

- Solo `COORDINADOR`
- Query opcional: `fechaDesde`, `fechaHasta`, `carrera`, `profesorId`
- Respuesta: objeto con `datos` equivalentes a `/resumen-general` (el frontend arma el Excel).

## Endpoints CRUD existentes (referencia rápida)

- `POST /tutorias`
- `GET /tutorias` (filtros: `cuatrimestre`, `nombreTutor`, `grupo`, `carrera`, `estado`, `estadoRevision`, `cargaAcademicaId`)
- `GET /tutorias/:id`
- `PATCH /tutorias/:id`
- `PATCH /tutorias/:id/estado-revision`
- `DELETE /tutorias/:id`
- `POST /tutorias/:id/detalles`
- `GET /tutorias/:id/detalles`
- `GET /tutorias/detalles/:detalleId`
- `PATCH /tutorias/detalles/:detalleId`
- `DELETE /tutorias/detalles/:detalleId`

## Consideraciones de UI

- Listas y gráficos para vulnerabilidad y área.
- Filtros por rango de fechas, carrera y profesor.
- Acceso restringido por rol para exportación.
