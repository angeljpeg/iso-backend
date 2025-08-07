import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getEnvVar } from '@utils/get-env-var';

export function getTypeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: getEnvVar('DB_HOST'),
    port: Number(getEnvVar('DB_PORT')),
    username: getEnvVar('DB_USERNAME'),
    password: getEnvVar('DB_PASSWORD'),
    database: getEnvVar('DB_NAME'),
    entities: [__dirname + '/../modules/**/entities/*.entity.{js,ts}'],
    synchronize: true,
  };
}
