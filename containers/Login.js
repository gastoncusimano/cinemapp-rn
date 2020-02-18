import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput,ImageBackground, KeyboardAvoidingView} from 'react-native';
import Svg, { Image, Circle, ClipPath } from 'react-native-svg';

import Animated, { Easing } from 'react-native-reanimated';
import {Ionicons} from '@expo/vector-icons'
import { TapGestureHandler, State } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');

const {
  Value,
  event,
  block,
  cond,
  eq,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolate,
  Extrapolate,
  concat
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position
  ]);
}
class Login extends Component {
  constructor(props) {
    super(props);

    this.buttonOpacity = new Value(1);

    this.onStateChange = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
            )
          ])
      }
    ]);

    this.goToHome = () => {
      props.navigation.navigate('Home')
    };

    this.onCloseState = event([
        {
          nativeEvent: ({ state }) =>
            block([
              cond(
                eq(state, State.END),
                set(this.buttonOpacity, runTiming(new Clock(), 0, 1))
              )
            ])
        }
    ]);

    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP
    });
    this.buttonElevation = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [3,0],
      extrapolate: Extrapolate.CLAMP
    });
  
    this.bgY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [-height / 3 - 50, 0],
      extrapolate: Extrapolate.CLAMP
    });
    this.textInputZindex = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [1, -1],
        extrapolate: Extrapolate.CLAMP
    });
    this.textInputY = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [0, 100],
        extrapolate: Extrapolate.CLAMP
    });
    this.textInputOpacity = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [1, 0],
        extrapolate: Extrapolate.CLAMP
    });
    this.rotateCross = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [180, 360],
        extrapolate: Extrapolate.CLAMP
    });
  }

  render() {
    return (
      
      <KeyboardAvoidingView  style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-end'
      }} behavior="height" enabled>

        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            transform: [{ translateY: this.bgY }]
          }}
        > 
          <Svg height={height + 70} width={width}>
            <ClipPath id="circle_white">
              <Circle
                r={height + 70}
                cx={width / 2}
              />
            </ClipPath>
            <Image 
                href={require('../assets/bg.jpg')}
                width={width}
                height={height + 100}
                preserveAspectRatio="xMidyMid slice"
                clipPath="url(#circle_white)"
            />
            <Image 
                y={height /2 - 50}
                x={30}
                href={require('../assets/logo.png')}
                width={300}
                height={100}
                style={{zIndex: 30, position: 'absolute'}}
            />
          </Svg>
        </Animated.View>
        <View style={{ height: height / 3, justifyContent: 'center' }}>
          <TapGestureHandler onHandlerStateChange={this.onStateChange}>
            <Animated.View
              style={{
                ...styles.button,
                opacity: this.buttonOpacity,
                transform: [{ translateY: this.buttonY }]
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>SIGN IN</Text>
            </Animated.View>
          </TapGestureHandler>
          <Animated.View style={{zIndex: this.textInputZindex, opacity: this.textInputOpacity, transform: [{translateY: this.textInputY}], height: height / 3 - 10, ...StyleSheet.absoluteFill, top: null, justifyContent: 'center'}}>
                <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                    <Animated.View style={styles.closeButton}>
                        <Animated.Text style={{transform: [{rotate: concat(this.rotateCross, 'deg')}]}}>
                            <Ionicons name="ios-close" size={28} color="black"/>
                        </Animated.Text>
                    </Animated.View>
                </TapGestureHandler>
                <TextInput 
                    placeholder="Email"
                    style={styles.textInput}
                    placeholderTextColor="black"/>  
                <TextInput 
                    placeholder="Password"
                    style={styles.textInput}
                    placeholderTextColor="black"/>
                <TapGestureHandler onHandlerStateChange={this.goToHome}>
                  <Animated.View
                      style={{...styles.button, opacity: this.buttonElevation}}
                      >
                      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>SIGN IN</Text>
                  </Animated.View>
                </TapGestureHandler>
                <Text style={{paddingHorizontal: 30, textAlign: 'center', marginVertical:10}}>If you don't have an account you can get one clicking <Text style={{textDecorationLine:'underline'}}>here</Text></Text>
            </Animated.View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: 'white',
    height: 50,
    marginHorizontal: 55,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    shadowOffset:{ widht: 2, height: 2},
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 2,
    opacity: 0
  },
  textInput: {
      height: 50,
      borderRadius: 25,
      borderWidth: 0.5,
      marginHorizontal: 30,
      paddingLeft: 20,
      marginVertical: 5,
      borderColor: 'rgba(0,0,0,0.2)',
      color: 'black',
  },
  closeButton: {
    height: 40,
    width: 40,
    fontWeight:'bold',
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: -50,
    left: width /2 - 20,
    shadowOffset:{ widht: 2, height: 2},
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 3
  },
});