# Modulo de Usuarios

## 1. Resumen Ejecutivo

Este documento define los requerimientos funcionales y no funcionales del módulo de Gestión de Usuarios para el sistema. Este módulo permitirá registrar, autenticar, gestionar roles y controlar el acceso de los usuarios dentro de la plataforma.

## 2. Objetivo

Establecer las funcionalidades necesarias para:

- Registrar usuarios con distintos roles.
- Autenticar usuarios mediante login seguro.
- Asignar y controlar roles y permisos.
- Gestionar perfiles y cambios de estado de cuenta.
- Cumplir con buenas prácticas de seguridad (hashing, tokens, control de sesiones).

## 3. Alcance

El módulo abarca:

- Registro y activación de cuenta.
- Autenticación y autorización.
- Gestión de perfiles y roles.
- Recuperación de contraseña.
- Seguridad básica (cifrado, expiración de sesión, protección contra ataques comunes).

## 4. Actores del Sistema

Coordinador: Usuario con permisos totales. Administra usuarios, roles y configuraciones.
Moderador: Revisa contenido de otros usuarios y puede dejar comentarios.
Profesor: Solo puede acceder y responder ciertos formatos o formularios asignados.

> **Tipos de Profesor:**
>
> - **Profesor de Tiempo Completo (PTC):**  
>   Imparte asignaturas directamente relacionadas con el plan de estudios de la carrera (materias troncales o especializadas).  
>   Ejemplos: _Gestión de Base de Datos, Arquitectura de Computadoras_.
> - **Profesor de Asignatura (PA):**  
>   Imparte asignaturas de formación general, comúnmente llamadas "materias de relleno", que no son específicas de la carrera.  
>   Ejemplos: _Matemáticas Básicas, Desarrollo Ético_.

## 5. Requerimientos Funcionales

### 5.1 Registro de Usuario

- RF1.1: Solo el Coordinador puede registrar nuevos usuarios en el sistema.
- RF1.2: Al registrar un usuario, el sistema debe enviar un correo electrónico con las credenciales de acceso o un enlace para establecer la contraseña.
- RF1.3: El sistema debe validar que no existan usuarios duplicados (por correo electrónico o identificador único).

### 5.2 Autenticación (Login)

- RF2.1: El sistema debe permitir a los usuarios iniciar sesión con email y contraseña.
- RF2.2: El sistema debe generar un token de sesión al autenticarse correctamente (JWT u otra tecnología).

### 5.3 Recuperación de Contraseña

- RF3.1: El sistema debe permitir a los usuarios solicitar un enlace de recuperación.
- RF3.2: El enlace debe expirar tras cierto tiempo o después de un uso.

### 5.4 Gestión de Roles

- RF4.1: El Coordinador puede asignar, cambiar o revocar roles de usuario.
- RF4.2: El sistema debe restringir las acciones de cada usuario según su rol asignado.
- RF4.3: Solo el Coordinador puede modificar o eliminar usuarios.

### 5.5 Perfil de Usuario

- RF5.1: Cada usuario puede consultar y modificar su información personal (excepto el rol).
- RF5.2: El sistema debe permitir a cualquier usuario cambiar su contraseña autenticado.

### 5.6 Listado y Búsqueda

- RF6.1: El Coordinador debe poder ver un listado completo de usuarios.
- RF6.2: El listado debe permitir búsqueda por nombre, email o rol.
- RF6.3: El Coordinador puede desactivar (no eliminar) usuarios para bloquear su acceso.

## 6. Requerimientos No Funcionales

- RNF1: El sistema debe implementar hashing de contraseñas (ej. bcrypt).
- RNF2: El sistema debe usar un método de autenticación seguro (JWT, OAuth2, etc.).
- RNF3: Las sesiones deben expirar después de cierto tiempo de inactividad.
- RNF4: El sistema debe estar disponible 99.9% del tiempo.
- RNF5: El rendimiento esperado para búsquedas es menor a 1 segundo con hasta 10,000 usuarios.

## 7. Flujos Principales

### 7.1 Registro y Activación

1. Usuario ingresa correo y contraseña.
2. Se valida que no exista otro usuario con ese correo.
3. Se envía un correo con sus credenciales.

### 7.2 Login

1. Usuario ingresa email y contraseña.
2. Se verifica credenciales.
3. Se genera JWT y se devuelve.
4. El usuario accede según su rol.

### 7.3 Recuperación de Contraseña

1. Usuario solicita recuperación vía email.
2. Se envía enlace con token temporal.
3. Usuario establece nueva contraseña.

## 8. Reglas de Negocio

- RR1: Un Coordinador no puede eliminar su propia cuenta.
- RR2: Un Profesor no puede ver datos de otros usuarios.
- RR3: Un Moderador no puede cambiar roles ni contraseñas de otros usuarios.
- RR4: Un Coordinador no puede cambiar su propio rol.
- RR5: Solo Usuarios activos pueden iniciar sesion.

## 9. Tecnologias Sugeridas

- Framework: NestJS
- Base de Datos: PostgreSQL
- ORM: TypeORM
- Autenticación: JWT (access + refresh tokens)
- Cifrado: bcrypt para contraseñas
- Arquitectura: DDD o MVC
