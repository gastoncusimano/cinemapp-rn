import React from 'react';
import { Text, View, Dimensions} from 'react-native';
const DEVICE_HEIGHT = Dimensions.get('window').height
const DEVICE_WIDTH = Dimensions.get('window').width

export default function DrawerContent() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: DEVICE_HEIGHT, backgroundColor: 'black'}}>
        <Text style={{color: 'white'}}>Drawer content</Text>
      </View>
    );
  }