import { DataSource } from 'typeorm';
import { profesor1 } from './profesor-1';
import { profesor2 } from './profesor-2';
import { profesor3 } from './profesor-3';

export const ProfesoresSeed = async (dataSource: DataSource) => {
  console.log('🌱 Iniciando seed de profesores...');

  try {
    await profesor1(dataSource);
    await profesor2(dataSource);
    await profesor3(dataSource);

    console.log('✅ Seed de profesores completado exitosamente');
  } catch (error) {
    console.error('❌ Error en seed de profesores:', error);
    throw error;
  }
};
