//no typescript para dizermos que a variavel é uma instancia da importação, utilizamos
//a primeira letra maiuscula
import Knex from "knex";

//informando que o parametro knex é do tipo Knex
export async function up(knex: Knex) {
  //criando uma tabela com o nome point_items
  return knex.schema.createTable("point_items", (table) => {
    //o campo id possui autoIncrement
    table.increments("id").primary();
    //chave estrangeira point_id que referencia ID na tabela points
    table.integer("point_id").notNullable().references("id").inTable("points");
    table.integer("item_id").notNullable().references("id").inTable("items");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("point_items");
}
