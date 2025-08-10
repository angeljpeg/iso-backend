# ISO API REST - Documentación del Proyecto

## 1. Resumen Ejecutivo

**ISO API REST** es una API backend desarrollada con NestJS que proporciona servicios para la gestión académica de una institución educativa. La aplicación maneja usuarios, asignaturas, grupos, estadías, carga académica y seguimiento de cursos, implementando un sistema de autenticación basado en JWT y roles de usuario.

## 2. Información Técnica

### 2.1 Tecnologías Principales

- **Framework**: NestJS 11.x
- **Lenguaje**: TypeScript 5.7.x
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI
- **Gestor de Paquetes**: pnpm

### 2.2 Arquitectura

- **Patrón**: Arquitectura modular basada en NestJS
- **Estructura**: Módulos independientes con entidades, servicios y controladores
- **Base de Datos**: Relacional con PostgreSQL
- **API**: RESTful con validación de datos y manejo de errores

## 3. Estructura del Proyecto

### 3.1 Organización de Directorios

```
src/
├── common/           # Decoradores, guards, interfaces y estrategias comunes
├── config/          # Configuración de TypeORM y variables de entorno
├── lib/             # Librerías y utilidades compartidas
├── modules/         # Módulos de la aplicación
├── seeds/           # Datos de inicialización de la base de datos
├── utils/           # Utilidades generales
├── app.module.ts    # Módulo principal de la aplicación
└── main.ts          # Punto de entrada de la aplicación
```

### 3.2 Módulos Principales

#### 3.2.1 Módulo de Usuarios (`UsuariosModule`)

- **Propósito**: Gestión de usuarios, autenticación y autorización
- **Entidades**: `Usuario`
- **Roles**: Coordinador, Moderador, Profesor Tiempo Completo, Profesor Asignatura
- **Funcionalidades**:
  - Registro y autenticación de usuarios
  - Gestión de roles y permisos
  - Recuperación de contraseñas
  - Control de acceso basado en JWT

#### 3.2.2 Módulo de Asignaturas (`AsignaturasModule`)

- **Propósito**: Gestión del catálogo de asignaturas
- **Funcionalidades**: CRUD de asignaturas disponibles en la institución

#### 3.2.3 Módulo de Temas (`TemasModule`)

- **Propósito**: Gestión de temas relacionados con las asignaturas
- **Funcionalidades**: CRUD de temas de estudio

#### 3.2.4 Módulo de Grupos (`GruposModule`)

- **Propósito**: Gestión de grupos académicos por carrera y cuatrimestre
- **Entidades**: `Grupo`
- **Funcionalidades**:
  - Creación automática de nombres de grupos
  - Asociación con carreras y cuatrimestres
  - Validación de estructura académica

#### 3.2.5 Módulo de Cuatrimestres (`CuatrimestresModule`)

- **Propósito**: Gestión de periodos académicos
- **Entidades**: `Cuatrimestre`
- **Funcionalidades**:
  - Validación de duración de 4 meses
  - Generación automática de nombres descriptivos
  - Control de periodos activos e históricos

#### 3.2.6 Módulo de Carga Académica (`CargaAcademicaModule`)

- **Propósito**: Gestión de asignaciones de profesores a grupos y asignaturas
- **Entidades**: `CargaAcademica`
- **Funcionalidades**:
  - Asignación de profesores a grupos
  - Control de carga horaria
  - Validación de disponibilidad

#### 3.2.7 Módulo de Programación y Seguimiento de Cursos (`ProgramacionSeguimientoCursoModule`)

- **Propósito**: Seguimiento del progreso académico de los estudiantes
- **Entidades**: `SeguimientoCurso`, `SeguimientoDetalle`, `NotificacionSeguimiento`
- **Funcionalidades**:
  - Registro de progreso de estudiantes
  - Notificaciones de seguimiento
  - Reportes de avance

#### 3.2.8 Módulo de Estadías (`EstadiasModule`)

- **Propósito**: Gestión de proyectos de estadía de estudiantes
- **Entidades**: `Estadia`, `EstadiaAlumno`, `ProgresoMensual`
- **Funcionalidades**:
  - Creación y gestión de estadías
  - Registro de alumnos participantes
  - Evaluación mensual del progreso
  - Generación de reportes completos

## 4. Configuración y Variables de Entorno

### 4.1 Base de Datos

```typescript
// Configuración TypeORM
{
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true
}
```

### 4.2 Variables de Entorno Requeridas

- `DB_HOST`: Host de la base de datos PostgreSQL
- `DB_PORT`: Puerto de la base de datos
- `DB_USERNAME`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_NAME`: Nombre de la base de datos
- `JWT_SECRET`: Clave secreta para firmar tokens JWT
- `PORT`: Puerto del servidor (por defecto: 3000)

## 5. Autenticación y Autorización

### 5.1 Sistema de Autenticación

- **JWT Strategy**: Implementada con `@nestjs/jwt` y `@nestjs/passport`
- **Guards**: `JwtAuthGuard` para proteger rutas
- **Roles**: Sistema de roles con `@Roles()` decorator y `RolesGuard`

### 5.2 Roles de Usuario

1. **Coordinador**: Acceso total al sistema
2. **Moderador**: Acceso de lectura y comentarios
3. **Profesor Tiempo Completo**: Acceso a asignaturas específicas de la carrera
4. **Profesor Asignatura**: Acceso a materias de formación general

### 5.3 Seguridad

- Hashing de contraseñas con bcrypt
- Tokens JWT con expiración configurable
- Validación de entrada con class-validator
- CORS configurado para desarrollo

## 6. API Endpoints

### 6.1 Autenticación

- `POST /usuarios/login` - Inicio de sesión
- `POST /usuarios/refresh-token` - Renovación de token
- `POST /usuarios/reset-password` - Recuperación de contraseña

### 6.2 Usuarios

- `GET /usuarios` - Listar usuarios (Coordinador/Moderador)
- `POST /usuarios` - Crear usuario (Coordinador)
- `PATCH /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario (Coordinador)

### 6.3 Grupos

- `GET /grupos` - Listar grupos
- `POST /grupos` - Crear grupo (Coordinador)
- `PATCH /grupos/:id` - Actualizar grupo (Coordinador)
- `DELETE /grupos/:id` - Eliminar grupo (Coordinador)

### 6.4 Estadías

- `GET /estadias` - Listar estadías
- `POST /estadias` - Crear estadía
- `GET /estadias/profesor` - Estadías del profesor autenticado
- `GET /estadias/reporte/:id` - Reporte completo de estadía

### 6.5 Carga Académica

- `GET /carga-academica` - Listar cargas académicas
- `POST /carga-academica` - Crear carga académica
- `PATCH /carga-academica/:id` - Actualizar carga académica

## 7. Base de Datos

### 7.1 Entidades Principales

- **Usuario**: Información de usuarios y autenticación
- **Grupo**: Grupos académicos por carrera y cuatrimestre
- **Cuatrimestre**: Periodos académicos
- **Estadia**: Proyectos de estadía
- **CargaAcademica**: Asignaciones de profesores
- **SeguimientoCurso**: Seguimiento académico

### 7.2 Relaciones

- Usuarios pueden tener múltiples cargas académicas
- Grupos están asociados a carreras y cuatrimestres
- Estadías están asociadas a profesores y alumnos
- Carga académica vincula profesores, grupos y asignaturas

## 8. Scripts y Comandos

### 8.1 Desarrollo

```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm start:dev

# Ejecutar en modo debug
pnpm start:debug

# Linting y formateo
pnpm lint
pnpm prettier
```

### 8.2 Producción

```bash
# Construir la aplicación
pnpm build

# Ejecutar en producción
pnpm start:prod
```

### 8.3 Base de Datos

```bash
# Ejecutar seeds de inicialización
pnpm seed
```

### 8.4 Testing

```bash
# Ejecutar tests unitarios
pnpm test

# Ejecutar tests en modo watch
pnpm test:watch

# Ejecutar tests con coverage
pnpm test:cov

# Ejecutar tests end-to-end
pnpm test:e2e
```

## 9. Documentación de API

### 9.1 Swagger

- **URL**: `/api`
- **Configuración**: Documentación automática con `@nestjs/swagger`
- **Autenticación**: Bearer token JWT
- **Endpoints**: Documentación completa de todos los endpoints

### 9.2 Ejemplos de Uso

La documentación incluye ejemplos de:

- Estructura de datos para crear entidades
- Respuestas de la API
- Códigos de error
- Autenticación y autorización

## 10. Despliegue y Configuración

### 10.1 Requisitos del Sistema

- Node.js 18+ o 20+
- PostgreSQL 12+
- pnpm (recomendado) o npm

### 10.2 Variables de Entorno

Crear archivo `.env` con las variables necesarias:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=iso_database
JWT_SECRET=your-secret-key
PORT=3000
```

### 10.3 Base de Datos

1. Crear base de datos PostgreSQL
2. Ejecutar `pnpm seed` para inicializar datos
3. La aplicación sincronizará automáticamente el esquema

## 11. Características Destacadas

### 11.1 Generación Automática

- Nombres de grupos basados en carrera y cuatrimestre
- Nombres de cuatrimestres basados en fechas
- Validaciones automáticas de duración y estructura

### 11.2 Sistema de Roles

- Control granular de acceso por funcionalidad
- Separación clara entre tipos de profesor
- Permisos diferenciados por nivel de usuario

### 11.3 Seguimiento Académico

- Evaluación mensual de progreso en estadías
- Sistema de notificaciones para seguimiento
- Reportes detallados de avance

### 11.4 Validaciones

- Validación de entrada con class-validator
- Reglas de negocio implementadas en entidades
- Manejo de errores centralizado

## 12. Mantenimiento y Soporte

### 12.1 Logs y Monitoreo

- Logs de NestJS para debugging
- Manejo de errores centralizado
- Validación de datos de entrada

### 12.2 Testing

- Tests unitarios con Jest
- Tests end-to-end para flujos críticos
- Coverage de código configurado

### 12.3 Documentación

- Código documentado con JSDoc
- Swagger para documentación de API
- README y documentación de módulos

## 13. Consideraciones de Seguridad

### 13.1 Autenticación

- Tokens JWT con expiración
- Refresh tokens para renovación
- Hashing seguro de contraseñas

### 13.2 Autorización

- Control de acceso basado en roles
- Validación de permisos en cada endpoint
- Protección contra acceso no autorizado

### 13.3 Validación de Datos

- Sanitización de entrada
- Validación de tipos y formatos
- Prevención de inyección SQL

## 14. Roadmap y Mejoras Futuras

### 14.1 Funcionalidades Planificadas

- Sistema de notificaciones en tiempo real
- Reportes avanzados y analytics
- Integración con sistemas externos
- API para aplicaciones móviles

### 14.2 Mejoras Técnicas

- Caché con Redis
- Rate limiting
- Logging estructurado
- Métricas de rendimiento

## 15. Conclusión

La API ISO REST es una solución robusta y escalable para la gestión académica, implementando las mejores prácticas de desarrollo con NestJS. Su arquitectura modular permite un mantenimiento sencillo y la adición de nuevas funcionalidades de manera eficiente.

El sistema proporciona una base sólida para la gestión de usuarios, grupos académicos, estadías y seguimiento de cursos, con un enfoque en la seguridad, validación de datos y experiencia del desarrollador.
