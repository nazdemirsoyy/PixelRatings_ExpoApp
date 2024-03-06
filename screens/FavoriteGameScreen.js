import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList,Alert,TouchableWithoutFeedback ,Dimensions,TouchableOpacity} from 'react-native';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore'; 
import { fetchFavoriteGames, auth} from '../server/firebase'; 
import { fetchGameDetails } from '../server/api';
import {useNavigation} from  '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

const db = getFirestore();

var {width, height} = Dimensions.get('window');

export default function FavoriteGameScreen() {
  const [favoriteGames, setFavoriteGames] = useState([]);
  const navigation = useNavigation(); 

  useEffect(() => {

    const fetchFavorites = async () => {
      try {
          if (!auth.currentUser) {
              Alert.alert('Error', 'You need to be logged in to view favorite games.');
              return;
          }
  
          const userUid = auth.currentUser.uid;
          const favoriteGameIds = await fetchFavoriteGames(userUid); // Assuming this fetches an array of game IDs
          const games = [];
  
          for (let gameId of favoriteGameIds) {
              const gameDetails = await fetchGameDetails(gameId);
              games.push(gameDetails);
          }
  
          setFavoriteGames(games);
      } catch (error) {
          Alert.alert('Error', 'An error occurred while fetching favorite games.');
          console.error("Error fetching favorite games:", error);
      }
  };

    fetchFavorites();
    
  }, []);




return (
  
  <View style={{ padding: 16, backgroundColor: '#151b1f', flex: 1 }}>
    {/* Back Button*/}
    <TouchableOpacity onPress ={() => navigation.navigate('Profile')}style ={ {borderRadius: 12, padding: 4}}>
    <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5">
    <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </Svg>
    </TouchableOpacity>
    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 ,color:'white'}}>Favorite Games</Text>
    {
  <FlatList
    data={favoriteGames}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('GameScreen', item)}>
            <View style={{ marginBottom: 4, marginLeft: 16, marginRight: 16, flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={{ uri: item.background_image }}
                    style={{
                        width: width * 0.33,
                        height: height * 0.22,
                        borderRadius: 20,
                        marginRight: 10
                    }}
                />
                <View style={{ flex: 1 }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                        {item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )}
/>

    }
  </View>
);


}