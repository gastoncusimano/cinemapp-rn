import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Fetch } from '../helpers/Fetch'
import UpcomingMovies from '../components/home/upcoming-movies/index';
import NowPlaying from '../components/home/now-playing/index';
import PopularMovies from '../components/home/popular-movies/index';
import TopRatedMovies from '../components/home/top-rated-movies/index';
import LatestMovie from '../components/home/latest-movie/index';

const API_KEY = "api_key=76c7a1c86217796b701e803e006c5832"
const API_LANG = "en-Us"

export default function Home({navigation}) {
  const [state, setState] = useState({results: []})
    useEffect(() => {
      async function initializedData() {
        await Fetch.GET(`movie/upcoming?${API_KEY}&language=${API_LANG}&page=1`, (response) => response)
              .then((response) => {
                if (response) {
                  setState({ 
                    ...state, 
                    results: response.results
                  })
                }
              })
      }
      initializedData()
    }, [])

  return (
    <View style={styles.container}>
      <ScrollView  style={{height: 100}} > 
        {state.results &&
          <>
            <LatestMovie backupImage={state.results[0]} navigation={navigation}/>
            <TopRatedMovies navigation={navigation} moreDelay={-300}/>
            <PopularMovies navigation={navigation} moreDelay={1000}/>
            <UpcomingMovies navigation={navigation} moreDelay={1200}/>
            <NowPlaying navigation={navigation} moreDelay={1800}/>
          </>
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
  },
});
