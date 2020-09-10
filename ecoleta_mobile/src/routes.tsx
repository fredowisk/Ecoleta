import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';

import Home from './pages/Home';
import Points from './pages/Points';
import Detail from './pages/Detail';

//o stack vai criar uma pilha de rotas, para conseguirmos navegar
const AppStack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator 
      //retirando o header
      headerMode="none" 
      //adicionando fundo cinza em todas as rotas
      screenOptions={{ 
        cardStyle: {
          backgroundColor: '#f0f0f5'
        }
      }}>
        <AppStack.Screen 
        //Rota e componente que será mostrado
        name="Home" component={Home}/>

        <AppStack.Screen 
        name="Points" component={Points}/>

        <AppStack.Screen 
        name="Detail" component={Detail}/>
      </AppStack.Navigator>
    </NavigationContainer>
  )
}

export default Routes;