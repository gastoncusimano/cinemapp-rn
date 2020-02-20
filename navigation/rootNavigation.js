import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack'
import ListsStack from './ListsStack'
import SearcherStack from './SearcherStack'
import {MaterialCommunityIcons, Ionicons} from '@expo/vector-icons'

const Tab = createBottomTabNavigator();

export default function App() {
  return (
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'feature-search' : 'feature-search-outline';
          } else if (route.name === 'Lists') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'white',
        inactiveTintColor: 'white',
        activeBackgroundColor: 'black',
        inactiveBackgroundColor: 'black',
        showLabel: false,
        style: {
            borderTopColor: 'black',
            backgroundColor: 'black',
            paddingBottom: 5
        }
      }}>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Search" component={SearcherStack} />
        <Tab.Screen name="Lists" component={ListsStack} />
      </Tab.Navigator>
  );
}