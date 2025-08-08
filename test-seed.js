const { DataSource } = require('typeorm');
require('dotenv').config();

async function testSeed() {
  console.log('🔍 Testing database connection...');
  
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'iso_db',
    entities: ['src/**/*.entity.ts'],
    synchronize: true,
    logging: true,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected successfully');
    
    // Test if we can query the database
    const result = await dataSource.query('SELECT NOW() as current_time');
    console.log('✅ Database query test:', result);
    
    await dataSource.destroy();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testSeed();
