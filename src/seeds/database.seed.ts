import { DataSource } from 'typeorm';
import { UsuariosSeed } from './usuarios.seed';
import { GruposSeed } from './grupos.seed'; // ✅ Agregar import
import { ProfesoresSeed } from './profesores.ts';

export const seedDatabase = async (dataSource: DataSource) => {
  try {
    console.log('⏳ Ejecutando seeds...');

    // Ejecutar seeds en orden correcto
    await UsuariosSeed(dataSource);
    await GruposSeed(dataSource); // ✅ Ejecutar antes de profesores
    await ProfesoresSeed(dataSource);

    console.log('✅ Seeds ejecutados correctamente');
  } catch (error) {
    console.error('❌ Error ejecutando seeds:', error);
    throw error;
  }
};
