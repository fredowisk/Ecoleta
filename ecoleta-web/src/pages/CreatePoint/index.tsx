import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

import Dropzone from '../../components/Dropzone';

import "./styles.css";

import logo from "../../assets/logo.svg";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECITYResponse {
  nome: string;
}

const CreatePoint = () => {
  //criando um vetor de itens
  const [items, setItems] = useState<Item[]>([]);
  //criando um vetor de strings para estados
  const [ufs, setUfs] = useState<string[]>([]);
  //criando um vetor de string para cidades
  const [cities, setCities] = useState<string[]>([]);
  //começando com o valor 0, para ele começar no select 'Selecione um UF'
  const [selectedUf, setSelectedUf] = useState('0');
  //estado que vai começar no valor 0
  const [selectedCity, setSelectedCity] = useState('0');
  //criando um array que vai possuir apenas duas posições, iniciando elas em 0
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  //pegando a posição inicial do usuário
  const [initialPosition, setinitialPosition] = useState<[number, number]>([0, 0]);
//armazenando os itens selecionados
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
//armazenando o arquivo selecionado       o File é um objeto global do JS
  const [selectedFile, setSelectedFile] = useState<File>();

  //criando um state que vai possuir um objeto com email, nome, whatsapp
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  const history = useHistory();

  useEffect(() => {
    //o navigator é uma viaravel global do navegador, que vai pegar a localização do usuário que acessar o app
    navigator.geolocation.getCurrentPosition(position => {
      const {latitude, longitude} = position.coords;

      setinitialPosition([latitude, longitude]);
    })
  },[]);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    //utilizando o axios, para não precisarmos utilizar nossa api que está setada no baseURL
    //a interface após o get significa o retorno que ela irá receber no response
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(
      response => {
        //mapeando o response, para que ele retorne apenas as siglas dos estados
        //pois essa será a unica informação que iremos utilizar
        const ufInitials = response.data.map(uf => uf.sigla);

        setUfs(ufInitials);
      }
    );
  } ,[]);

  useEffect(() => {
    //retorne caso seja 0, para não ficar executando atoa

    if(selectedUf === '0') return;

    //pegando o nome das cidades
    axios
    .get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(
      response => {
        const cityNames = response.data.map(city => city.nome);

        setCities(cityNames);
      }
    )
  }, [selectedUf]);

  //o changeEvent é um evento que é disparado na mudança do valor de um select, input etc
  //avisando o ChangeEvent que estamos alterando um elemento select do HTML
  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedUf(event.target.value);
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(event.target.value);
  }

  //evento que vai receber o click do mouse no mapa
  function handleMapClick(event: LeafletMouseEvent) {
    //setando a latitude e a longitude
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng,
    ]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const {name, value} = event.target;

    //colocando os valores antigos dentro do objeto, caso eles não tenham sido alterados
    //e colocando o novo valor dentro da propriedade que vai vim do event.target
    //no caso essa propriedade vai cair dentro da variavel name
    setFormData({...formData, [name]: value});
  }

  function handleSelectedItems(id: number){
    //verificando se o array de itens selecionados possui algum item com esse id
    const alreadySelected = selectedItems.findIndex(item => item === id);

    if(alreadySelected >= 0) {
      //filtrando os itens, para pegar aqueles que sejam diferentes do id selecionado, para remover ele do estado
      const filteredItems = selectedItems.filter(item => item !== id);

      setSelectedItems(filteredItems);
    } else {
    setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    //inpedindo que ao submitar o form, ele utilize a lógica do HTML que é
    //navegar nossa aplicação para outra tela
    event.preventDefault();

    const {name, email, whatsapp} = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;
    
    //objeto global do JS que me permite criar um multipart
    const data = new FormData();

      data.append('name', name);
      data.append('email', email);
      data.append('whatsapp', whatsapp);
      data.append('uf', uf);
      data.append('city', city);
      data.append('latitude', String(latitude));
      data.append('longitude', String(longitude));
      data.append('items', items.join(','));

      if(selectedFile) {
        data.append('image', selectedFile);
      } else {
        return;
      }

    //criando o ponto de coleta
    await api.post('points', data);

    //redirecionando o usuário de volta para a Home 
    history.push('/');
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>
    {/* Função que será executada, assim que o usuário der um submit no form */}
      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do
          <br /> ponto de coleta
        </h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" onChange={handleInputChange}/>
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" onChange={handleInputChange}/>
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange}/>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
            </div>

{/* Colocando o mapa na tela do usuário, passando a latitude e longitude por meio
da variavel initial position, que vai pegar a localização do usuário e setar ela no mapa*/}
            <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
{/* Setando em qual posição a marca deve ficar, quando clicar no mapa */}
        <Marker position={selectedPosition} />
            </Map>

{/* Passando os estados para dentro do select, utilizando o map */}
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              {/* passando o atributo onChange, para que toda vez que o select seja modificado
              ele utilize a função handleSelectUf para fazer o useEffect ser disparado.
              Passando o value={uf} para que toda vez que a variavel uf mudar, ela mudar o select também*/}
              <select 
              name="uf" 
              id="uf" 
              value={selectedUf} 
              onChange={handleSelectUf}>

                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            {/* Carregando as cidades que vieram da api*/}
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select 
              name="city" 
              id="city"
              value={selectedCity}
              onChange={handleSelectedCity}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          </div>
          {/* carregando os itens em tela */}
          <ul className="items-grid">
            {items.map(item =>(
            <li 
            key={item.id} 
            onClick={() => handleSelectedItems(item.id)} 
            //Caso o array de itens selecionados possua o ID do item selecionado, coloque o nome da classe
            //como selected para que o CSS coloque bordas nela, caso contrário deixe vazia.
            className={selectedItems.includes(item.id) ? 'selected' : ''}>
              <img src={item.image_url} alt={item.title}/>
              <span>{item.title}</span>
            </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  );
};

export default CreatePoint;
