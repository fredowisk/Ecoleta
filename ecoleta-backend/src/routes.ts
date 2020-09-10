import express from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
//atribuindo a configuração que criamos ao multer, passando tudo para a variavel upload
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

//request obter dados da aplicação
//response devolver uma resposta
routes.get('/items', itemsController.index);

//rota que cria um novo ponto de coleta
//passando o upload.single pois queremos fazer o upload de apenas 1 imagem por vez
//e o 'image' significa o nome que o campo vai receber após a criação
routes.post('/points', 
upload.single('image'),
//fazendo verificação dos campos
celebrate({
  //quando utilizamos multipart, ou JSON, sempre irá fazer parte do BODY
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    whatsapp: Joi.number().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    city: Joi.string().required(),
    uf: Joi.string().required().max(2),
    items: Joi.string().required().regex(/\d\,/),
  },
}, {
  abortEarly: false
}),
pointsController.create);

//rota que busca todos os pontos cadastrados
routes.get('/points', pointsController.index);

//rota que busca um ponto especifico
routes.get('/points/:id', pointsController.show);

export default routes;