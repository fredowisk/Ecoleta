import React, {useState, useEffect} from 'react';

import { Image, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native'
import axios from 'axios';

import {Container,
  Main,
  Title,
  Description,
  Footer,
  Input,
  Button,
  ButtonIcon,
  ButtonText} from './styles';

import Logo from '../../assets/logo.png';
import Background from '../../assets/home-background.png';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECITYResponse {
  nome: string;
}

const Home = () => {
  //criando um array de string para estados
  const [ufs, setUfs] = useState<string[]>([]);
  //criando um array de string para cidades
  const [cities, setCities] = useState<string[]>([]);
  //começando com o valor 0, para ele começar no select 'Selecione um UF'
  const [selectedUf, setSelectedUf] = useState('0');
  //começando com o valor 0, para ele começar no select 'Selecione um UF'
  const [selectedCity, setSelectedCity] = useState('0');
  //variavel para fazer navegação entre as telas
  const navigation = useNavigation();

  //buscando os estados na Api e colocando eles em tela
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
  }, []);

  //buscando na api as cidades e colocando elas em tela
  useEffect(() => {
    //se o estado selecionado for 0 interrompa retorne a função imediatamente
    if(selectedUf === '0') return;  
    //buscando as cidades na api do ibge
    axios.get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(
      response => {
        //pegando apenas o nome das cidades
        const cityNames = response.data.map(city => city.nome);
        //setando os nomes no array
        setCities(cityNames);
      }
    );
    //este useEffect depende deste estado, toda vez que o estado for alterado, o useEffect irá recarregar
    //e fazer outra requisição a api do ibge, trazendo novas cidades
  }, [selectedUf]);

  //função que vai fazer o usuário navegar para outra tela
  function handleNavigateToPoints() {
    //passando os valores que irão na rota
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity,
    });
  }

  return (
    <Container 
    source={Background} 
    //ajustando a imagem dentro do app
    imageStyle={{ width: 274, height: 386}}
    >
      <Main>
         <Image source={Logo}/>
         <Title>Seu marketplace de coleta de resíduos</Title>
         <Description>Ajudamos pessoas a encontrarem
         pontos de coleta de forma eficiente.
         </Description>
      </Main>
      <Footer>
        <Input>
        {/* pegando o valor selecionado, quando o valor for alterado, 
        chame a função e passe o valor novo */}
          <Picker 
          selectedValue={selectedUf} 
          //Como o valor recebido no onChange é unico, já podemos setar ele no state desta forma
          onValueChange={setSelectedUf} 
          >
            {/* Label pra dar inicio a aplicação */}
            <Picker.Item value='0' label='Selecione uma UF' />
            {/* fazendo um .map para carregar as ufs na tela */}
          {ufs.map(uf => (
            <Picker.Item key={uf} value={uf} label={uf} />
          ))}
          </Picker>
        </Input>
        <Input>
        {/* pegando o valor selecionado, quando o valor for alterado, 
        chame a função e passe o valor novo */}
          <Picker 
          selectedValue={selectedCity} 
          //Como o valor recebido no onChange é unico, já podemos setar ele no state desta forma
          onValueChange={setSelectedCity} 
          >
            {/* Label pra dar inicio a aplicação */}
            <Picker.Item value='0' label='Selecione uma Cidade' />
            {/* fazendo um .map para carregar as cidades na tela */}
          {cities.map(city => (
            <Picker.Item key={city} value={city} label={city} />
          ))}
          </Picker>
        </Input>
        <Button onPress={handleNavigateToPoints}>
          <ButtonIcon>
              <Icon 
              name="arrow-right" 
              color="#FFF" 
              size={24} 
              onPress={()=> {}}
              />
          </ButtonIcon>
        <ButtonText>Entrar</ButtonText>
        </Button>
      </Footer>
  
    </Container>
  );
};

export default Home;
