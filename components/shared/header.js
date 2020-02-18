import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, TouchableWithoutFeedbackBase } from 'react-native';
import {Ionicons} from '@expo/vector-icons'

export default function Header(props) {
  const [state, setState] = useState({results: []})
    useEffect(() => {
    }, [])

  return (
    <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => null}>
            <Icon name="ios-menu" color="white" size={35}/>
        </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
  },
});
