import { DataSource, DeepPartial } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Estadia } from '../modules/Estadias/entities/estadia.entity';
import { EstadiaAlumno } from '../modules/Estadias/entities/estadia-alumno.entity';
import { ProgresoMensual } from '../modules/Estadias/entities/progreso-mensual.entity';
import { Usuario } from '../modules/Usuarios/entities/usuario.entity';
import { RolUsuario } from '../modules/Usuarios/entities/usuario.entity';

export async function seedEstadias(dataSource: DataSource) {
  const estadiaRepository = dataSource.getRepository(Estadia);
  const estadiaAlumnoRepository = dataSource.getRepository(EstadiaAlumno);
  const progresoMensualRepository = dataSource.getRepository(ProgresoMensual);
  const usuarioRepository = dataSource.getRepository(Usuario);

  // Buscar un profesor para asignar las estadías
  let profesor = await usuarioRepository.findOne({
    where: { rol: RolUsuario.PROFESOR_TIEMPO_COMPLETO },
  });

  console.log(
    '🔍 Buscando profesor con rol:',
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
  );
  console.log(
    '🔍 Profesor encontrado:',
    profesor ? `Sí (ID: ${profesor.id})` : 'No',
  );

  // Si no existe un profesor, crear uno
  if (!profesor) {
    console.log('No se encontró un profesor, creando uno nuevo...');
    const hashedPassword = await bcrypt.hash('ProfesorTC123!', 12);

    const profesorData = {
      email: 'profesor.estadias@universidad.edu',
      password: hashedPassword,
      nombre: 'Profesor',
      apellido: 'Estadías',
      rol: RolUsuario.PROFESOR_TIEMPO_COMPLETO,
      activo: true,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    };

    console.log('📝 Datos del profesor a crear:', {
      ...profesorData,
      password: '[HIDDEN]',
    });

    profesor = usuarioRepository.create(profesorData);
    profesor = await usuarioRepository.save(profesor);

    console.log(
      `✅ Profesor creado: ${profesor.nombre} ${profesor.apellido} (${profesor.email})`,
    );
    console.log(`✅ ID del profesor: ${profesor.id}`);
  } else {
    console.log(
      `✅ Usando profesor existente: ${profesor.nombre} ${profesor.apellido} (ID: ${profesor.id})`,
    );
  }

  // Verificar que el profesor tiene un ID válido
  if (!profesor || !profesor.id) {
    throw new Error('No se pudo obtener un profesor válido con ID');
  }

  console.log(
    `🔍 Profesor final a usar - ID: ${profesor.id}, Nombre: ${profesor.nombre} ${profesor.apellido}`,
  );

  // Crear estadías de ejemplo
  const estadias = [
    {
      profesorId: profesor.id,
      periodo: '2024-1',
      observacionesGenerales: 'Estadías en desarrollo de software empresarial',
    },
    {
      profesorId: profesor.id,
      periodo: '2024-2',
      observacionesGenerales:
        'Estadías en inteligencia artificial y machine learning',
    },
  ];

  console.log(
    '📝 Datos de estadías a crear:',
    estadias.map((e) => ({ ...e, profesorId: e.profesorId })),
  );

  const estadiasCreadas = [];
  for (const estadiaData of estadias) {
    console.log(`🔍 Creando estadía con profesorId: ${estadiaData.profesorId}`);
    const estadia = estadiaRepository.create(estadiaData);
    console.log(`🔍 Estadía creada (antes de guardar):`, {
      id: estadia.id,
      profesorId: estadia.profesorId,
    });
    const estadiaGuardada = await estadiaRepository.save(estadia);
    console.log(`✅ Estadía guardada:`, {
      id: estadiaGuardada.id,
      profesorId: estadiaGuardada.profesorId,
    });
    estadiasCreadas.push(estadiaGuardada);
  }

  // Crear alumnos de ejemplo para la primera estadía
  console.log(
    '🔍 Estadías creadas:',
    estadiasCreadas.map((e) => ({ id: e.id, profesorId: e.profesorId })),
  );
  console.log('🔍 Usando estadía ID para alumnos:', estadiasCreadas[0].id);

  const alumnosEstadia1 = [
    {
      nombreAlumno: 'Ana Sofía García López',
      matricula: '2024001',
      carrera: 'Ingeniería en Sistemas Computacionales',
      estadiaId: estadiasCreadas[0].id,
      observacionesGenerales:
        'Alumna destacada con excelente capacidad de análisis',
    },
    {
      nombreAlumno: 'Carlos Eduardo Martínez',
      matricula: '2024002',
      carrera: 'Ingeniería en Sistemas Computacionales',
      estadiaId: estadiasCreadas[0].id,
      observacionesGenerales: 'Alumno con buen dominio de tecnologías web',
    },
    {
      nombreAlumno: 'Laura Patricia Hernández',
      matricula: '2024003',
      carrera: 'Ingeniería en Sistemas Computacionales',
      estadiaId: estadiasCreadas[0].id,
      observacionesGenerales: 'Alumna con interés en bases de datos',
    },
  ];

  console.log(
    '📝 Datos de alumnos a crear:',
    alumnosEstadia1.map((a) => ({
      nombre: a.nombreAlumno,
      estadiaId: a.estadiaId,
    })),
  );

  const alumnosCreados = [];
  for (const alumnoData of alumnosEstadia1) {
    console.log(`🔍 Creando alumno con estadiaId: ${alumnoData.estadiaId}`);
    const alumno = estadiaAlumnoRepository.create(alumnoData);
    console.log(`🔍 Alumno creado (antes de guardar):`, {
      id: alumno.id,
      estadiaId: alumno.estadiaId,
    });
    const alumnoGuardado = await estadiaAlumnoRepository.save(alumno);
    console.log(`✅ Alumno guardado:`, {
      id: alumnoGuardado.id,
      estadiaId: alumnoGuardado.estadiaId,
    });
    alumnosCreados.push(alumnoGuardado);
  }

  // Crear progreso mensual de ejemplo
  console.log(
    '🔍 Alumnos creados:',
    alumnosCreados.map((a) => ({ id: a.id, nombre: a.nombreAlumno })),
  );

  const progresosMensuales = [
    // Alumna 1 - Mes 1
    {
      estadiaAlumnoId: alumnosCreados[0].id,
      mes: 1,
      avance: 'si',
      accionesTomadas: null,
      fechaEvaluacion: new Date('2024-02-15'),
      observaciones: 'Excelente progreso en la definición del proyecto',
    },
    // Alumna 1 - Mes 2
    {
      estadiaAlumnoId: alumnosCreados[0].id,
      mes: 2,
      avance: 'si',
      accionesTomadas: null,
      fechaEvaluacion: new Date('2024-03-15'),
      observaciones: 'Avance significativo en el desarrollo del frontend',
    },
    // Alumno 2 - Mes 1
    {
      estadiaAlumnoId: alumnosCreados[1].id,
      mes: 1,
      avance: 'no',
      accionesTomadas:
        'Se programaron sesiones de asesoría adicionales y se estableció un plan de trabajo más detallado',
      fechaEvaluacion: new Date('2024-02-15'),
      observaciones: 'Necesita más orientación en la metodología del proyecto',
    },
    // Alumno 2 - Mes 2
    {
      estadiaAlumnoId: alumnosCreados[1].id,
      mes: 2,
      avance: 'si',
      accionesTomadas: null,
      fechaEvaluacion: new Date('2024-03-15'),
      observaciones: 'Mejoró significativamente después de las asesorías',
    },
    // Alumna 3 - Mes 1
    {
      estadiaAlumnoId: alumnosCreados[2].id,
      mes: 1,
      avance: 'si',
      accionesTomadas: null,
      fechaEvaluacion: new Date('2024-02-15'),
      observaciones: 'Buen progreso en el análisis de requerimientos',
    },
  ];

  console.log(
    '📝 Datos de progreso mensual a crear:',
    progresosMensuales.map((p) => ({
      estadiaAlumnoId: p.estadiaAlumnoId,
      mes: p.mes,
      avance: p.avance,
    })),
  );

  for (const progresoData of progresosMensuales) {
    console.log(
      `🔍 Creando progreso mensual con estadiaAlumnoId: ${progresoData.estadiaAlumnoId}`,
    );
    const progreso = progresoMensualRepository.create(
      progresoData as DeepPartial<ProgresoMensual>,
    );
    console.log(`🔍 Progreso creado (antes de guardar):`, {
      id: progreso.id,
      estadiaAlumnoId: progreso.estadiaAlumnoId,
    });
    const progresoGuardado = await progresoMensualRepository.save(progreso);
    console.log(`✅ Progreso guardado:`, {
      id: progresoGuardado.id,
      estadiaAlumnoId: progresoGuardado.estadiaAlumnoId,
    });
  }

  console.log('✅ Datos de estadías sembrados correctamente');
  console.log(`   - ${estadiasCreadas.length} estadías creadas`);
  console.log(`   - ${alumnosCreados.length} alumnos registrados`);
  console.log(
    `   - ${progresosMensuales.length} registros de progreso mensual`,
  );
}
