import { DataSource } from 'typeorm';
import { NecesidadesEspeciales } from '../modules/NecesidadesEspeciales/entities/necesidades-especiales.entity';
import { CargaAcademica } from '../modules/CargaAcademica/entities/carga-academica.entity';

export const seedNecesidadesEspeciales = async (dataSource: DataSource) => {
  const necesidadesEspecialesRepository = dataSource.getRepository(
    NecesidadesEspeciales,
  );
  const cargaAcademicaRepository = dataSource.getRepository(CargaAcademica);

  // Obtener algunas cargas académicas existentes
  const cargasAcademicas = await cargaAcademicaRepository.find({ take: 5 });

  if (cargasAcademicas.length === 0) {
    console.log(
      'No hay cargas académicas disponibles para crear necesidades especiales',
    );
    return;
  }

  const necesidadesEspecialesData = [
    {
      fecha: new Date('2024-01-15'),
      nombreAlumno: 'María González López',
      numeroMatricula: '2024001',
      programaEducativo: 'Ingeniería en Sistemas Computacionales',
      fechaRevision: new Date('2024-01-20'),
      numeroRevision: 1,
      excepcionesConductuales: true,
      especificacionConductual:
        'Agitación durante exámenes, requiere ambiente tranquilo',
      excepcionesComunicacionales: false,
      excepcionesIntelectuales: false,
      excepcionesFisicas: false,
      excepcionesSuperdotacion: false,
      cargaAcademicaId: cargasAcademicas[0].id,
    },
    {
      fecha: new Date('2024-01-16'),
      nombreAlumno: 'Carlos Rodríguez Martínez',
      numeroMatricula: '2024002',
      programaEducativo: 'Ingeniería Industrial',
      fechaRevision: new Date('2024-01-21'),
      numeroRevision: 1,
      excepcionesConductuales: false,
      excepcionesComunicacionales: true,
      especificacionComunicacional:
        'Dificultad para expresar ideas oralmente, requiere tiempo adicional',
      excepcionesIntelectuales: false,
      excepcionesFisicas: false,
      excepcionesSuperdotacion: false,
      cargaAcademicaId: cargasAcademicas[1]?.id || cargasAcademicas[0].id,
    },
    {
      fecha: new Date('2024-01-17'),
      nombreAlumno: 'Ana Patricia Sánchez',
      numeroMatricula: '2024003',
      programaEducativo: 'Ingeniería en Sistemas Computacionales',
      fechaRevision: new Date('2024-01-22'),
      numeroRevision: 1,
      excepcionesConductuales: false,
      excepcionesComunicacionales: false,
      excepcionesIntelectuales: false,
      excepcionesFisicas: true,
      especificacionFisica:
        'Discapacidad visual parcial, requiere material en formato ampliado',
      excepcionesSuperdotacion: false,
      cargaAcademicaId: cargasAcademicas[2]?.id || cargasAcademicas[0].id,
    },
    {
      fecha: new Date('2024-01-18'),
      nombreAlumno: 'Luis Fernando Torres',
      numeroMatricula: '2024004',
      programaEducativo: 'Ingeniería Mecatrónica',
      fechaRevision: new Date('2024-01-23'),
      numeroRevision: 1,
      excepcionesConductuales: false,
      excepcionesComunicacionales: false,
      excepcionesIntelectuales: false,
      excepcionesFisicas: false,
      excepcionesSuperdotacion: true,
      especificacionSuperdotacion:
        'Alto rendimiento académico, requiere actividades de enriquecimiento',
      cargaAcademicaId: cargasAcademicas[3]?.id || cargasAcademicas[0].id,
    },
    {
      fecha: new Date('2024-01-19'),
      nombreAlumno: 'Sofia Elena Vargas',
      numeroMatricula: '2024005',
      programaEducativo: 'Ingeniería Química',
      fechaRevision: new Date('2024-01-24'),
      numeroRevision: 1,
      excepcionesConductuales: false,
      excepcionesComunicacionales: false,
      excepcionesIntelectuales: true,
      especificacionIntelectual:
        'Dificultades en matemáticas avanzadas, requiere tutoría adicional',
      excepcionesFisicas: false,
      excepcionesSuperdotacion: false,
      cargaAcademicaId: cargasAcademicas[4]?.id || cargasAcademicas[0].id,
    },
  ];

  for (const data of necesidadesEspecialesData) {
    const necesidadesEspeciales = necesidadesEspecialesRepository.create(data);
    await necesidadesEspecialesRepository.save(necesidadesEspeciales);
  }

  console.log('✅ Necesidades especiales sembradas exitosamente');
};
