import React from 'react';
import {StatusBar} from 'react-native';

import Routes from './src/routes';

const App = () => {
  return (
    <>
    {/* deixando a status bar com icones escuros
    transformando o fundo dela em transparente
    e deixando ela translucent, para que nosso App 
    possa ocupar até o fundo dela */}
      <StatusBar 
      barStyle={"dark-content"} 
      backgroundColor="transparent" 
      translucent />
      <Routes />
    </>
  );
};

export default App;
