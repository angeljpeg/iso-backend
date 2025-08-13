# 📚 API de Necesidades Especiales - Documentación para Frontend

Esta documentación describe todos los endpoints disponibles para el módulo de Necesidades Especiales, incluyendo ejemplos de uso, estructuras de datos y manejo de errores.

## 🔐 Autenticación

Todos los endpoints requieren autenticación JWT. Incluye el token en el header:

```http
Authorization: Bearer <tu-token-jwt>
```

## 📊 Endpoints Principales

### 1. Crear Necesidades Especiales

**POST** `/necesidades-especiales`

**Roles permitidos**: `PROFESOR_ASIGNATURA`, `PROFESOR_TIEMPO_COMPLETO`, `COORDINADOR`

**Body**:

```json
{
  "fecha": "2024-01-15",
  "nombreAlumno": "María González López",
  "numeroMatricula": "2024001",
  "programaEducativo": "Ingeniería en Sistemas Computacionales",
  "fechaRevision": "2024-01-20",
  "numeroRevision": 1,
  "excepcionesConductuales": true,
  "especificacionConductual": "Agitación durante exámenes, requiere ambiente tranquilo",
  "excepcionesComunicacionales": false,
  "excepcionesIntelectuales": false,
  "excepcionesFisicas": false,
  "excepcionesSuperdotacion": false,
  "cargaAcademicaId": 1
}
```

**Respuesta exitosa** (201):

```json
{
  "id": 1,
  "fecha": "2024-01-15T00:00:00.000Z",
  "nombreAlumno": "María González López",
  "numeroMatricula": "2024001",
  "programaEducativo": "Ingeniería en Sistemas Computacionales",
  "fechaRevision": "2024-01-20T00:00:00.000Z",
  "numeroRevision": 1,
  "excepcionesConductuales": true,
  "especificacionConductual": "Agitación durante exámenes, requiere ambiente tranquilo",
  "excepcionesComunicacionales": false,
  "excepcionesIntelectuales": false,
  "excepcionesFisicas": false,
  "excepcionesSuperdotacion": false,
  "cargaAcademicaId": 1,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Listar Necesidades Especiales

**GET** `/necesidades-especiales`

**Roles permitidos**: `PROFESOR_ASIGNATURA`, `PROFESOR_TIEMPO_COMPLETO`, `COORDINADOR`

**Parámetros de consulta**:

- `nombreAlumno` (opcional): Filtrar por nombre del alumno
- `numeroMatricula` (opcional): Filtrar por número de matrícula
- `programaEducativo` (opcional): Filtrar por programa educativo
- `nombreProfesor` (opcional): Filtrar por nombre del profesor
- `cargaAcademicaId` (opcional): Filtrar por ID de carga académica
- `excepcionesConductuales` (opcional): Filtrar por excepciones conductuales (true/false)
- `excepcionesComunicacionales` (opcional): Filtrar por excepciones comunicacionales (true/false)
- `excepcionesIntelectuales` (opcional): Filtrar por excepciones intelectuales (true/false)
- `excepcionesFisicas` (opcional): Filtrar por excepciones físicas (true/false)
- `excepcionesSuperdotacion` (opcional): Filtrar por excepciones de superdotación (true/false)
- `fechaDesde` (opcional): Filtrar desde fecha (YYYY-MM-DD)
- `fechaHasta` (opcional): Filtrar hasta fecha (YYYY-MM-DD)
- `page` (opcional): Número de página (por defecto: 1)
- `limit` (opcional): Límite de registros por página (por defecto: 10)

**Ejemplo de consulta**:

```http
GET /necesidades-especiales?programaEducativo=Ingeniería en Sistemas&excepcionesConductuales=true&page=1&limit=20
```

**Respuesta exitosa** (200):

```json
{
  "data": [
    {
      "id": 1,
      "fecha": "2024-01-15T00:00:00.000Z",
      "nombreAlumno": "María González López",
      "numeroMatricula": "2024001",
      "programaEducativo": "Ingeniería en Sistemas Computacionales",
      "fechaRevision": "2024-01-20T00:00:00.000Z",
      "numeroRevision": 1,
      "excepcionesConductuales": true,
      "especificacionConductual": "Agitación durante exámenes, requiere ambiente tranquilo",
      "excepcionesComunicacionales": false,
      "excepcionesIntelectuales": false,
      "excepcionesFisicas": false,
      "excepcionesSuperdotacion": false,
      "cargaAcademicaId": 1,
      "cargaAcademica": {
        "id": 1,
        "usuario": {
          "id": 1,
          "nombre": "Dr. Juan Pérez"
        }
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

### 3. Obtener por ID

**GET** `/necesidades-especiales/:id`

**Roles permitidos**: `PROFESOR_ASIGNATURA`, `PROFESOR_TIEMPO_COMPLETO`, `COORDINADOR`

**Respuesta exitosa** (200):

```json
{
  "id": 1,
  "fecha": "2024-01-15T00:00:00.000Z",
  "nombreAlumno": "María González López",
  "numeroMatricula": "2024001",
  "programaEducativo": "Ingeniería en Sistemas Computacionales",
  "fechaRevision": "2024-01-20T00:00:00.000Z",
  "numeroRevision": 1,
  "excepcionesConductuales": true,
  "especificacionConductual": "Agitación durante exámenes, requiere ambiente tranquilo",
  "excepcionesComunicacionales": false,
  "excepcionesIntelectuales": false,
  "excepcionesFisicas": false,
  "excepcionesSuperdotacion": false,
  "cargaAcademicaId": 1,
  "cargaAcademica": {
    "id": 1,
    "usuario": {
      "id": 1,
      "nombre": "Dr. Juan Pérez"
    }
  }
}
```

### 4. Actualizar

**PATCH** `/necesidades-especiales/:id`

**Roles permitidos**: `PROFESOR_ASIGNATURA`, `PROFESOR_TIEMPO_COMPLETO`, `COORDINADOR`

**Body** (campos opcionales):

```json
{
  "especificacionConductual": "Requiere ambiente tranquilo y tiempo adicional",
  "excepcionesComunicacionales": true,
  "especificacionComunicacional": "Dificultad para expresar ideas oralmente"
}
```

### 5. Eliminar (Soft Delete)

**DELETE** `/necesidades-especiales/:id`

**Roles permitidos**: `COORDINADOR`

**Respuesta exitosa** (204): Sin contenido

## 📈 Endpoints de Reportes

### 1. Resumen General

**GET** `/reportes/necesidades-especiales/resumen-general`

**Roles permitidos**: `PROFESOR_ASIGNATURA`, `PROFESOR_TIEMPO_COMPLETO`, `COORDINADOR`

**Parámetros**:

- `fechaDesde` (opcional): Fecha de inicio
- `fechaHasta` (opcional): Fecha de fin
- `programaEducativo` (opcional): Filtrar por programa educativo

**Respuesta**:

```json
{
  "totalRegistros": 150,
  "totalAlumnos": 120,
  "totalCarreras": 8,
  "totalProfesores": 45,
  "distribucionPorTipo": {
    "conductuales": 25,
    "comunicacionales": 18,
    "intelectuales": 32,
    "fisicas": 15,
    "superdotacion": 8,
    "otras": 12
  },
  "distribucionPorCarrera": [
    {
      "carrera": "Ingeniería en Sistemas",
      "total": 45,
      "porcentaje": 30.0
    }
  ],
  "distribucionPorMes": [
    {
      "mes": "Enero",
      "total": 12
    }
  ]
}
```

### 2. Reporte por Tipo de Necesidad

**GET** `/reportes/necesidades-especiales/por-tipo-necesidad`

**Respuesta**:

```json
[
  {
    "tipo": "Conductuales",
    "total": 25,
    "porcentaje": 16.67,
    "detalles": [
      {
        "id": 1,
        "nombreAlumno": "María González López",
        "numeroMatricula": "2024001",
        "programaEducativo": "Ingeniería en Sistemas",
        "especificacion": "Agitación durante exámenes",
        "fecha": "2024-01-15T00:00:00.000Z"
      }
    ]
  }
]
```

### 3. Reporte por Carrera

**GET** `/reportes/necesidades-especiales/por-carrera`

**Respuesta**:

```json
[
  {
    "carrera": "Ingeniería en Sistemas",
    "total": 45,
    "porcentaje": 30.0,
    "tiposNecesidad": {
      "conductuales": 8,
      "comunicacionales": 6,
      "intelectuales": 12,
      "fisicas": 5,
      "superdotacion": 3,
      "otras": 2
    },
    "alumnos": [
      {
        "id": 1,
        "nombre": "María González López",
        "matricula": "2024001",
        "tiposNecesidad": ["Conductuales", "Comunicacionales"]
      }
    ]
  }
]
```

### 4. Reporte por Profesor

**GET** `/reportes/necesidades-especiales/por-profesor`

**Parámetros**:

- `fechaDesde` (opcional): Fecha de inicio
- `fechaHasta` (opcional): Fecha de fin
- `profesorId` (opcional): ID específico del profesor

**Respuesta**:

```json
[
  {
    "profesorId": 1,
    "nombreProfesor": "Dr. Juan Pérez",
    "totalAlumnos": 15,
    "totalNecesidades": 23,
    "distribucionPorTipo": {
      "conductuales": 5,
      "comunicacionales": 4,
      "intelectuales": 8,
      "fisicas": 3,
      "superdotacion": 2,
      "otras": 1
    },
    "alumnos": [
      {
        "id": 1,
        "nombre": "María González López",
        "matricula": "2024001",
        "programaEducativo": "Ingeniería en Sistemas",
        "tiposNecesidad": ["Conductuales", "Comunicacionales"]
      }
    ]
  }
]
```

### 5. Tendencias Mensuales

**GET** `/reportes/necesidades-especiales/tendencias-mensuales`

**Parámetros**:

- `anio` (opcional): Año para el reporte (por defecto año actual)
- `programaEducativo` (opcional): Filtrar por programa educativo

**Respuesta**:

```json
[
  {
    "mes": "Enero",
    "total": 12,
    "variacion": 0,
    "distribucionPorTipo": {
      "conductuales": 2,
      "comunicacionales": 1,
      "intelectuales": 4,
      "fisicas": 2,
      "superdotacion": 1,
      "otras": 2
    }
  }
]
```

### 6. Exportar a Excel

**GET** `/reportes/necesidades-especiales/exportar-excel`

**Roles permitidos**: `COORDINADOR`

**Respuesta**:

```json
{
  "mensaje": "Datos preparados para exportación",
  "datos": {
    /* datos del resumen general */
  },
  "formato": "excel",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🚨 Códigos de Error

### 400 - Bad Request

```json
{
  "statusCode": 400,
  "message": "La carga académica especificada no existe",
  "error": "Bad Request"
}
```

### 401 - Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 - Forbidden

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

### 404 - Not Found

```json
{
  "statusCode": 404,
  "message": "Necesidades especiales con ID 999 no encontradas"
}
```

### 500 - Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## 🔧 Ejemplos de Uso en Frontend

### React/TypeScript

```typescript
interface NecesidadesEspeciales {
  id: number;
  fecha: string;
  nombreAlumno: string;
  numeroMatricula: string;
  programaEducativo: string;
  fechaRevision: string;
  numeroRevision: number;
  excepcionesConductuales: boolean;
  especificacionConductual?: string;
  excepcionesComunicacionales: boolean;
  especificacionComunicacional?: string;
  excepcionesIntelectuales: boolean;
  especificacionIntelectual?: string;
  excepcionesFisicas: boolean;
  especificacionFisica?: string;
  excepcionesSuperdotacion: boolean;
  especificacionSuperdotacion?: string;
  otrasNecesidades?: string;
  cargaAcademicaId: number;
}

// Crear necesidades especiales
const crearNecesidades = async (data: Partial<NecesidadesEspeciales>) => {
  try {
    const response = await fetch('/api/necesidades-especiales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al crear necesidades especiales');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Obtener lista con filtros
const obtenerNecesidades = async (filtros: any) => {
  const params = new URLSearchParams(filtros);
  const response = await fetch(`/api/necesidades-especiales?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

// Obtener reporte
const obtenerReporte = async (tipo: string, filtros: any) => {
  const params = new URLSearchParams(filtros);
  const response = await fetch(
    `/api/reportes/necesidades-especiales/${tipo}?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return await response.json();
};
```

## 📱 Componentes de UI Recomendados

### Formulario de Creación/Edición

- Campos de texto para información básica
- Checkboxes para tipos de necesidades
- Campos de texto expandibles para especificaciones
- Selector de carga académica
- Validación en tiempo real

### Tabla de Listado

- Paginación
- Filtros avanzados
- Ordenamiento por columnas
- Acciones por fila (editar, eliminar)
- Exportación a CSV/Excel

### Dashboard de Reportes

- Gráficos de barras para distribución por tipo
- Gráficos de pastel para distribución por carrera
- Gráficos de línea para tendencias temporales
- Tarjetas de resumen con métricas clave
- Filtros de fecha y programa educativo

## 🔒 Consideraciones de Seguridad

1. **Autenticación**: Todos los endpoints requieren token JWT válido
2. **Autorización**: Verificar roles del usuario antes de mostrar funcionalidades
3. **Validación**: Validar datos en frontend antes de enviar al backend
4. **Sanitización**: Sanitizar datos de entrada para prevenir XSS
5. **Rate Limiting**: Implementar límites de velocidad para evitar abuso

## 📋 Checklist de Implementación

- [ ] Configurar interceptores para autenticación
- [ ] Implementar manejo de errores global
- [ ] Crear componentes de formulario con validación
- [ ] Implementar tabla con paginación y filtros
- [ ] Crear dashboard de reportes con gráficos
- [ ] Implementar exportación de datos
- [ ] Implementar responsive design
- [ ] Agregar loading states y error boundaries

## 🆘 Soporte

Para dudas técnicas o problemas de implementación, consulta:

- Documentación de la API en Swagger: `/api-docs`
- Logs del servidor para debugging
- Repositorio del proyecto para ejemplos de código
