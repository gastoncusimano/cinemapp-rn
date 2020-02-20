import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import StackNavigation from './navigation/stackNavigation';

export default function App() {
   const MyTheme = {
      dark: true,
      colors: {
        background: 'rgb(0,0,0)',
        primary: 'rgb(255, 45, 85)',
      },
    };
   return (
      <NavigationContainer theme={MyTheme}>
         <StackNavigation />
      </NavigationContainer>
   )
}

// props.navigation.navigate('HomeStack', {
// screen: 'ShowVideo',
// params: {}})}