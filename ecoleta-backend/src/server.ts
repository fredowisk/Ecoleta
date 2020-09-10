require("dotenv").config();

import express from 'express';
import cors from 'cors';
import routes from './routes';
import path from 'path';
import {errors} from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

//função do express para arquivos estáticos como imagens e pdfs
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

//lidando com a forma que retornamos os erros para o front-end
app.use(errors());

app.listen(3333);