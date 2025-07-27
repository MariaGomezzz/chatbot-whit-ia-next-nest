//Archivo para configurar el repositorio de la entidad
//Esto se hace para poder ser inyectado en el servicio y 
// desde ahi hacer las consultas a la bases de datos

import { DataSource } from "typeorm";
import { BooksEntity } from "./books.entity";


export const BooksProviders =[
  {
    provide:'BOOKS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(BooksEntity),
    inject: ['DATA_SOURCE']
  }
];