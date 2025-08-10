import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, RolUsuario } from '@modules/Usuarios/entities/usuario.entity';
import { CargaAcademica } from '@modules/CargaAcademica/entities/carga-academica.entity';
import { getCarreraByCodigo } from '@lib/carreras';
import { Grupo } from '@modules/Grupos/entities/grupo.entity'; // ✅ Agregar import
import {
  EstadoSeguimiento,
  SeguimientoCurso,
} from '@modules/ProgramacionSeguimientoCurso/entities/seguimiento-curso.entity';

export const profesor2 = async (dataSource: DataSource) => {
  try {
    const profesorRepository = dataSource.getRepository(Usuario);
    const cargaAcademicaRepository = dataSource.getRepository(CargaAcademica);
    const grupoRepository = dataSource.getRepository(Grupo); // ✅ Agregar repository
    const seguimientoCursoRepository =
      dataSource.getRepository(SeguimientoCurso);
    const carrera = getCarreraByCodigo('TIDS');
    if (!carrera) {
      throw new Error('Carrera no encontrada');
    }

    // Verificar si el profesor ya existe
    const existingProfesor = await profesorRepository.findOne({
      where: { email: 'profesor2@example.com' },
    });

    if (existingProfesor) {
      console.log('Profesor 2 ya existe, omitiendo creación');
      return;
    }

    const password = await bcrypt.hash('Password123!', 12);

    const profesor = profesorRepository.create({
      nombre: 'Maria',
      apellido: 'Rodriguez',
      email: 'profesor2@example.com',
      password: password,
      rol: RolUsuario.PROFESOR_ASIGNATURA,
    });

    await profesorRepository.save(profesor);
    console.log('Profesor 2 creado exitosamente');

    // ✅ Buscar grupos disponibles
    const gruposDisponibles = await grupoRepository.find({
      where: { activo: true },
      relations: ['cuatrimestreRelacion'],
    });

    if (gruposDisponibles.length === 0) {
      console.log(
        '⚠️ No hay grupos disponibles para asignar cargas académicas',
      );
      return;
    }

    // Crear cargas académicas para este profesor
    const cargasAcademicas = [
      {
        carrera: carrera.nombre,
        asignatura: 'APLICACIONES WEB PARA I4.0',
        grupoId: gruposDisponibles[0].id, // ✅ Asignar al primer grupo
      },
      {
        carrera: carrera.nombre,
        asignatura: 'BASES DE DATOS PARA COMPUTO EN LA NUBE',
        grupoId: gruposDisponibles[1]?.id || gruposDisponibles[0].id, // ✅ Asignar al segundo grupo o primero si no hay más
      },
    ];
    const savedCargasAcademicas: CargaAcademica[] = [];

    for (const cargaData of cargasAcademicas) {
      const grupo = await grupoRepository.findOne({
        where: { id: cargaData.grupoId },
        relations: ['cuatrimestreRelacion'],
      });

      if (!grupo) {
        console.log(`⚠️ Grupo ${cargaData.grupoId} no encontrado`);
        continue;
      }

      const existingCarga = await cargaAcademicaRepository.findOne({
        where: {
          profesor: { id: profesor.id },
          grupoId: cargaData.grupoId,
          carrera: cargaData.carrera,
          asignatura: cargaData.asignatura,
        },
      });

      if (!existingCarga) {
        const cargaAcademica = cargaAcademicaRepository.create({
          profesor,
          carrera: cargaData.carrera,
          asignatura: cargaData.asignatura,
          grupoId: cargaData.grupoId, // ✅ Incluir grupoId
          cuatrimestreId: grupo.cuatrimestreId, // ✅ Incluir cuatrimestreId
        });

        const savedCargaAcademica =
          await cargaAcademicaRepository.save(cargaAcademica);
        savedCargasAcademicas.push(savedCargaAcademica);
        console.log(
          `Carga académica creada: ${cargaData.asignatura} - Grupo: ${grupo.nombreGenerado}`,
        );
      }
    }

    for (const cargaAcademica of savedCargasAcademicas) {
      const seguimientoCurso = seguimientoCursoRepository.create({
        cargaAcademicaId: cargaAcademica.id,
        cuatrimestreId: cargaAcademica.cuatrimestreId,
        estado: EstadoSeguimiento.BORRADOR,
      });

      await seguimientoCursoRepository.save(seguimientoCurso);
      console.log(
        `Seguimiento de curso creado: ${cargaAcademica.asignatura} - Grupo: ${cargaAcademica.grupoId}`,
      );
    }
  } catch (error) {
    console.error('Error creando profesor 2:', error);
  }
};
