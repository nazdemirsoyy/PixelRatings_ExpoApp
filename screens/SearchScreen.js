import { View, TextInput, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, ScrollView,Text,Image,Pressable  } from 'react-native';
import React, { useEffect, useState } from 'react'
import Svg, { Path } from 'react-native-svg';
// import { TouchableWithoutFeedback } from 'react-native-web';
import {useNavigation} from  '@react-navigation/native';
import Loading from './Loading';
import { searchGames } from '../server/api';
import {fetchGenres} from '../server/api';


var {width, height} = Dimensions.get('window');

const App = () => {
    const navigation = useNavigation(); 
    const [results, setResults] = useState([]);
    const [inputText, setInputText] = useState('');
    const [genres, setGenres] = useState([]);
    
    const [loading,setLoading] = useState(false);
    const handleCancel = () => {
        setInputText(''); // Clear the input
    };

    const [searchAttempted, setSearchAttempted] = useState(false);

    //const genreButtons = ['Action', 'Adventure', 'Puzzle', 'Strategy', 'RPG', 'MMO', 'Sports']; 

    const handleSearch = async () => {
      setLoading(true);
      setSearchAttempted(true);
      try {
        let data = await searchGames(inputText);
        setResults(data.results || []);
      } catch (error) {
          console.error("Failed fetching search results", error);
          setResults([]);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresData = await fetchGenres();
        //console.log('Fetched genres:', genresData); // Check the fetched data
        setGenres(genresData);
      } catch (error) {
        console.error("Failed to load genres", error);
      }
    };
  
    loadGenres();
  }, []);
  
  
  // Then, when handling a genre search:
  const handleGenreSearch = async (genreId) => {
    setLoading(true);
    setSearchAttempted(true); // Consider renaming this state to reflect that it's used for both text and genre searches
    try {
      const data = await searchGames('', genreId); // Leave the query empty and pass the genre ID
      if (data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Failed fetching genre results", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  
  
    
    return (
      <SafeAreaView style={styles.safeAreaView}>
       <View style={styles.fullScreenContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16, marginLeft:8 ,marginTop: 25, marginBottom:16,}}>
        {/* Back Button*/}
          <View style={{ width: 40, justifyContent: 'center', alignItems: 'center',marginTop:16, }}>         
              <TouchableOpacity onPress ={() => navigation.goBack()}style ={ {borderRadius: 12, padding: 4}}>
                      <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5">
                      <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </Svg>
              </TouchableOpacity>
            </View>

        {/* View for search bar */}
        <View style={styles.searchBarContainer}>
            <TextInput
              placeholder="Search Game"
              placeholderTextColor="lightgray"
              style={styles.searchBarInput}
              value={inputText}
              onChangeText={(text) => {
                        setInputText(text);
                        if (text) {
                            handleSearch();
                        } else {
                            setResults([]); // Clear results when the input is empty
                            setSearchAttempted(false); // Reset the search attempt
                        }
                    }}
            />

            

            <TouchableOpacity 
            onPress={handleCancel}
            style= {styles.cancelBtn} 
            >
   
        {/*Cancel button */}
        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5">
        <Path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </Svg>

        </TouchableOpacity>
        
        </View>
        
        </View>
        {/*Genre buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.genreButtonContainer}
          style={styles.genreScrollView}
        >
          {genres && genres.map((genre) => (
            <TouchableOpacity
              key={genre.id}
              style={styles.genreButton}
              onPress={() => handleGenreSearch(genre.id)}
            >
              <Text style={styles.genreButtonText}>{genre.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/*Results */}
          {
              loading? (
                <Loading
                />
              ):
              (
                (results.length > 0 ?
                    (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingHorizontal: 15, paddingBottom: 20, }}
                            style={styles.scrollViewStyle}>
                            <Text style={{color:'white',fontWeight: '400', marginLeft:1}}>Results ({results.length})</Text>
                                <View style={{flexDirection: 'row',  flexWrap: 'wrap',justifyContent: 'flex-start',marginBottom: 50}}>
                                {
                                  results.map((item, index) => {
                                    const gameName = item.name;
                                    const gameImage = item.background_image;
                                    return (
                                      <Pressable key={index} onPress={() => navigation.navigate('GameScreen', { id: item.id })}>
                                        <View style={{ marginBottom: 8, marginRight: 8, width: width * 0.44, height: height * 0.4 + 20 }}>
                                          <Image style={{ borderRadius: 12, width: '100%', height: height * 0.4 }} source={{ uri: gameImage }} />
                                          <Text style={{ color: 'white', marginLeft: 8, marginTop: 4 }}>{gameName.length > 22 ? gameName.slice(0, 22) + '...' : gameName}</Text>
                                        </View>
                                      </Pressable>
                                    );
                                  })
                                }
                                </View>
                        </ScrollView>
                    ):
                    (searchAttempted && (
                        <View style={styles.failImageContainer}>
                            <Image
                            source={require('../assets/fail.png')}
                            style={{ height: 384, width: 384 }}></Image>
                        </View>
                    )
              )
            )
        )}
        </View>
      </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    safeAreaView: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: '#151b1f',
    //minHeight: height,
    paddingTop:0,
    },
    fullScreenContainer: {
      flex: 1, // Make sure it takes up the entire space
      backgroundColor: '#151b1f',
    },
    searchBarContainer: {
    marginTop: 25,
    marginLeft:16,
    width:'80%',
    marginRight: 16,
    marginBottom: 12,
    //height: 50,  // Increased height of the search bar
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#A0AEC0',
    borderWidth: 1,
    borderRadius: 9999, 
    paddingHorizontal: 8,  // Padding for the text input
    },
    searchBarInput: {
    flex: 1, 
    fontWeight: '400',
    color: 'white',
    },
    cancelBtn: {
    borderColor: '#151b1f', //remove background color
    borderWidth: 1,
    borderRadius: 9999,
    padding: 12, // p-3 equivalent, might need to adjust
    margin: 4, // m-1 equivalent, might need to adjust
    //backgroundColor: '#A0AEC0', // bg-neutral-500, color can be adjusted
      },
    failImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: height,
    width: width,
    backgroundColor: '#151b1f',
    },
    scrollViewStyle: {
    marginBottom: 12,
    backgroundColor: '#151b1f',
    },
    // genre button style
    genreScrollView: {
      //height: 70, // Set a fixed height for your genre scroll view
    },
    genreButtonContainer: {
      paddingHorizontal: 10, // Add some horizontal padding if needed
    },
    genreButton: {
      //padding: 10,
      marginHorizontal: 5, // Add horizontal margin between buttons
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginHorizontal: 8,
      marginBottom: 50,
      borderRadius: 20,
      height: 50,
      backgroundColor: '#2D3748',
      justifyContent: 'center', // Center content within the button for Android
      alignItems: 'center', // Center content within the button for Android
    },
    genreButtonText: {
      color: 'white',
    },
  });
  
  export default App;