# 🧩 Módulo: Programación y Seguimiento del Curso

## 1. Descripción General

Módulo del sistema ISO para registrar, monitorear y reportar semanalmente el avance académico de profesores en sus asignaturas, con alertas ante retrasos y herramientas para seguimiento correctivo.

## 2. Objetivos

### Principal:

- Asegurar que los profesores cumplan el plan de estudios semanalmente.

### Secundarios:

- Automatizar formatos de seguimiento.
- Detectar retrasos críticos (≥2 semanas).
- Facilitar revisión por directivos.
- Generar reportes académicos.
- Enviar notificaciones automáticas.

## 3. Usuarios

- Profesores: Registran avances semanales y justifican retrasos.
- Director de Carrera: Revisa seguimientos, aprueba o solicita acciones.
- Coordinador Académico: Supervisa todo el proceso y genera reportes.

## 4. Funcionalidades Clave

- Registro de avance por tema y semana.
- Cálculo automático de retrasos.
- Justificación obligatoria para retrasos críticos.
- Estados del formulario: borrador → enviado → revisado → aprobado/rechazado.
- Notificaciones automáticas por falta de actualización o retrasos.
- Reportes por profesor, grupo, carrera o cuatrimestre.
- Exportación de reportes (PDF, Excel).
- Control por roles: profesor, director, coordinador.

## 5. Integraciones

- Planes de Estudio: Para cargar unidades, temas y semanas.
- Asignaciones Académicas: Para saber qué profesor tiene qué grupo.
- Sistema de Usuarios: Para roles y autenticación.
- Notificaciones: Para alertas automáticas o manuales.

## 6. Notificaciones

- Automáticas: Falta de actualización, retraso crítico, comentarios del director, recordatorios.
- Manuales: Enviadas por el coordinador.
- Canales: App, correo y dashboard.

## 7. Reportes

- Avance por profesor, grupo, carrera o cuatrimestre.
- Dashboard de retrasos críticos.
- Visualización interactiva y exportación.

## 8. Requisitos Técnicos

- Performance: Carga de formularios <2s; 100 usuarios simultáneos.
- Seguridad: Roles, autenticación, validación y auditoría.
- Usabilidad: Interfaz intuitiva, indicadores visuales y autoguardado.
- Compatibilidad: Navegadores modernos y responsive en todos los dispositivos.

## 9. Criterios de Aceptación

- Formatos generados desde asignaciones y planes.
- Registro y cálculo de seguimiento funcional.
- Justificaciones obligatorias en retrasos.
- Notificaciones activas.
- Reportes exportables y dashboard funcional.

## 10. KPIs

- ≥95% de profesores con seguimiento actualizado.
- <10% de retrasos críticos sin acción.
- Respuesta correctiva <48h desde la detección.
