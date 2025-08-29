import { MikroORM } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

export const orm = await MikroORM.init({

  //TODO: Configuración básica del ORM
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.js'],
  dbName: 'kayakbrokers',
  driver: MySqlDriver,
  clientUrl: 'mysql://dsw:dsw@localhost:3306/kayakbrokers',
  highlighter: new SqlHighlighter(),
  debug: true,

  //TODO Configuración del ORM para generar el esquema en la BD
  schemaGenerator:{ //! Utilizar solo para el desarrollo; nunca en producción
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: []
  }
})

export const syncSchema = async() => {
  const generator = orm.getSchemaGenerator()
  /*
  await generator.dropSchema()
  await generator.createSchema()
  */
  await generator.updateSchema()
}