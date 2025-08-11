# Sistema de Reportes - Programación y Seguimiento de Cursos

## Descripción General

El sistema de reportes del módulo de Programación y Seguimiento de Cursos proporciona capacidades avanzadas de análisis y generación de reportes con filtros personalizables, métricas agregadas y análisis detallado del progreso académico.

## Características Principales

### 🎯 **Reportes Disponibles**

1. **Reporte General de Seguimientos** - Vista completa de todos los seguimientos
2. **Reporte de Avance** - Análisis detallado por tema y semana
3. **Reporte de Notificaciones** - Estadísticas del sistema de notificaciones
4. **Reporte Estadístico** - Métricas agregadas con agrupaciones personalizables
5. **Reporte de Retrasos** - Análisis específico de retrasos y patrones
6. **Reporte de Completitud** - Métricas de calidad y progreso
7. **Reporte de Dashboard** - Vista consolidada para dashboards

### 🔍 **Filtros Avanzados**

- **Por Cuatrimestre**: Filtra por período académico específico
- **Por Profesor**: Filtra por docente responsable
- **Por Asignatura**: Filtra por materia específica
- **Por Grupo**: Filtra por grupo de estudiantes
- **Por Estado**: Filtra por estado del seguimiento
- **Por Semana**: Filtra por semana específica
- **Por Rango de Fechas**: Filtra por período temporal
- **Por Retrasos**: Filtra solo seguimientos con retrasos
- **Por Completitud**: Filtra por porcentaje de avance

### 📊 **Métricas y Análisis**

- **Distribuciones**: Por estado, avance, completitud
- **Tendencias Temporales**: Análisis por semana, mes, cuatrimestre
- **Análisis de Retrasos**: Patrones, causas, acciones correctivas
- **Métricas de Calidad**: Observaciones, evidencias, acciones
- **Agrupaciones Personalizables**: Por semana, asignatura, grupo

## Endpoints Disponibles

### Base URL: `/api/reportes-seguimiento`

#### 1. Reporte General de Seguimientos

```
GET /seguimientos
```

**Roles**: COORDINADOR, DIRECTOR

**Parámetros de Query**:

- `cuatrimestreId` (UUID, opcional)
- `profesorId` (UUID, opcional)
- `asignaturaId` (UUID, opcional)
- `grupoId` (UUID, opcional)
- `estado` (enum, opcional)
- `semana` (number, opcional)
- `fechaInicio` (date, opcional)
- `fechaFin` (date, opcional)
- `conRetrasos` (boolean, opcional)
- `pendientesRevision` (boolean, opcional)
- `incluirDetalles` (boolean, opcional, default: false)

#### 2. Reporte de Avance

```
GET /avance
```

**Roles**: COORDINADOR, DIRECTOR, PROFESOR

**Parámetros de Query**:

- Todos los del reporte general
- `estadoAvance` (enum, opcional)
- `tema` (string, opcional)

#### 3. Reporte de Notificaciones

```
GET /notificaciones
```

**Roles**: COORDINADOR, DIRECTOR

**Parámetros de Query**:

- `usuarioId` (UUID, opcional)
- `tipo` (enum, opcional)
- `estado` (enum, opcional)
- `fechaInicio` (date, opcional)
- `fechaFin` (date, opcional)
- `noLeidas` (boolean, opcional)

#### 4. Reporte Estadístico

```
GET /estadisticas
```

**Roles**: COORDINADOR, DIRECTOR

**Parámetros de Query**:

- Todos los del reporte general
- `agruparPorSemana` (boolean, opcional)
- `agruparPorAsignatura` (boolean, opcional)
- `agruparPorGrupo` (boolean, opcional)

#### 5. Reporte de Retrasos

```
GET /retrasos
```

**Roles**: COORDINADOR, DIRECTOR, PROFESOR

**Parámetros de Query**:

- Todos los del reporte de avance
- `diasRetrasoMinimo` (number, opcional, default: 1)
- `incluirJustificaciones` (boolean, opcional, default: true)
- `incluirAccionesCorrectivas` (boolean, opcional, default: true)

#### 6. Reporte de Completitud

```
GET /completitud
```

**Roles**: COORDINADOR, DIRECTOR, PROFESOR

**Parámetros de Query**:

- Todos los del reporte general
- `porcentajeMinimo` (number, opcional, default: 0)
- `porcentajeMaximo` (number, opcional, default: 100)
- `incluirMetricasCalidad` (boolean, opcional, default: false)

#### 7. Reporte de Dashboard

```
GET /dashboard
```

**Roles**: COORDINADOR, DIRECTOR, PROFESOR

**Descripción**: Reporte consolidado con las métricas más importantes para dashboards.

#### 8. Exportación de Reportes

```
GET /exportar/:tipo
```

**Roles**: COORDINADOR, DIRECTOR

**Tipos de Exportación**: CSV, Excel, PDF (en desarrollo)

## Ejemplos de Uso

### Ejemplo 1: Reporte de Seguimientos por Cuatrimestre

```bash
GET /api/reportes-seguimiento/seguimientos?cuatrimestreId=123e4567-e89b-12d3-a456-426614174000&incluirDetalles=true
```

### Ejemplo 2: Reporte de Retrasos por Profesor

```bash
GET /api/reportes-seguimiento/retrasos?profesorId=123e4567-e89b-12d3-a456-426614174000&incluirJustificaciones=true
```

### Ejemplo 3: Reporte Estadístico con Agrupaciones

```bash
GET /api/reportes-seguimiento/estadisticas?agruparPorSemana=true&agruparPorAsignatura=true
```

### Ejemplo 4: Reporte de Completitud con Métricas de Calidad

```bash
GET /api/reportes-seguimiento/completitud?porcentajeMinimo=50&incluirMetricasCalidad=true
```

## Estructura de Respuesta

### Reporte General de Seguimientos

```json
{
  "totalSeguimientos": 150,
  "resumenPorEstado": {
    "borrador": 25,
    "enviado": 45,
    "revisado": 35,
    "aprobado": 30,
    "rechazado": 15
  },
  "resumenPorCuatrimestre": {
    "Primer Cuatrimestre 2024": 75,
    "Segundo Cuatrimestre 2024": 75
  },
  "resumenPorProfesor": {
    "Dr. Juan Pérez": 30,
    "Dra. María García": 25
  },
  "seguimientos": [...]
}
```

### Reporte de Avance

```json
{
  "totalDetalles": 450,
  "resumenPorEstado": {
    "no_iniciado": 50,
    "en_progreso": 150,
    "completado": 200,
    "retrasado": 50
  },
  "resumenPorSemana": {
    "1": 45,
    "2": 42,
    "3": 38
  },
  "resumenPorTema": {
    "Introducción": 30,
    "Fundamentos": 45,
    "Aplicaciones": 35
  },
  "detalles": [...]
}
```

### Reporte de Retrasos

```json
{
  "totalRetrasos": 50,
  "retrasosPorSemana": {
    "3": 15,
    "4": 20,
    "5": 15
  },
  "retrasosPorAsignatura": {
    "Matemáticas": 20,
    "Física": 15,
    "Química": 15
  },
  "analisisRetrasos": {
    "temasMasRetrasados": {
      "Cálculo Diferencial": 10,
      "Mecánica Clásica": 8
    },
    "semanasConMasRetrasos": {
      "4": 20
    }
  },
  "detalles": [...]
}
```

## Seguridad y Permisos

### Roles y Accesos

- **COORDINADOR**: Acceso completo a todos los reportes
- **DIRECTOR**: Acceso completo a todos los reportes
- **PROFESOR**: Acceso limitado a reportes de sus propias asignaturas

### Validaciones

- Autenticación JWT requerida
- Validación de roles por endpoint
- Filtrado automático por profesor para usuarios PROFESOR
- Validación de parámetros de entrada

## Optimizaciones y Rendimiento

### Consultas Optimizadas

- Uso de QueryBuilder de TypeORM
- Joins optimizados con relaciones eager/lazy
- Filtros aplicados a nivel de base de datos
- Paginación automática para grandes volúmenes

### Caching

- Los reportes pueden ser cacheados por filtros
- TTL configurable por tipo de reporte
- Invalidación automática en cambios de datos

## Extensibilidad

### Nuevos Tipos de Reportes

Para agregar nuevos tipos de reportes:

1. Crear nuevo DTO de filtros
2. Implementar método en `ReportesSeguimientoService`
3. Agregar endpoint en `ReportesSeguimientoController`
4. Documentar en Swagger

### Nuevas Métricas

Para agregar nuevas métricas:

1. Implementar método de cálculo en el servicio
2. Integrar en el reporte correspondiente
3. Actualizar documentación

## Mantenimiento y Monitoreo

### Logs

- Todas las operaciones de reportes son logueadas
- Métricas de rendimiento por tipo de reporte
- Alertas para reportes que toman más de 5 segundos

### Métricas de Uso

- Conteo de reportes generados por tipo
- Usuarios más activos en reportes
- Patrones de uso por rol

## Troubleshooting

### Problemas Comunes

1. **Reporte muy lento**
   - Verificar filtros aplicados
   - Revisar índices de base de datos
   - Considerar paginación

2. **Error de permisos**
   - Verificar rol del usuario
   - Confirmar autenticación JWT
   - Revisar configuración de roles

3. **Datos inconsistentes**
   - Verificar relaciones entre entidades
   - Revisar integridad referencial
   - Validar datos de entrada

### Contacto

Para soporte técnico o reportar problemas:

- Crear issue en el repositorio
- Contactar al equipo de desarrollo
- Revisar logs del sistema
