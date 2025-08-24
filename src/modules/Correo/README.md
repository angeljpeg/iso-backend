# Módulo de Correo - Sistema ISO

Este módulo proporciona funcionalidades completas para el envío de correos electrónicos en el Sistema ISO.

## Características

- ✅ Envío de correos simples (texto plano y HTML)
- ✅ Envío de correos usando plantillas Handlebars
- ✅ Envío masivo de correos
- ✅ Plantillas predefinidas para casos comunes
- ✅ Verificación de conexión del servicio
- ✅ Logging completo para auditoría
- ✅ Manejo robusto de errores
- ✅ Integración con el sistema de autenticación JWT
- ✅ Control de acceso basado en roles

## Estructura del Módulo

```
src/modules/Correo/
├── correo.module.ts          # Módulo principal
├── correo.service.ts         # Servicio de correo
├── correo.controller.ts      # Controlador HTTP
├── dto/                      # Data Transfer Objects
│   ├── enviar-correo.dto.ts
│   ├── enviar-correo-template.dto.ts
│   └── enviar-correo-masivo.dto.ts
├── templates/                 # Plantillas Handlebars
│   ├── bienvenida.hbs
│   ├── estadia-notificacion.hbs
│   └── asesoria-recordatorio.hbs
├── index.ts                  # Exportaciones
└── README.md                 # Este archivo
```

## Endpoints Disponibles

### POST `/correo/enviar`

Envía un correo simple con texto plano o HTML.

**Body:**

```json
{
  "para": "usuario@example.com",
  "asunto": "Asunto del correo",
  "mensaje": "Mensaje en texto plano",
  "html": "<h1>Mensaje en HTML</h1>"
}
```

### POST `/correo/enviar-template`

Envía un correo usando una plantilla de Handlebars.

**Body:**

```json
{
  "para": "usuario@example.com",
  "asunto": "Asunto del correo",
  "template": "bienvenida",
  "contexto": {
    "nombre": "Juan Pérez",
    "rol": "Estudiante"
  }
}
```

### POST `/correo/enviar-masivo`

Envía correos masivos usando una plantilla.

**Body:**

```json
{
  "destinatarios": [
    {
      "email": "usuario1@example.com",
      "contexto": { "nombre": "Juan" }
    },
    {
      "email": "usuario2@example.com",
      "contexto": { "nombre": "María" }
    }
  ],
  "asunto": "Notificación general",
  "template": "notificacion-general",
  "contexto": {
    "fecha": "2024-01-15"
  }
}
```

### POST `/correo/bienvenida`

Envía un correo de bienvenida predefinido.

**Body:**

```json
{
  "email": "usuario@example.com",
  "nombre": "Juan Pérez",
  "rol": "Estudiante"
}
```

### POST `/correo/notificacion-estadia`

Envía una notificación de estadía.

**Body:**

```json
{
  "email": "usuario@example.com",
  "nombre": "Juan Pérez",
  "tipo": "Aprobación",
  "detalles": {
    "estadia": "Desarrollo de App Móvil",
    "empresa": "TechCorp"
  }
}
```

### POST `/correo/recordatorio-asesoria`

Envía un recordatorio de asesoría.

**Body:**

```json
{
  "email": "usuario@example.com",
  "nombre": "Juan Pérez",
  "fecha": "2024-01-20T10:00:00Z",
  "materia": "Matemáticas Avanzadas"
}
```

### POST `/correo/alumno-reprobado-estadia`

Envía una notificación cuando un alumno es reprobado en estadías por falta de avances.

**Body:**

```json
{
  "email": "coordinador@utn.edu.mx",
  "nombre": "Juan Carlos Pérez González",
  "matricula": "2021001234",
  "carrera": "Ingeniería en Sistemas Computacionales",
  "grupo": "ISC-2021-A"
}
```

### GET `/correo/verificar-conexion`

Verifica la conexión del servicio de correo (solo coordinador).

## Plantillas Disponibles

### bienvenida.hbs

Plantilla para correos de bienvenida a nuevos usuarios.

**Parámetros:**

- `nombre`: Nombre del usuario
- `rol`: Rol del usuario en el sistema
- `fecha`: Fecha de registro

### estadia-notificacion.hbs

Plantilla para notificaciones relacionadas con estadías.

**Parámetros:**

- `nombre`: Nombre del usuario
- `tipo`: Tipo de notificación
- `detalles`: Detalles adicionales
- `fecha`: Fecha de la notificación

### asesoria-recordatorio.hbs

Plantilla para recordatorios de asesorías.

**Parámetros:**

- `nombre`: Nombre del usuario
- `fecha`: Fecha de la asesoría
- `materia`: Materia de la asesoría

### alumno-reprobado-estadia.hbs

Plantilla para notificar cuando un alumno es reprobado en estadías por falta de avances.

**Parámetros:**

- `nombre`: Nombre completo del alumno
- `matricula`: Matrícula del alumno
- `carrera`: Carrera del alumno
- `grupo`: Grupo del alumno
- `fechaBaja`: Fecha en que se dio de baja al alumno
- `fechaNotificacion`: Fecha de la notificación

## Uso en Otros Servicios

Para usar el servicio de correo en otros módulos:

```typescript
import { CorreoService } from '@modules/Correo';

@Injectable()
export class MiServicio {
  constructor(private readonly correoService: CorreoService) {}

  async enviarNotificacion(email: string, nombre: string) {
    return this.correoService.enviarCorreo({
      para: email,
      asunto: 'Notificación importante',
      mensaje: `Hola ${nombre}, tienes una notificación.`,
    });
  }

  async enviarBienvenida(email: string, nombre: string, rol: string) {
    return this.correoService.enviarCorreoBienvenida(email, nombre, rol);
  }
}
```

## Configuración

Asegúrate de configurar las siguientes variables de entorno:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu-email@gmail.com
MAIL_PASS=tu-contraseña-de-aplicacion
MAIL_FROM_NAME=Sistema ISO
MAIL_FROM_EMAIL=noreply@iso-utn.com
```

## Dependencias

- `@nestjs-modules/mailer`: Módulo de correo para NestJS
- `nodemailer`: Cliente SMTP para Node.js
- `handlebars`: Motor de plantillas

## Seguridad

- Todos los endpoints requieren autenticación JWT
- Algunos endpoints están restringidos por roles específicos
- El servicio incluye logging para auditoría
- Manejo robusto de errores con try-catch

## Logs

El servicio registra todas las operaciones:

- Envíos exitosos
- Errores de envío
- Verificaciones de conexión
- Operaciones masivas

## Testing

Para probar el servicio:

1. Configura las variables de entorno
2. Ejecuta el endpoint de verificación de conexión
3. Envía un correo de prueba usando el endpoint simple
4. Verifica que las plantillas funcionen correctamente

## Troubleshooting

### Error de conexión SMTP

- Verifica credenciales y configuración
- Asegúrate de que el puerto esté abierto
- Verifica que el proveedor permita conexiones SMTP

### Plantillas no encontradas

- Verifica la ruta de las plantillas
- Asegúrate de que los nombres coincidan exactamente
- Verifica la sintaxis de Handlebars

### Errores de autenticación

- Verifica que la contraseña de aplicación sea correcta
- Asegúrate de que la verificación en dos pasos esté habilitada
