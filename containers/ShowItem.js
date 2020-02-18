import React, {useState, useEffect, Component} from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Share, Button, ScrollView, Dimensions, Animated, TouchableHighlight} from 'react-native';
import {Ionicons, EvilIcons} from '@expo/vector-icons'
import { Fetch } from '../helpers/Fetch'
import moment from "moment";

//Custom Components
import SliderHorizontal from '../components/slider-horizontal/index'


const IMG_URL = "https://image.tmdb.org/t/p/w500"
const API_KEY = "api_key=76c7a1c86217796b701e803e006c5832"
const API_LANG = "en-Us"
const DEVICE_HEIGHT = Dimensions.get('window').height
const DEVICE_WIDTH = Dimensions.get('window').width

//FADEIN
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

export default function ShowItem(props) {
    const item = props.route.params.item
    const [state, setState] = useState({movie: item, genres: [], videos: [], similar_movies: [], page: 1, refreshing: false, isLoading: true})
    const initializedData = async () => {
        let videos = {}
        let similar_movies = {}
        let credits = {}
        await Fetch.GET(`movie/${state.movie.id}/videos?${API_KEY}&language=${API_LANG}`, (response) => response)
        .then((response) => {
          if (response) {
            videos = response.results
          }
          return videos
        })
        await Fetch.GET(`movie/${state.movie.id}/credits?${API_KEY}`, (response) => response)
        .then((response) => {
          if (response) {
            credits = response
          }
          return credits
        })
        await Fetch.GET(`movie/${state.movie.id}/similar?${API_KEY}&language=${API_LANG}&page=${state.page}`, (response) => response)
          .then((response) => {
            if (response) {
              if (response) {
                similar_movies = response.results
              }
            }
            return similar_movies
          })
        await Fetch.GET(`genre/movie/list?${API_KEY}&language=${API_LANG}`, (response) => response)
          .then((response) => {
            if (response) {
              setState({ 
                ...state,
                videos: videos,
                genres: response.genres,
                similar_movies: similar_movies,
                credits: credits,
                isLoading: false,
              })
            }
          })
     }
    useEffect(() => {
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

    const creditsMovie = (credits) => {
      if (credits && credits.crew && credits.cast) {
        const directing = credits.crew.find(person => person.department === 'Directing')
        let cast = []
        credits.cast.slice(0, 4).map((guy) => {
          cast.push(guy.name)
        })
        return <Text>Directed by: {directing.name}, Cast: {cast.length > 1 ? cast.slice(0, cast.length - 1).join(', ') + " and " + cast.slice(-1) : cast[0]}</Text>
      }
      
    }
    return (
      <ScrollView>
        <View style={styles.container}>
        <View style={styles.imgContainer}>
          {state.movie && 
              state.movie.backdrop_path != null ? 
                <>   
                    { state.videos.length > 0 && DEVICE_WIDTH <= 640 ? 
                    <EvilIcons  name="play"
                                size={65}
                                color="white" 
                                onPress={() => props.navigation.push('ShowVideo', {video: state.videos[0].key})} 
                                style={{position: 'absolute',
                                        top: '45%', 
                                        left: '40%', 
                                        zIndex: 10, 
                                        opacity: 0.93,
                                        textShadowColor: 'black',
                                        textShadowRadius: 10,
                                        textShadowOffset: {width: 3, height: 1}}}/>
                    : null }
                    <TouchableHighlight style={{position: 'absolute', top: 45, left: 25, zIndex: 10}}>
                      <Ionicons name="ios-arrow-back" size={35} color="white" onPress={() => props.navigation.goBack()}/>
                    </TouchableHighlight>
                    <ImageBackground
                        style={{width: '100%', height: '100%'}}
                        source={{uri: `${IMG_URL}${state.movie.backdrop_path}`}}
                        resizeMode={'cover'}
                        resizeMethod={'resize'}
                    />
                    <Image
                      style={styles.shadowImgRotated}
                      source={ require('../assets/shadow.png')}
                      resizeMode={'repeat'}
                      />
                    <Image
                      style={styles.shadowImg}
                      source={ require('../assets/shadow.png')}
                      resizeMode={'repeat'}
                      />
                </>
                : null
          }
        </View>
          <View style={styles.contentContainer}>
              <FadeInView delay={700}>
                <Text style={styles.headerText}> {state.movie.title}</Text>
              </FadeInView>
              <FadeInView delay={950}>
              <Text style={styles.dataText}>{getGenresPhrase(state.movie.genre_ids)}&nbsp;
                •  {moment(state.movie.release_date).format('YYYY')} <Ionicons name="ios-calendar" size={DEVICE_HEIGHT >= 768 ? 18 : 12} color="white"/>&nbsp;&nbsp;
                •  {state.movie.vote_average} / 10 <Ionicons name="ios-star-half" size={DEVICE_HEIGHT >= 768 ? 18 : 12} color="white"/>
                </Text> 
              </FadeInView>
              <FadeInView delay={1600}>
                <Text style={styles.overviewText}>{state.movie.overview}</Text>
              </FadeInView>
              <FadeInView delay={1800}>
                <Text style={styles.creditsText}>{creditsMovie(state.credits)}</Text>
              </FadeInView>
              { state.similar_movies.length > 0 &&
                <SliderHorizontal sliderTitle="Similar Movies" movies={state.similar_movies} loadMore={false} navigation={props.navigation} isRefreshing={state.refreshing} moreDelay={props.moreDelay}/>
              }
          </View>
      </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    height: '100%',
    flex: 1,
  },
  contentContainer: {
    shadowOpacity: 0,
    backgroundColor: '#000',
    marginTop: -5,
    zIndex: 3,
  },
  imgContainer: {
    elevation: 0,
    shadowOpacity: 0,
    zIndex: 1,
    backgroundColor: '#000',
    height: DEVICE_HEIGHT >= 768 ? DEVICE_HEIGHT / 1.35 : DEVICE_WIDTH <= 640 ?  DEVICE_HEIGHT / 2.5 : DEVICE_HEIGHT / 1.3,
  },
  shadowImg: {
    position: 'absolute',
    zIndex: 5,
    width: '100%', 
    height: 300, 
    bottom:  DEVICE_WIDTH >= 768 ? -90 : DEVICE_WIDTH <= 640 ? -180 : 40
  },
  shadowImgRotated: {
    position: 'absolute',
    zIndex: 5, 
    width: '100%', 
    opacity: 0.95, 
    height: 300, 
    top: DEVICE_WIDTH >= 768 ? -140 : - 180, 
    transform: [{rotate: '180deg'}],
  },
  headerText: {
    color: 'white',
    marginTop: DEVICE_HEIGHT >= 768 ? -25 : -60,
    marginBottom: 7,
    fontSize: DEVICE_HEIGHT >= 768 ? 55 : 28,
    textShadowColor: 'black',
    textShadowRadius: 20,
    zIndex: 3,
    textShadowOffset: {width: 5, height: 5}
  },
  dataText: {
    color: 'white',
    fontSize: DEVICE_HEIGHT >= 768 ? 18 : 12,
    textShadowColor: 'black',
    textShadowRadius: 20,
    paddingVertical: 3,
    zIndex: 3,
    paddingHorizontal: 7,
    opacity: 0.6,
    marginTop: -10,
    textShadowOffset: {width: 5, height: 5}
  },
  overviewText: {
    color: 'white',
    fontSize: DEVICE_HEIGHT >= 768 ? 22 : 15,
    textShadowColor: 'black',
    textShadowRadius: 20,
    width: '90%',
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginBottom: 50,
    textShadowOffset: {width: 5, height: 5}
  },
  creditsText: {
    color: 'white',
    marginTop: DEVICE_HEIGHT >= 768 ? -25 : -60,
    fontSize: DEVICE_HEIGHT >= 768 ? 15 : 12,
    opacity: 0.7,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 50,
    textShadowColor: 'black',
    textShadowRadius: 20,
    textShadowOffset: {width: 5, height: 5}
  },
  videoContainer: {
      backgroundColor: '#ecf0f1',
      flex: 1,
  },
  trailerButton: {
    padding: 15,
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 1,
    color: 'white',
    maxWidth: 185,
    fontSize: DEVICE_HEIGHT >= 768 ? 22 : 15,
    margin: 10
  },
});