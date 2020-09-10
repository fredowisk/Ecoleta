//no typescript para dizermos que a variavel é uma instancia da importação, utilizamos
//a primeira letra maiuscula
import Knex from "knex";

//informando que o parametro knex é do tipo Knex
export async function up(knex: Knex) {
  //criando uma tabela com o nome items
  return knex.schema.createTable("items", (table) => {
    //o campo id possui autoIncrement
    table.increments("id").primary();
    table.string("image").notNullable();
    table.string("title").notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("items");
}
