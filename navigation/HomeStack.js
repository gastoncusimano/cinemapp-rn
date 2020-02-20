import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, Dimensions, SafeAreaView } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import DrawerContent from './drawerContent'
import Home from '../containers/Home'
import ShowItem from '../containers/pages/ShowItem'
import ShowVideo from '../containers/pages/ShowVideo'
import {MaterialCommunityIcons, Ionicons} from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const Header = ({ scene, previous, navigation }) => {
    const { options } = scene.descriptor;
    console.log(scene.route.name)
    return (
      <SafeAreaView style={{position: 'absolute', top: 20, flex: 1}}>
          { previous ?
                null
            : <TouchableOpacity
                onPress={() => {
                    navigation.openDrawer();
                }}
                style={{height: 50}}
                >
                <MaterialCommunityIcons  name="menu"
                    size={30}
                    color="white" 
                    style={{
                            position: 'absolute',
                            left: 10, 
                            top: 22,
                            zIndex: 10, 
                            opacity: 0.93,
                            textShadowColor: 'black',
                            textShadowRadius: 10,
                            textShadowOffset: {width: 3, height: 1}}}/>
            </TouchableOpacity> }
        { !previous &&
            <Image
                style={{width: 115, height: 18, borderRadius: 5, marginVertical: 10, marginLeft: '45%', marginTop: previous ? 30 :-18 }}
                source={ require('../assets/logo.png')}
            />
        }
      </SafeAreaView>
    );
  };

function HomeScreen() {
  return (
    <Stack.Navigator headerMode="screen" initialRouteName={"Home"}
        screenOptions={{
        header: ({ scene, previous, navigation }) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        ),
      }}>
      <Stack.Screen
            name="Home"
            component={Home}
            title=""
            options={{ headerTitle: '' }}
        />
        <Stack.Screen
            name="ShowItem"
            component={ShowItem}
            title=""
            options={{ headerTitle: '' }}
        />
        <Stack.Screen
            name="ShowVideo"
            component={ShowVideo}
            title=""
            options={{ headerTitle: '' }}
        />
    </Stack.Navigator>
  );
};

export default function DrawerHeader() {
  return (
    // <Drawer.Navigator>
    <Drawer.Navigator drawerContent={() => <DrawerContent />}>
      <Drawer.Screen name="Home" component={HomeScreen} options={{gestureEnabled: true}} />
    </Drawer.Navigator>
  );
};