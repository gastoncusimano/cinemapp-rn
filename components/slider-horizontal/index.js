import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, Animated } from 'react-native';
import Svg, {
  Line,
} from 'react-native-svg';
import ItemSlider from './item' 
const DEVICE_HEIGHT = Dimensions.get('window').height
const DEVICE_WIDTH = Dimensions.get('window').width
const IMG_URL = "https://image.tmdb.org/t/p/original"

const FadeInView = (props) => {
  const [fadeAnim] = useState(new Animated.Value(0))
  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: props.duration || 600,
        delay: props.delay
      }
    ).start();
  }, [])

  return (
    <Animated.View                
      style={{
        ...props.style,
        opacity: fadeAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
}

export default function SliderHorizontal(props) {
    return (
      <View style={styles.container}>
        <FadeInView delay={2100 + (props.moreDelay || 0)} duration={300}>
          <View style={{backgroundColor: 'black'}}>
            <Text key="HeaderText" style={styles.headerText}>{props.sliderTitle}
              <Svg height='5' width={DEVICE_WIDTH} style={{zIndex: 1, position: 'absolute'}}>
                <Line x1="20" y1="0" x2="500" y2="0" stroke="white" strokeWidth="0.5" />
              </Svg>
            </Text>
          </View>
         
          {props.movies &&
            <FlatList
            style={{marginBottom: 55}}
            key="HeaderText2"
            horizontal
            renderItem={(item) => <ItemSlider item={item} IMG_URL={IMG_URL} navigation={props.navigation} />}
            data={props.movies}
            keyExtractor={(item,index) => item.id.toString()}
            ItemSeparatorComponent={() => <View style={{width: 12}}/>}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
            onEndReached={props.loadMore ? props.loadMore : null }
            onEndReachedThreshold={3}
            refreshing={props.refreshing}
            />
          }
        </FadeInView>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginStart: 7,
    zIndex: 5
  },
  headerText: {
    color: 'white',
    paddingBottom: 15,
    fontSize: DEVICE_HEIGHT >= 768 ? 45 : 18,
  },
});
