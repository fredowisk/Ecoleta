// o multer é uma biblioteca que cuida do upload de imagens
import multer from 'multer';
//sempre que formos utilizar caminhos para acessar pastas ou arquivos,
//devemos utilizar o path do node
import path from 'path';

//biblioteca nativa do node que gera um hash aleatório
import crypto from 'crypto';

//exportando o local onde está salvo as imagens
export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads', 'images'),
    //request que vem do frontend, file é o arquivo que está sendo recebido,
    //e callback é a função que será chamada após tudo ter sido executado
    filename(request, file, callback) {
      //gerando um hash hexadecimal de 6 bytes do tipo string 
      const hash = crypto.randomBytes(6).toString('hex');

      //criando um novo nome para o arquivo, utilizando o hash e o nome original
      const fileName = `${hash}-${file.originalname}`;

      //o primeiro parâmetro é um erro, caso algo acima tenha dado errado
      //por isso iremos passar null, pois sabemos que é muito improvavel
      //que aconteça um erro
      //e o segundo parâmetro é o nome do arquivo, caso ele seja criado
      callback(null, fileName);
    }
  }),
}