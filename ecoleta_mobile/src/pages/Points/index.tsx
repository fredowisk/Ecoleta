import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import Geolocation from 'react-native-geolocation-service';
import api from '../../services/api';

import {
  Container,
  Title,
  Description,
  MapContainer,
  Item,
  ItemTitle,
  ItemsContent,
  MapMarkerContainer,
  MapMarkerTitle,
  ItemsContainer,
} from './styles';
import { Image, SafeAreaView, PermissionsAndroid, Alert } from 'react-native';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface Params {
  uf: string;
  city: string;
}

const Points = () => {
  function componentDidMount() {}
  //array de itens
  const [items, setItems] = useState<Item[]>([]);
  //array de pontos
  const [points, setPoints] = useState<Point[]>([]);
  //array de ids, para saber quais itens estão selecionados
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  //array de posição inicial do mapa
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);
  //navegação de telas
  const navigation = useNavigation();
  //pegando a rota, para pegar os parâmetros passados por ela
  const route = useRoute();
  //definindo que os route params vão ser do tipo da interface Params
  const routeParams = route.params as Params;

 //useEffect que vai pegar a localização atual do usuário 
  useEffect(() => {
    async function loadPosition() {
      try {
        //pegando a permissão para obter a localização
        const permissionGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permissão de localização',
            message: 'A aplicação precisa da permissão de localização',
            buttonPositive: 'ok',
          },
        );
        //se a permissão for concedida...
        if (permissionGranted === PermissionsAndroid.RESULTS.GRANTED) {
          //pegue a localização atual, e de um set no state com as informações
          Geolocation.getCurrentPosition(
            pos => {
              setInitialPosition([
                pos.coords.latitude,
                pos.coords.longitude,]
              );
            }
          );
          //caso a permissão não for concedida
        } else {
          Alert.alert('Permissão de localização não concedida');
        }
      } catch (err) {
        throw new Error(err);
      }
    }

    loadPosition();
  }, []);

  //Fazendo a requisição na api para carregar os itens em tela
  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('points', {
      //parâmetros passados na rota
      params: {
        city: routeParams.city,
        uf: routeParams.uf,
        items: selectedItems,
      }
    }).then(response => {
      setPoints(response.data);
    })//toda vez que o usuário selecionar ou tirar a seleção um item, eles devem ser recarregados
    //fazendo que a marca do mapa do google apareça ou suma, mostrando ou escondendo o ponto
  }, [selectedItems]);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    //tudo o que vier após a virgula, será enviado como parâmetro para a próxima rota
    navigation.navigate('Detail', {point_id: id});
  }

  function handleSelectItem(id: number) {
    //verificando se já está selecionado
    const alreadySelected = selectedItems.findIndex(item => item === id);

    //se já estiver selecionado...
    if (alreadySelected >= 0) {
      //pegue todos os itens que o id não seja igual ao do parâmetro
      const filteredItems = selectedItems.filter(item => item !== id);

      //coloque todos os itens que tenham o id diferente nos itens selecionados
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>
        <Title>Bem vindo.</Title>
        <Description>Encontre no mapa um ponto de coleta.</Description>

        <MapContainer>
          {/* Se o mapa já tiver uma localização, carregue ele */}
          { initialPosition[0] !== 0 && (
            <MapView
            style={{ width: '100%', height: '100%' }}
            initialRegion={{
              latitude: initialPosition[0],
              longitude: initialPosition[1],
              latitudeDelta: 0.0043,
              longitudeDelta: 0.0034,
            }}
          >
            {/* Carregando os pontos em tela */}
            {points.map(point => (

            <Marker
              key={point.id}
              style={{
                width: 90,
                height: 80,
              }}
              onPress={() => handleNavigateToDetail(point.id)}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
            >
              <MapMarkerContainer>
                <Image
                  style={{ width: 90, height: 45 }}
                  source={{
                    uri: point.image_url
                  }}
                />
                <MapMarkerTitle>{point.name}</MapMarkerTitle>
              </MapMarkerContainer>
            </Marker>
            ))}

          </MapView>
          )}
        </MapContainer>
      </Container>
      <ItemsContainer>
        <ItemsContent>
          {/* Mapeando os itens para aparecerem na tela */}
          {items.map(item => (
            <Item
              onPress={() => handleSelectItem(item.id)}
              key={item.id}
              selected={selectedItems.includes(item.id)}
            >
              <SvgUri width={36} height={36} uri={item.image_url} />
              <ItemTitle>{item.title}</ItemTitle>
            </Item>
          ))}
        </ItemsContent>
      </ItemsContainer>
    </SafeAreaView>
  );
};

export default Points;
