# Configuración del Servicio de Correo

## Variables de Entorno Requeridas

Para que el servicio de correo funcione correctamente, necesitas configurar las siguientes variables en tu archivo `.env`:

```env
# Configuración del servicio de correo
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu-email@gmail.com
MAIL_PASS=tu-contraseña-de-aplicacion
MAIL_FROM_NAME=Sistema ISO
MAIL_FROM_EMAIL=noreply@iso-utn.com
```

## Configuración para Gmail

Si usas Gmail, necesitarás:

1. **Habilitar la verificación en dos pasos** en tu cuenta de Google
2. **Generar una contraseña de aplicación** específica para esta aplicación
3. Usar `smtp.gmail.com` como host y puerto `587`

## Configuración para otros proveedores

### Outlook/Hotmail

```env
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_SECURE=false
```

### Yahoo

```env
MAIL_HOST=smtp.mail.yahoo.com
MAIL_PORT=587
MAIL_SECURE=false
```

### Servidor SMTP propio

```env
MAIL_HOST=tu-servidor-smtp.com
MAIL_PORT=25
MAIL_SECURE=false
```

## Funcionalidades del Servicio

### 1. Envío de correos simples

- Endpoint: `POST /correo/enviar`
- Permite enviar correos con texto plano o HTML

### 2. Envío con plantillas

- Endpoint: `POST /correo/enviar-template`
- Usa plantillas Handlebars para correos personalizados

### 3. Envío masivo

- Endpoint: `POST /correo/enviar-masivo`
- Envía correos a múltiples destinatarios usando una plantilla

### 4. Correos predefinidos

- Bienvenida: `POST /correo/bienvenida`
- Notificación de estadía: `POST /correo/notificacion-estadia`
- Recordatorio de asesoría: `POST /correo/recordatorio-asesoria`

### 5. Verificación de conexión

- Endpoint: `GET /correo/verificar-conexion`
- Solo accesible para administradores y coordinadores

## Plantillas Disponibles

### bienvenida.hbs

- Parámetros: `nombre`, `rol`, `fecha`
- Uso: Correos de bienvenida para nuevos usuarios

### estadia-notificacion.hbs

- Parámetros: `nombre`, `tipo`, `detalles`, `fecha`
- Uso: Notificaciones relacionadas con estadías

### asesoria-recordatorio.hbs

- Parámetros: `nombre`, `fecha`, `materia`
- Uso: Recordatorios de asesorías programadas

## Uso del Servicio

### Envío básico

```typescript
// En tu servicio
constructor(private readonly correoService: CorreoService) {}

async enviarNotificacion(email: string, nombre: string) {
  return this.correoService.enviarCorreo({
    para: email,
    asunto: 'Notificación importante',
    mensaje: 'Hola ' + nombre + ', tienes una notificación.',
  });
}
```

### Envío con plantilla

```typescript
async enviarBienvenida(email: string, nombre: string, rol: string) {
  return this.correoService.enviarCorreoBienvenida(email, nombre, rol);
}
```

## Seguridad

- Todos los endpoints requieren autenticación JWT
- Algunos endpoints están restringidos por roles
- El servicio incluye logging para auditoría
- Manejo de errores robusto con try-catch

## Troubleshooting

### Error de conexión

1. Verifica las credenciales SMTP
2. Asegúrate de que el puerto esté abierto
3. Verifica que el proveedor permita conexiones SMTP

### Error de autenticación

1. Verifica que la contraseña de aplicación sea correcta
2. Asegúrate de que la verificación en dos pasos esté habilitada
3. Revisa que la cuenta no esté bloqueada

### Plantillas no encontradas

1. Verifica que las plantillas estén en `src/modules/Correo/templates/`
2. Asegúrate de que los nombres de archivo coincidan exactamente
3. Verifica la sintaxis de Handlebars
