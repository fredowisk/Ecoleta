import React, { useEffect, useState } from 'react';

import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  Container,
  PointImage,
  PointName,
  PointItems,
  Address,
  AddressTitle,
  AddressContent,
  Footer,
  Button,
  ButtonText,
} from './styles';
import { TouchableOpacity, SafeAreaView, SegmentedControlIOS } from 'react-native';
import api from '../../services/api';
import { Linking } from 'react-native';

interface Params {
  point_id: number;
}

interface Data {
  point: {
    image: string;
    image_url: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  },//array de itens
  items: {
    title: string;
  }[];
}

const Detail = () => {
  //estado que vai receber os points e os itens
  //dizendo para o TS que ele vai receber um objeto do mesmo tipo do Data
  const [data, setData] = useState<Data>({} as Data);

  const navigation = useNavigation();
  const route = useRoute();

  //dizendo para o typescript que o routeParams será do mesmo tipo que a interface
  const routeParams = route.params as Params;

  //componente que será carregado em tela
  useEffect(() => {
    //pegando os points
    api.get(`/points/${routeParams.point_id}`).then(response => {
      //setando os objetos point e items
        setData(response.data);
      }
    );
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  }

  //função que cria o escopo de um e-mail e abre o app do g-mail
  async function handleComposeMail() {

    const subject = 'Interesse na coleta de resíduos';

    //criando um link de email
    const url = `mailto:${data.point.email}?${subject}`;

    //verificando se podemos utilizar o link
    const canOpen = await Linking.canOpenURL(url);

    if(!canOpen) {
      throw new Error('Falha ao reconhecer e-mail');
    }

    return Linking.openURL(url);
  }

  //Função que vai abrir o whatsapp na conversa do número cadastrado
  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse sobre coleta de resíduos`)
  }

  //se o point estiver vazio, isso significa que ele ainda não foi carregado,
  //então não retorne nada
  if(!data.point) {
    return null;
  }

  return (
    //o SafeAreaView faz o padding automaticamente, principalmente do iPhone
    //para nada ficar maior do que a própria tela do celular 
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <PointImage
          source={{
            uri: data.point.image_url
          }}
        />

        <PointName>{data.point.name}</PointName>
          {/* Unindo os vetores e separando eles por virgula */}
        <PointItems>{data.items.map(item => item.title).join(',')}</PointItems>

        <Address>
          <AddressTitle>Endereço</AddressTitle>
          <AddressContent>{data.point.city}, {data.point.uf}</AddressContent>
        </Address>
      </Container>

      <Footer>
        <Button onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#FFF" />
          <ButtonText>Whatsapp</ButtonText>
        </Button>

        <Button onPress={handleComposeMail}>
          <Icon name="mail" size={20} color="#FFF" />
          <ButtonText>E-mail</ButtonText>
        </Button>
      </Footer>
    </SafeAreaView>
  );
};

export default Detail;
