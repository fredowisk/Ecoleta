import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    //transformando o parâmetro items em um array, pois ele está vindo em formato de String
    //ex: "1,2,3,4,5", transformado em ['1', '2', '3'], e utilizando o map, para retirar os espaços
    //caso após a virgula ele for assim: 1,        2,     3,4,5
    const parsedItems = String(items)
    .split(',')
    .map(item=> Number(item.trim()));

    //procurando na tabela points
    const points = await knex('points')
    //criando um join, entre a tabela pivot e a points
    .join('point_items', 'points.id', '=', 'point_items.point_id')
    //procurando se os items passados na query estão registrados no campo item_id do banco de dados
    .whereIn('point_items.item_id', parsedItems)
    .where('city', String(city))
    .where('uf', String(uf))
    //usando o distinct para ele não trazer tabelas repetidas, mas sim as distintas
    .distinct()
    //trazendo todos os dados apenas da tabela points
    .select('points.*');

    //para cara point no array de points
    const serializedPoints = points.map(point => {
      return { 
        //pegue todas as informações
        ...point,
        //e acrescente a image_url
        image_url: `${process.env.LOCAL_HOST}/uploads/images/${point.image}`,
      }
    })
    //retorne os pontos alterados
    return response.json(serializedPoints);
  }

  async show(request: Request, response: Response) {
    //pegando o id dos parâmetros
    const { id } = request.params;

    //procure na tabela points, onde o id seja igual ao id informado
    //retorne apenas o primeiro, assim a variavel point não será um array
    const point = await knex("points").where("id", id).first();

    if (!point) {
      return response.status(400).json({ message: "Point not found." });
    }
  
    //criando um objeto que vai receber todas as propriedades do point
    // e uma nova propriedade image_url
    const serializedPoint = {
        ...point,
        image_url: `${process.env.LOCAL_HOST}/uploads/images/${point.image}`,
      }

//criando um join, onde o id do point tem que ser ao igual ao id da tabela pivot
    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      //onde o id do join deve ser igual ao id informado na url
      .where("point_items.point_id", id)
      //e deve ser retornado apenas o titulo dos itens
      .select('items.title');

    return response.json({point: serializedPoint, items});
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    //criando um transaction para caso a segunda query falhar, a primeira não executar
    const trx = await knex.transaction();

    const point = {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      image: request.file.filename,
    };

    //quando inserimos algo em uma tabela utilizando o knex ele retorna um array de Ids, para cada tabela inserida,
    //e no caso como fizemos apenas uma inserção, ele retornou apenas 1 posição no array
    //então iremos utilizar esse id na tabela pivot
    const insertedIds = await trx("points").insert(point);

    //pegando a primeira posição do array de ids
    const point_id = insertedIds[0];

    const pointItems = items
    //dividindo os items na virgula, transformando a variavel em um vetor
    .split(',')
    //utilizando o trim, para eliminar espaços de cada posição do vetor
    //e o number para transformar as strings em números
    .map((item: string) => Number(item.trim()))
    //inserindo na tabela pivot o id que foi retornado
    .map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    });

    //inserindo a relação entre as duas tabelas
    await trx("point_items").insert(pointItems);

    //se não colocamos o commit as trx nunca irão terminar e serão executadas até dar timeout
    await trx.commit();

    //criando como será o retorno da função
    return response.json({
      id: point_id,
      ...point,
    });
  }
}
export default PointsController;
