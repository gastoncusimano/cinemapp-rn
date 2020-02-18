import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './containers/Home'
import ShowItem from './containers/ShowItem'
import ShowVideo from './containers/ShowItemVideo'



const Stack = createStackNavigator();

export default function App() {
  const MyTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
      background: 'rgb(0,0,0)',
      primary: 'rgb(255, 45, 85)',
    },
  };
  const config = {
    animation: 'spring',
    config: {
      stiffness: 500,
      damping: 70,
      mass: 5,
      overshootClamping: true,
      restDisplacementThreshold: 0.21,
      restSpeedThreshold: 0.21,
    },
  };
  return (
      <NavigationContainer theme={MyTheme} >
      <Stack.Navigator headerMode='none'>
        <Stack.Screen
            name="Home"
            component={Home}
            options={{
              title: "",
              headerTransparent: true,
              gestureEnabled: true,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureResponseDistance: {
                vertical: 400
              },
              safeAreaInsets: {
                top: 30
              }
            }}
          />
        <Stack.Screen
            name="ShowItem"
            component={ShowItem}
            options={{
              title: "",
              gestureEnabled: true,
              headerTransparent: true,
              transitionSpec: {
                open: config,
                close: config,
              },
              gestureResponseDistance: {
                vertical: 220
              },
              safeAreaInsets: {
                top: 30
              }
            }}
        />
        <Stack.Screen
          name="ShowVideo"
          component={ShowVideo}
          options={{
            title: "",
            headerTransparent: true,
            gestureEnabled: false,
            animationEnabled: false,
            safeAreaInsets: {
              top: 0,
            }
          }}
        />
      </Stack.Navigator>
      </NavigationContainer>
    );
}
