//no typescript para dizermos que a variavel é uma instancia da importação, utilizamos
//a primeira letra maiuscula
import Knex from "knex";

//informando que o parametro knex é do tipo Knex
export async function up(knex: Knex) {
  //criando uma tabela com o nome points
  return knex.schema.createTable("points", (table) => {
    //o campo id possui autoIncrement
    table.increments("id").primary();
    table.string("image").notNullable();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("whatsapp").notNullable();
    table.decimal("latitude").notNullable();
    table.decimal("longitude").notNullable();
    table.string("city").notNullable();
    table.string("uf", 2).notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("point");
}
