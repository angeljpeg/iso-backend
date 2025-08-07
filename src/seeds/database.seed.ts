import { DataSource } from 'typeorm';
import { UsuariosSeed } from './usuarios.seed';

export const seedDatabase = async (dataSource: DataSource) => {
  try {
    console.log('⏳ Ejecutando seeds...');

    // Ejecutar seed de usuarios
    await UsuariosSeed(dataSource);

    console.log('✅ Seeds ejecutados correctamente');
  } catch (error) {
    console.error('❌ Error ejecutando seeds:', error);
    throw error;
  }
};
