import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, Animated } from 'react-native';
import ItemSlider from './item' 
const DEVICE_HEIGHT = Dimensions.get('window').height
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
        <FadeInView delay={1500 + (props.moreDelay || 0)}>
          <Text key="HeaderText" style={styles.headerText}> {props.sliderTitle}</Text>
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
    marginStart: 10,
    zIndex: 5
  },
  headerText: {
    color: 'white',
    marginTop: -40,
    paddingBottom: 15,
    fontSize: DEVICE_HEIGHT >= 768 ? 45 : 28,
  },
});
