# Reportes de Asesorías

Este módulo proporciona un sistema completo de reportes para asesorías académicas, incluyendo métricas detalladas por carrera, profesor, tema y otros criterios.

## Características Principales

### ✅ Inclusión de Carreras

A diferencia de los reportes de programación y seguimiento, este sistema **SÍ incluye carreras** como criterio principal de agrupación y análisis.

### 📊 Tipos de Reportes Disponibles

#### 1. Reporte General (`/reportes-asesorias/general`)

- **Descripción**: Reporte completo con filtros avanzados
- **Métricas incluidas**:
  - Total de asesorías
  - Resumen por carrera
  - Resumen por cuatrimestre
  - Resumen por profesor
  - Resumen por tema
  - Resumen por grupo
  - Total de alumnos atendidos
  - Total de horas de asesorías

#### 2. Reporte por Carrera (`/reportes-asesorias/por-carrera`)

- **Descripción**: Análisis detallado agrupado por carrera
- **Métricas específicas**:
  - Total de asesorías por carrera
  - Total de alumnos por carrera
  - Total de horas por carrera
  - Promedio de alumnos por asesoría por carrera
  - Promedio de duración por asesoría por carrera
  - Distribución por asignaturas dentro de cada carrera
  - Distribución por profesores dentro de cada carrera

#### 3. Reporte por Profesor (`/reportes-asesorias/por-profesor`)

- **Descripción**: Análisis detallado agrupado por profesor
- **Métricas específicas**:
  - Total de asesorías por profesor
  - Total de alumnos atendidos por profesor
  - Total de horas impartidas por profesor
  - Promedio de alumnos por asesoría por profesor
  - Promedio de duración por asesoría por profesor
  - Distribución por carreras que atiende cada profesor
  - Distribución por asignaturas que imparte cada profesor
  - Distribución por grupos que atiende cada profesor

#### 4. Reporte por Tema (`/reportes-asesorias/por-tema`)

- **Descripción**: Análisis detallado agrupado por tema de asesoría
- **Métricas específicas**:
  - Total de asesorías por tema
  - Total de alumnos atendidos por tema
  - Total de horas dedicadas por tema
  - Promedio de alumnos por asesoría por tema
  - Promedio de duración por asesoría por tema
  - Distribución por carreras que requieren cada tema
  - Distribución por asignaturas relacionadas con cada tema
  - Distribución por profesores que imparten cada tema

#### 5. Reporte Estadístico (`/reportes-asesorias/estadisticas`)

- **Descripción**: Reporte estadístico completo con métricas agregadas
- **Métricas incluidas**:
  - Estadísticas generales (totales y promedios)
  - Distribuciones por múltiples criterios
  - Agrupaciones configurables
  - Métricas de tiempo y alumnos

#### 6. Reporte de Dashboard (`/reportes-asesorias/dashboard`)

- **Descripción**: Reporte consolidado para dashboards
- **Métricas incluidas**:
  - KPIs principales
  - Top carreras, profesores y temas
  - Distribuciones clave

## Filtros Disponibles

### Filtros Básicos

- `cuatrimestreId`: ID del cuatrimestre
- `profesorId`: ID del profesor
- `carrera`: Nombre de la carrera
- `asignatura`: Nombre de la asignatura
- `grupoId`: ID del grupo
- `temaAsesoria`: Tema de la asesoría

### Filtros de Fecha

- `fechaInicio`: Fecha de inicio del rango
- `fechaFin`: Fecha de fin del rango

### Filtros de Alumnos

- `numeroAlumnosMinimo`: Número mínimo de alumnos
- `numeroAlumnosMaximo`: Número máximo de alumnos

### Filtros de Duración

- `duracionMinima`: Duración mínima en minutos
- `duracionMaxima`: Duración máxima en minutos

### Filtros de Configuración

- `incluirDetalles`: Incluir detalles completos de asesorías
- `agruparPorSemana`: Agrupar por semana del año
- `agruparPorCarrera`: Agrupar por carrera
- `agruparPorAsignatura`: Agrupar por asignatura
- `agruparPorGrupo`: Agrupar por grupo

## Endpoints de la API

### Base URL

```
GET /reportes-asesorias/{tipo}
```

### Endpoints Disponibles

1. `GET /reportes-asesorias/general` - Reporte general
2. `GET /reportes-asesorias/por-carrera` - Reporte por carrera
3. `GET /reportes-asesorias/por-profesor` - Reporte por profesor
4. `GET /reportes-asesorias/por-tema` - Reporte por tema
5. `GET /reportes-asesorias/estadisticas` - Reporte estadístico
6. `GET /reportes-asesorias/dashboard` - Reporte de dashboard

## Ejemplos de Uso

### Reporte General con Filtros

```bash
GET /reportes-asesorias/general?carrera=TIDS&cuatrimestreId=123&incluirDetalles=true
```

### Reporte por Carrera

```bash
GET /reportes-asesorias/por-carrera?fechaInicio=2024-01-01&fechaFin=2024-12-31
```

### Reporte Estadístico con Agrupaciones

```bash
GET /reportes-asesorias/estadisticas?agruparPorCarrera=true&agruparPorProfesor=true
```

## Roles y Permisos

Los siguientes roles pueden acceder a los reportes:

- `COORDINADOR`
- `MODERADOR`
- `PROFESOR_TIEMPO_COMPLETO`
- `PROFESOR_ASIGNATURA`

## Ventajas sobre Reportes de Programación y Seguimiento

1. **✅ Inclusión de Carreras**: Los reportes incluyen carreras como criterio principal
2. **📊 Métricas Específicas**: Métricas adaptadas a asesorías (alumnos atendidos, duración)
3. **🎯 Filtros Especializados**: Filtros específicos para asesorías (tema, número de alumnos, duración)
4. **📈 Agrupaciones Flexibles**: Múltiples opciones de agrupación y análisis
5. **🔍 Análisis Detallado**: Resúmenes detallados por cada criterio de agrupación

## Estructura de Respuesta

Todos los reportes siguen una estructura consistente:

```json
{
  "totalAsesorias": 150,
  "resumenPorCarrera": { ... },
  "metricasGenerales": { ... },
  "asesorias": [ ... ]
}
```

## Consideraciones Técnicas

- **Performance**: Los reportes utilizan queries optimizadas con TypeORM
- **Escalabilidad**: Diseñado para manejar grandes volúmenes de datos
- **Flexibilidad**: Filtros opcionales que no afectan el rendimiento
- **Consistencia**: Estructura de respuesta uniforme en todos los endpoints
