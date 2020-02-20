import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../containers/Login';
import RootNavigation from './rootNavigation';

const Stack = createStackNavigator();

export default function StackNavigation() {
  return (
    <Stack.Navigator headerMode="none" initialRouteName={ true ? 'Login' : 'RootNavigation'}>
      <Stack.Screen
            name="Login"
            component={Login}
            title=""
            options={{ headerTitle: '' }}
        />
        <Stack.Screen
            name="RootNavigation"
            component={RootNavigation}
            title=""
            options={{ headerTitle: '' }}
        />
    </Stack.Navigator>
  );
};