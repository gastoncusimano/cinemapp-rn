import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Animated, TouchableWithoutFeedback, Dimensions} from 'react-native';
import SkeletonContent from "react-native-skeleton-content";
import { Fetch } from '../../../helpers/Fetch'

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
            { width: DEVICE_HEIGHT >= 768 ? 550 : 135, height: DEVICE_HEIGHT >= 768 ? 100 : 55, position: 'absolute', top: '33%', left: '33%', right: 0},
            { width: DEVICE_HEIGHT >= 768 ? 350 : 85, height: DEVICE_HEIGHT >= 768 ? 60 : 35, position: 'absolute', top: '48.5%', left: '38.5%', right: 0},
            ]}
            >
        
            {state.movie && 
                state.movie.backdrop_path != null ? 
                  <TouchableWithoutFeedback onPress={() => props.navigation.push('ShowItem', {item: state.movie})}>
                      <ImageBackground
                          style={{width: '100%', height: '100%', zIndex: 1}}
                          source={{uri: `${IMG_URL}${state.movie.backdrop_path}`}}
                      >
                      <Text style={styles.headerText}>
                        <FadeInView delay={300} style={{top:'33%'}}>
                          {state.movie.title.toUpperCase()} {"\n"}
                          <Text style={styles.rateText}>{getGenresPhrase(state.movie.genres)}{"\n"}
                          Rate: {state.movie.vote_average} / 10 ⋆ {"\n"}{"\n"}
                          </Text>
                        </FadeInView>
                        <Text style={styles.buttonText}>
                            More Info +
                        </Text>
                      </Text>
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
                : props.backupImage &&
                  <TouchableWithoutFeedback onPress={() => props.navigation.push('ShowItem', {item: props.backupImage})}>
                      <ImageBackground
                          style={{width: '100%', height: '100%', zIndex: 1}}
                          source={{uri: `${IMG_URL}${props.backupImage.backdrop_path}`}}
                      >
                      <FadeInView delay={300} style={{top: '33%'}}>
                        <Text style={styles.headerText} key="HeaderText">
                          {props.backupImage.title.toUpperCase()} {"\n"}
                          <Text style={styles.rateText}>{getGenresPhrase(props.backupImage.genre_ids)}{"\n"}
                          Rate: {props.backupImage.vote_average} / 10 ⋆{"\n"}{"\n"}
                          </Text>
                        </Text>
                        <Text style={styles.buttonText}>
                            More Info +
                        </Text>
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
    height: DEVICE_HEIGHT >= 768 ? DEVICE_HEIGHT / 1.25: DEVICE_HEIGHT / 1.7,
  },
  headerText: {
    textAlign: 'center',
    position: 'absolute',
    fontSize: DEVICE_HEIGHT >= 768 ? 80 : 35,
    color: 'white',
    left: 0,
    right: 0,
    top: '33%',
    textShadowColor: 'black',
    textShadowRadius: 20,
    textShadowOffset: {width: 5, height: 5}
  },
  rateText: {
    textAlign: 'center',
    position: 'absolute',
    fontSize: DEVICE_HEIGHT >= 768 ? 25 : 10,
    color: 'white',
    left: 0,
    right: 0,
    opacity: 0.7,
    textShadowColor: 'black',
    textShadowRadius: 20,
    textShadowOffset: {width: 1, height: 1}
  },
  buttonText:{
    marginTop: 80,
    fontSize: DEVICE_HEIGHT >= 768 ? 25 : 13,
    padding: 5,
    borderRadius: 25,
    backgroundColor: 'white',
    opacity: 0.8,
    color: 'black',
    position: 'absolute',
    left: '39.5%',
    elevation: 3
  },
  shadowImg: {
    position: 'absolute',
    zIndex: 5,
    width: '100%', 
    height: 300, 
    bottom:  DEVICE_WIDTH >= 768 ? -120 : DEVICE_WIDTH <= 640 ? -180 : 40
  },
  shadowImgRotated: {
    position: 'absolute',
    zIndex: 5, 
    width: '100%', 
    opacity: 0.95, 
    height: 300, 
    top: DEVICE_WIDTH >= 768 ? -140 : - 180, 
    transform: [{rotate: '180deg'}],
  }
  
});
