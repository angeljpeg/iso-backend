import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, RolUsuario } from '@modules/Usuarios/entities/usuario.entity';
import { CargaAcademica } from '@modules/CargaAcademica/entities/carga-academica.entity';
import { getCarreraByCodigo } from '@lib/carreras';

export const profesor3 = async (dataSource: DataSource) => {
  try {
    const profesorRepository = dataSource.getRepository(Usuario);
    const cargaAcademicaRepository = dataSource.getRepository(CargaAcademica);

    const carrera = getCarreraByCodigo('TIDS');
    if (!carrera) {
      throw new Error('Carrera no encontrada');
    }

    // Verificar si el profesor ya existe
    const existingProfesor = await profesorRepository.findOne({
      where: { email: 'profesor3@example.com' },
    });

    if (existingProfesor) {
      console.log('Profesor 3 ya existe, omitiendo creación');
      return;
    }

    const password = await bcrypt.hash('Password123!', 12);

    const profesor = profesorRepository.create({
      nombre: 'Carlos',
      apellido: 'Martinez',
      email: 'profesor3@example.com',
      password: password,
      rol: RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    });

    await profesorRepository.save(profesor);
    console.log('Profesor 3 creado exitosamente');

    // Crear cargas académicas para este profesor
    const cargasAcademicas = [
      {
        carrera: carrera.nombre,
        asignatura: 'EXPRESIÓN ORAL Y ESCRITA',
      },
      {
        carrera: carrera.nombre,
        asignatura: 'INGLÉS I',
      },
      {
        carrera: carrera.nombre,
        asignatura: 'ASIGNATURA INTEGRADORA',
      },
    ];

    for (const cargaData of cargasAcademicas) {
      const existingCarga = await cargaAcademicaRepository.findOne({
        where: {
          profesor: { id: profesor.id },
          carrera: cargaData.carrera,
          asignatura: cargaData.asignatura,
        },
      });

      if (!existingCarga) {
        const cargaAcademica = cargaAcademicaRepository.create({
          profesor,
          carrera: cargaData.carrera,
          asignatura: cargaData.asignatura,
        });

        await cargaAcademicaRepository.save(cargaAcademica);
        console.log(`Carga académica creada: ${cargaData.asignatura}`);
      }
    }
  } catch (error) {
    console.error('Error creando profesor 3:', error);
  }
};
