//En este archivo se configura la conexión a la base de datos
//Esto se vede proveer o inyectar en el modulo (database.module.ts)
import { DataSource } from "typeorm";

export const databaseProviders = [{
  provide: 'DATA_SOURCE',
  useFactory: async () => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      // username: process.env.DB_USERNAME,
      username: 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, //No usar en producción
    });

    return dataSource.initialize();
  }
}];