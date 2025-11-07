import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { parse } from 'pg-connection-string';

const databaseConfig = (): DataSourceOptions => {
  // Check for DATABASE_URL (Supabase uses this)
  const dbUrl = process.env.DATABASE_URL;

  // If DATABASE_URL is provided, use it (for Supabase)
  if (dbUrl) {
    const parsed = parse(dbUrl);

    return {
      type: 'postgres',
      host: parsed.host || 'localhost',
      port: Number(parsed.port) || 5432,
      username: parsed.user || 'postgres',
      password: parsed.password || '',
      database: parsed.database || 'postgres',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      dropSchema: false,
      logging: process.env.NODE_ENV === 'development',
      // Supabase requires SSL
      ssl: { rejectUnauthorized: false },
    };
  }

  // Fallback to individual variables for backward compatibility
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'purmamarca_db',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    dropSchema: false,
    logging: process.env.NODE_ENV === 'development',
  };
};

export default registerAs('typeorm', databaseConfig);

const connectionSource: DataSource = new DataSource(databaseConfig());

export { connectionSource };
