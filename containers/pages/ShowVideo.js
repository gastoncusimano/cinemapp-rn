import React, {useState, useEffect, Component} from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity, SafeAreaView, Dimensions} from 'react-native';
import {Ionicons, EvilIcons} from '@expo/vector-icons'
import { WebView } from 'react-native-webview';

const DEVICE_HEIGHT = Dimensions.get('window').height
const DEVICE_WIDTH = Dimensions.get('window').width

export default function ShowVideo(props) {
    const video = props.route.params.video
    return (
      <View style={styles.container}>
            <Ionicons name="ios-arrow-back" size={35} color="white" onPress={() => props.navigation.goBack()} style={{position: 'absolute', top: 45, left: 25, zIndex: 10}}/>
            { video ? 
                    <WebView
                    style={{marginTop: 25}}
                    javaScriptEnabled={true}
                    scalesPageToFit={true}
                    autoplay
                    source={{
                      uri: `https://www.youtube.com/embed/${video}?autoplay=1`
                    }} />
            : null}
            <Image
              style={styles.shadowImgRotated}
              source={ require('../../assets/shadow.png')}
              resizeMode={'repeat'}
              />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    height: '100%',
    flex: 1,
  },

  shadowImgRotated: {
    position: 'absolute',
    zIndex: 1, 
    width: '100%', 
    opacity: 0.95, 
    height: 300, 
    top: DEVICE_WIDTH >= 768 ? -140 : - 180, 
    transform: [{rotate: '180deg'}],
  },
});