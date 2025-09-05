/* eslint-disable prettier/prettier */

//! descomentar esto para deploy
import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export default registerAs('typeorm', () => ({
  type: 'postgres',
  url: process.env.DB_URL,
  ssl: { rejectUnauthorized: false },
  entities: ['dist/**/*.entity{.ts,.js}'],
  logging: false,
  synchronize: true,
  dropSchema: false
}));

const connectionSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: ['dist/**/*.entity{.ts,.js}'],
  logging: false,
  synchronize: true,
  dropSchema: false
} as DataSourceOptions);

export { connectionSource };
//! hasta aca

//!descomentar esto para local de Gaby
// import { registerAs } from '@nestjs/config';
// import { DataSource, DataSourceOptions } from 'typeorm';

// console.log(typeof process.env.DB_NAME);

// export default registerAs('typeorm', () => ({
//   type: 'postgres',
//   database: process.env.DB_NAME,
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   entities: ['dist/**/*.entity{.ts,.js}'],
//   logging: false,
//   autoLoadEntities: true,
//   synchronize: true,
//   dropSchema: false
// }));

// const connectionSource = new DataSource({
//   type: 'postgres',
//   database: process.env.DB_NAME,
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   entities: ['dist/**/*.entity{.ts,.js}'],
//   logging: false,
//   autoLoadEntities: true,
//   synchronize: true,
//   dropSchema: false
// } as DataSourceOptions);

// export { connectionSource };

// //!descomentar esto para local
// import { registerAs } from '@nestjs/config';
// import { DataSource, DataSourceOptions } from 'typeorm';

// console.log(typeof process.env.DB_NAME);

// export default registerAs('typeorm', () => ({
//   type: 'postgres',
//   database: process.env.DB_NAME,
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   entities: ['dist//*.entity{.ts,.js}'],
//   logging: false,
//   autoLoadEntities: true,
//   synchronize: true,
//   dropSchema: false
// }));

// const connectionSource = new DataSource({
//   type: 'postgres',
//   database: process.env.DB_NAME,
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   entities: ['dist//*.entity{.ts,.js}'],
//   logging: false,
//   autoLoadEntities: true,
//   synchronize: true,
//   dropSchema: false
// } as DataSourceOptions);

// export { connectionSource };