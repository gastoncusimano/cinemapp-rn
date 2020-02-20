import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Animated, TouchableWithoutFeedback, Dimensions} from 'react-native';
import SkeletonContent from "react-native-skeleton-content";
import Stars from 'react-native-stars';

import { Fetch } from '../../../helpers/Fetch'
import {EvilIcons, MaterialIcons} from '@expo/vector-icons'

import moment from "moment";

const IMG_URL = "https://image.tmdb.org/t/p/original"
const API_KEY = "api_key=76c7a1c86217796b701e803e006c5832"
const API_LANG = "en-Us"
const DEVICE_HEIGHT = Dimensions.get('window').height
const DEVICE_WIDTH = Dimensions.get('window').width

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

export default function LatestMovie(props) {
    const [state, setState] = useState({movie: {}, genres: [], isLoading: true})

    useEffect(() => {
      let movie = {}
      async function initializedData() {
        await Fetch.GET(`movie/latest?${API_KEY}&language=${API_LANG}`, (response) => response)
              .then((response) => {
                if (response) {
                  movie = response
                }
                return movie
              })
        await Fetch.GET(`genre/movie/list?${API_KEY}&language=${API_LANG}`, (response) => response)
          .then((response) => {
            if (response) {
              setState({ 
                ...state,
                movie: movie,
                genres: response.genres,
                isLoading: false
              })
            }
          })
      }
      initializedData()
    }, [])

    const getGenresPhrase = (genresIds) => {
      let genres = []
      if (genresIds.length > 0) {
        if (Number(genresIds[0]) !== NaN) {
          genresIds.map((genre) => {
            genres = genres.concat(state.genres.filter((x) => x.id === genre).map((x) => x.name ))
          })
        } else {
          genresIds.map((genre) => {
            genres = genres.concat(genre.name)
          })
        }
        return genres.length > 1 ? genres.slice(0, genres.length - 1).join(', ') + " and " + genres.slice(-1) : genres[0]
      } else {
        return ""
      }
    }
    
    return (
      <View style={styles.container}>
        <SkeletonContent
            containerStyle={{flex: 1, alignContent: 'center'}}
            boneColor="#121212"
            highlightColor="#2d2d2d"
            animationType="pulse"
            duration={1200}
            isLoading={state.isLoading}
            layout={[
            { width: DEVICE_HEIGHT >= 768 ? 550 : 195, height: DEVICE_HEIGHT >= 768 ? 100 : 55, position: 'absolute', bottom: 45 , left: 10, right: 0},
            { width: DEVICE_HEIGHT >= 768 ? 550 : 155, height: DEVICE_HEIGHT >= 768 ? 100 : 25, position: 'absolute', bottom: 5 , left: 10, right: 0},
            { width: DEVICE_HEIGHT >= 768 ? 350 : 65, height: DEVICE_HEIGHT >= 768 ? 60 : 65, position: 'absolute', top: '43%', left: '41%', right: 0},
            { width: DEVICE_HEIGHT >= 768 ? 350 : 85, height: DEVICE_HEIGHT >= 768 ? 60 : 75, position: 'absolute', bottom: 5, right: 10},
            ]}
            >
        
              {props.backupImage &&
                  <TouchableWithoutFeedback onPress={() => props.navigation.push('HomeStack', {
                    screen: 'ShowItem',
                    params: {item: props.backupImage}})}>
                      <ImageBackground
                          style={{width: '100%', height: '100%', zIndex: 1}}
                          source={{uri: `${IMG_URL}${props.backupImage.backdrop_path}`}}
                      >
                      <FadeInView delay={1200} style={{top: '42%', zIndex: 30}}>
                        <EvilIcons  name="play"
                                size={65}
                                color="white" 
                                onPress={() => props.navigation.push('HomeStack', {
                                  screen: 'ShowVideo',
                                  params: {video: state.videos[0].key}})} 
                                style={{
                                        left: '41%', 
                                        zIndex: 10, 
                                        opacity: 0.93,
                                        textShadowColor: 'black',
                                        textShadowRadius: 10,
                                        textShadowOffset: {width: 3, height: 1}}}/>
                      </FadeInView>
                      <FadeInView delay={800} style={{top: '64%', zIndex: 30}}>
                        <Text style={styles.headerText} key="HeaderText">
                          {props.backupImage.title.toUpperCase()} {"\n"}
                          <Text style={styles.rateText}>{getGenresPhrase(props.backupImage.genre_ids)}</Text>
                        </Text>
                      </FadeInView>
                      <FadeInView delay={1000}  style={styles.ratePanel}>
                        <Text style={{fontSize: 25, color: 'white', paddingLeft: 37, paddingVertical: 2, opacity: 0.8}}>
                          {props.backupImage.vote_average}
                        </Text>
                        <Stars
                          default={parseFloat((props.backupImage.vote_average / 2).toFixed(1))}
                          count={5}
                          half={true}
                          fullStar={<MaterialIcons size={18} name={'star'} style={[styles.myStarStyle]}/>}
                          emptyStar={<MaterialIcons size={18} name={'star-border'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
                          halfStar={<MaterialIcons size={18} name={'star-half'} style={[styles.myStarStyle]}/>}
                        />
                      </FadeInView>
                      <Image
                          style={styles.shadowImgRotated}
                        source={ require('../../../assets/shadow.png')}
                          resizeMode={'repeat'}
                          />
                      <Image
                        style={styles.shadowImg}
                        source={ require('../../../assets/shadow.png')}
                        resizeMode={'repeat'}
                        />
                      </ImageBackground>
                  </TouchableWithoutFeedback>
            }
        </SkeletonContent>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    height: DEVICE_HEIGHT >= 768 ? DEVICE_HEIGHT / 1.7 : DEVICE_HEIGHT / 1.8,
  },
  headerText: {
    width: '65%',
    zIndex: 3,
    fontSize: DEVICE_HEIGHT >= 768 ? 80 : 24,
    color: 'white',
    paddingHorizontal: 15,
    textShadowColor: 'black',
    textShadowRadius: 20,
    textShadowOffset: {width: 5, height: 5}
  },
  rateText: {
    fontSize: DEVICE_HEIGHT >= 768 ? 25 : 10,
    color: 'white',
    left: 0,
    right: 0,
    opacity: 0.4,
    textShadowColor: 'black',
    textShadowRadius: 20,
    textShadowOffset: {width: 1, height: 1}
  },
  buttonText:{
    marginTop: 150,
    fontSize: DEVICE_HEIGHT >= 768 ? 25 : 13,
    padding: 5,
    borderRadius: 25,
    backgroundColor: 'white',
    opacity: 0.8,
    color: 'black',
    position: 'absolute',
    left: '39.5%',
  },
  shadowImg: {
    position: 'absolute',
    zIndex: 1,
    width: '100%', 
    height: 300, 
    bottom:  DEVICE_WIDTH >= 768 ? -120 : DEVICE_WIDTH <= 640 ? -180 : 40
  },
  shadowImgRotated: {
    position: 'absolute',
    zIndex: 5, 
    width: '100%', 
    opacity: 0.75, 
    height: 300, 
    top: DEVICE_WIDTH >= 768 ? -140 : - 180, 
    transform: [{rotate: '180deg'}],
  },
  myStarStyle: {
    color: 'white',
    backgroundColor: 'transparent',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    paddingVertical: 5,
    opacity: 0.9
  },
  myEmptyStarStyle: {
    color: 'white',
    opacity: 0.9
  },
  ratePanel: {borderLeftColor: 'white', borderLeftWidth: 1, width: '30%', opacity: 0.6, position: 'absolute', top: '80%', right: 10, zIndex: 20}
  
});
