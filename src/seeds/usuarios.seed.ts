import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  Usuario,
  RolUsuario,
} from '../modules/Usuarios/entities/usuario.entity';

export const UsuariosSeed = async (dataSource: DataSource) => {
  try {
    console.log('⏳ Ejecutando seed de usuarios...');

    const usuarioRepository = dataSource.getRepository(Usuario);

    // Verificar si ya existen usuarios para evitar duplicados
    const existingUsers = await usuarioRepository.count();
    if (existingUsers > 0) {
      console.log(
        '⚠️  Ya existen usuarios en la base de datos, omitiendo seed',
      );
      return;
    }

    // Datos de usuarios semilla
    const usuariosData = [
      {
        email: 'coordinador@universidad.edu',
        password: 'Coordinador123!',
        nombre: 'María',
        apellido: 'González',
        rol: RolUsuario.COORDINADOR,
        activo: true,
      },
      {
        email: 'juan.perez@universidad.edu',
        password: 'Password123!',
        nombre: 'María',
        apellido: 'González',
        rol: RolUsuario.COORDINADOR,
        activo: true,
      },
      {
        email: 'moderador@universidad.edu',
        password: 'Moderador123!',
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        rol: RolUsuario.MODERADOR,
        activo: true,
      },
      {
        email: 'profesor.tc@universidad.edu',
        password: 'ProfesorTC123!',
        nombre: 'Ana',
        apellido: 'Martínez',
        rol: RolUsuario.PROFESOR_TIEMPO_COMPLETO,
        activo: true,
      },
      {
        email: 'profesor.asignatura@universidad.edu',
        password: 'ProfesorAsig123!',
        nombre: 'Luis',
        apellido: 'Hernández',
        rol: RolUsuario.PROFESOR_ASIGNATURA,
        activo: true,
      },
      {
        email: 'angel.gonzalez@universidad.edu',
        password: 'Password123!',
        nombre: 'Angel',
        apellido: 'González',
        rol: RolUsuario.PROFESOR_ASIGNATURA,
        activo: true,
      },
    ];

    // Crear usuarios con contraseñas hasheadas
    const usuariosCreados = [];

    for (const userData of usuariosData) {
      // Hash de la contraseña usando el mismo patrón que el servicio
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      const usuario = usuarioRepository.create({
        email: userData.email,
        password: hashedPassword,
        nombre: userData.nombre,
        apellido: userData.apellido,
        rol: userData.rol,
        activo: userData.activo,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });

      usuariosCreados.push(usuario);
    }

    // Guardar todos los usuarios
    await usuarioRepository.save(usuariosCreados);

    console.log(`✅ ${usuariosCreados.length} usuarios creados exitosamente`);
    console.log('📋 Usuarios creados:');
    usuariosCreados.forEach((usuario) => {
      console.log(
        `   - ${usuario.nombre} ${usuario.apellido} (${usuario.email}) - ${usuario.rol}`,
      );
    });
  } catch (error) {
    console.error('❌ Error ejecutando seed de usuarios:', error);
    throw error;
  }
};
