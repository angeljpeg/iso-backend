import { Cuatrimestre } from '@modules/Cuatrimestres/entities/cuatrimestre.entity';
import { Grupo } from '@modules/Grupos/entities/grupo.entity';
import { DataSource } from 'typeorm';
import { getCarreraByNombre } from '../lib/carreras';

export const GruposSeed = async (dataSource: DataSource) => {
  try {
    console.log('⏳ Ejecutando seed de grupos...');

    const gruposRepository = dataSource.getRepository(Grupo);
    const cuatrimestreRepository = dataSource.getRepository(Cuatrimestre);

    // Verificar si ya existen grupos para evitar duplicados
    const existingGroups = await gruposRepository.count();
    if (existingGroups > 0) {
      console.log('⚠️  Ya existen grupos en la base de datos, omitiendo seed');
      return;
    }

    // Crear cuatrimestre de ejemplo
    const cuatrimestre = cuatrimestreRepository.create({
      fechaInicio: new Date('2025-05-01'),
      fechaFin: new Date('2025-08-31'),
      nombreGenerado: 'MAYO - AGOSTO 2025',
      activo: true,
    });

    const savedCuatrimestre = await cuatrimestreRepository.save(cuatrimestre);
    console.log(`✅ Cuatrimestre creado: ${savedCuatrimestre.nombreGenerado}`);

    // Validar que la carrera existe en los datos estáticos
    const carreraNombre =
      'TECNOLOGÍAS DE LA INFORMACIÓN Y DESARROLLO DE SOFTWARE';
    const carreraData = getCarreraByNombre(carreraNombre);

    if (!carreraData) {
      throw new Error(
        `La carrera "${carreraNombre}" no existe en los datos estáticos`,
      );
    }

    console.log(
      `✅ Carrera validada: ${carreraData.nombre} (${carreraData.codigo})`,
    );

    // Datos de grupos semilla
    const gruposData = [
      {
        carrera: carreraNombre,
        cuatrimestre: 1,
        numeroGrupo: 1,
        cuatrimestreId: savedCuatrimestre.id,
      },
      {
        carrera: carreraNombre,
        cuatrimestre: 1,
        numeroGrupo: 2,
        cuatrimestreId: savedCuatrimestre.id,
      },
      {
        carrera: carreraNombre,
        cuatrimestre: 2,
        numeroGrupo: 1,
        cuatrimestreId: savedCuatrimestre.id,
      },
      {
        carrera: carreraNombre,
        cuatrimestre: 3,
        numeroGrupo: 1,
        cuatrimestreId: savedCuatrimestre.id,
      },
    ];

    // Crear grupos
    const gruposCreados = [];

    for (const grupoData of gruposData) {
      const grupo = gruposRepository.create(grupoData);

      // Generar el nombre automáticamente usando el método de la entidad
      grupo.nombreGenerado = grupo.generateNombre();

      gruposCreados.push(grupo);
    }

    // Guardar todos los grupos
    await gruposRepository.save(gruposCreados);

    console.log(`✅ ${gruposCreados.length} grupos creados exitosamente`);
    console.log('📋 Grupos creados:');
    gruposCreados.forEach((grupo) => {
      console.log(
        `   - ${grupo.nombreGenerado} (${grupo.carrera} - Cuatrimestre ${grupo.cuatrimestre})`,
      );
    });
  } catch (error) {
    console.error('❌ Error ejecutando seed de grupos:', error);
    throw error;
  }
};
