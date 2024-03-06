import { View, Text, StatusBar, TouchableOpacity, ScrollView, StyleSheet, FlatList, Image} from 'react-native'
import React, { useEffect, useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Path } from 'react-native-svg';
import {styles} from '../theme';
import TrendingGames from '../components/TrendingGames';
import GameList from '../components/GameList';
import {useNavigation} from  '@react-navigation/native';
import Loading from './Loading';
// import Sidebar from '../components/Sidebar';
import { fetchTopRatedGames, fetchTrendingGames,fetchUpcomingGames} from '../server/api';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {
    const [trending, setTrending] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [loading,setLoading] = useState(true);
    const navigation = useNavigation();

    
    useEffect(() =>{
        getTopRatedGames();
        getTrendingGames();
        getUpcomingGames();
    },[])

    const getUpcomingGames = async () => {
        const data = await fetchUpcomingGames();
        //console.log('got upcoming games', data);
        if (data && data.results && Array.isArray(data.results)) {
            setUpcoming(data.results);
            setLoading(false);
            data.results.map(game => {
                //console.log(game.name, game.released);  // This will print the name and release date of each game
            });
        } else {
            console.error('Unexpected data format:', data);
        }
      }
      
      const getTrendingGames = async () =>{
        const data  = await fetchTrendingGames();
        //console.log('got Trending games', data);
        if (data && data.results && Array.isArray(data.results)) {
          setTrending(data.results);
          setLoading(false);
          data.results.map(game => {
            //console.log(game.name, game.rating);  // This will print the name of each game
          });
        } else {
          console.error('Unexpected data format:', data);
        }
      }
      
      const getTopRatedGames = async () => {
        const data  = await fetchTopRatedGames();
        //console.log('Got Top Rated games', data);
        if (data && data.results && Array.isArray(data.results)) {
          setTopRated(data.results);
          setLoading(false);
          data.results.map(game => {
            //console.log(game.name, game.rating);  // This will print the name of each game
          });
        } else {
          console.error('Unexpected data format:', data);
        }
      }
      
     

      return (
        <View style= {{flex:1, backgroundColor:'#151b1f'}}>
          {/* SideBar  */}
          <SafeAreaView style = {{marginBottom: 8}}>
            <StatusBar barStyle="light-content" />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 4 }}>
      
                    {/* Options  */}
                    {/* <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                      <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5">
                      <Path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
                      </Svg>
                      </TouchableOpacity> */}
      
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 30}}>
                        <Text style={styles.text}>G</Text>ames</Text>
      
                    {/* Search bar */}
                  <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
                    <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5">
                    <Path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </Svg>
                  </TouchableOpacity>
              </View>
          </SafeAreaView>
      
          {
            loading? (
              <Loading/>
            ):
            <ScrollView
              showsHorizontalScrollIndicator = {false}
              contentContainerStyle ={{paddingBottom:10}}>
              {/* Trending games carousel*/ }
              <TrendingGames data = {trending}/>
      
              {/* Upcoming games*/ }
              <GameList  title = "Upcoming Games" data = {upcoming}/>
      
              {/*Top Rated games*/ }
              <GameList  title = "Top Rated Games" data = {topRated}/>
          </ScrollView>
          }
      
      
         
        </View>
        )
      }



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     paddingBottom:10,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white', // Assuming white text color
//     marginLeft: 10,
//     marginBottom: 10,
//   },
//   gameItem: {
//     // Style for your game items
//   },
//   gameImage: {
//     width: 100, // Your desired image width
//     height: 150, // Your desired image height
//     borderRadius: 10, // If you want rounded corners
//   },
//   gameTitle: {
//     color: 'white',
//     // Any other styles for your game title text
//   },
//   seeAllText: {
//     color: 'white',
//     textDecorationLine: 'underline',
//     // Any other styles for your 'See All' text
//   },
//   // ... any other styles you need
// });

