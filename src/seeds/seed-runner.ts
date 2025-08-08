import { DataSource } from 'typeorm';
import { seedDatabase } from './database.seed';
import { config } from 'dotenv';

// Load environment variables
config();

async function runSeeds() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'iso_db',
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    synchronize: true,
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Base de datos conectada');
    
    await seedDatabase(dataSource);
    
    console.log('✅ Seeds ejecutados exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando seeds:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

runSeeds();
