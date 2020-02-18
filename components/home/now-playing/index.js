import React,{useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, FlatList, Dimensions, TouchableWithoutFeedback, Animated, ShadowPropTypesIOS } from 'react-native';
import { Fetch } from '../../../helpers/Fetch'
import SliderHorizontal from '../../slider-horizontal/index'

const API_KEY = "api_key=76c7a1c86217796b701e803e006c5832"
const API_LANG = "en-Us"
const IMG_URL = "https://image.tmdb.org/t/p/original"
const DEVICE_HEIGHT = Dimensions.get('window').height

export default function NowPlaying(props,{navigation}) {
  const [state, setState] = useState({movies: [], page: 1, refreshing: false, isLoading: true})
    const initializedData = async () => {
        await Fetch.GET(`movie/now_playing?${API_KEY}&language=${API_LANG}&page=${state.page}`, (response) => response)
              .then((response) => {
                if (response) {
                  const movies = state.movies
                  response.results.forEach(movie => {
                    movies.push(movie)
                  });
                  setState({ 
                    ...state, 
                    page: state.page += 1,
                    movies: movies,
                    isLoading: false
                  })
                }
              })
    }
    useEffect(() => {
      initializedData()
    }, [])

    const loadMore = (() => {
      setState((prevState) => {
        return { refreshing: true, page: prevState.page + 1, movies: state.movies }
      })
      initializedData()
    })

    return (
      <View style={styles.container}>
        { state.movies.length > 0 &&
          <SliderHorizontal sliderTitle="Now Playing" movies={state.movies} loadMore={loadMore} navigation={props.navigation} isRefreshing={state.refreshing} moreDelay={props.moreDelay}/>
        }
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
