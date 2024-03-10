import { View, Text, ScrollView,TouchableOpacity,Dimensions,Image,TextInput,Button,Alert,ActivityIndicator  } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { styles } from '../theme';
import {useNavigation} from  '@react-navigation/native';
import {LinearGradient} from  'expo-linear-gradient';
import Loading from './Loading';
import {fetchGameDetails}  from '../server/api';
import { auth,db,addGameToFavorites,removeGameFromFavorites,isGameFavorited } from '../server/firebase';
import { doc,Firestore, updateDoc, arrayUnion, serverTimestamp} from 'firebase/firestore';
import { Rating } from 'react-native-ratings';

var {width, height} = Dimensions.get('window');

//removeHTMLTags: From api description is coming with html tags will use this function to remove them
const removeHTMLTags = (str) => {
  return str.replace(/<\/?[^>]+(>|$)/g, "");
}



export default function GameScreen() {

// Favorite
const toggleFavorite = async (newFavoriteStatus) => {
  try {
    const userUid = auth.currentUser.uid; // Retrieve the current user's UID
    const gameId = item.id;


    // Log for debugging purposes.
    //console.log("toggleFavorite called with isFavorite:", newFavoriteStatus);
    //console.log("User UID:", userUid);
    //console.log("Item ID:", item.id);

    if (newFavoriteStatus) {
      await addGameToFavorites(userUid, item.id);
    } else {
      await removeGameFromFavorites(userUid, item.id);
    }

    // Set the new favorite status in state.
    setIsFavorite(newFavoriteStatus);
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
};

  const [gameDetails, setGameDetails] = useState({
    name: '',
    releaseDate: '',
    genres: [],
    platforms: [],
    description: ''
  });

    const navigation = useNavigation(); 
    const [isFavorite, setIsFavorite] = useState(false);
    const{params: item} = useRoute();
    const [loading,setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    //Submit function
    const submitRatingAndComment = async ( rating, comment) => {
      const userUid = auth.currentUser.uid; // Retrieve the current user's UID
      const userRef = doc(db, 'users', userUid);
      const gameId = item.id;
    
      // Log values to debug
      //console.log(`SUBMITTING rating/comment:`, { gameId, rating, comment, timestamp: serverTimestamp() });

      // Check if any value is undefined
      if (typeof gameId === 'undefined' || typeof rating === 'undefined' || typeof comment === 'undefined') {
        console.error('One of the values is undefined', { gameId, rating, comment });
        return; // Stop execution if any value is undefined
      }

      // Prepare the rating and comment data to be stored in Firestore
      try {
        await updateDoc(userRef, {
          ratings: arrayUnion({
            gameId,
            rating,
            comment,
            timestamp: new Date() 
          })
        });
    
        Alert.alert('Rating and Comment submitted successfully!');
  } catch (error) {
    console.error('Error submitting rating and comment:', error);
  }
};
    

      useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                let details = await fetchGameDetails(item.id);
                //console.log("Received game details:", details);
                
                if (details) {
                    setGameDetails(details);
                } else {
                    console.error("Received invalid game details from API.");
                }
    
                // Check if the game is a favorite
                const userUid = auth.currentUser.uid;
                const favorited = await isGameFavorited(userUid, item.id);
                setIsFavorite(favorited);
    
            } catch (error) {
                console.error("Error fetching game details:", error);
            } finally {
                setLoading(false);
            }
        };
    
        //console.log("Item ID:", item.id);
        //console.log("Received item:", item);
    
        fetchDetails();
    }, [item]);
    
    
  return (

    
  <ScrollView contentContainerStyle ={{paddingBottom:20,minHeight:height, backgroundColor:'#151b1f',paddingTop:0}}>
    
    <View style={{ width: '100%' }}>
        <SafeAreaView style={{position: 'absolute', zIndex: 20, width: '100%', flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center',paddingHorizontal: 16}}>
            {/* OPTIONAL
            <TouchableOpacity style ={[styles.background, {borderRadius: 12, padding: 4}]}>
            */}
            {/* Back Button*/}
            <TouchableOpacity onPress ={() => navigation.goBack()}style ={ {borderRadius: 12, padding: 4, marginTop:10}}>
                <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FF4500" strokeWidth="1.5">
                <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </Svg>
            </TouchableOpacity>

            {/* Favorite icon*/}
            <TouchableOpacity 
                onPress={() => toggleFavorite(!isFavorite)} 
                style={{
                    borderRadius: 15,   
                    padding: 5,         
                    marginTop: 10
                }}>
                <Svg 
                    width="30" 
                    height="30" 
                    viewBox="0 0 24 24"  
                    fill={isFavorite ? "#FF4500" : "none"}   // dark orange fill when favorited
                    stroke={isFavorite ? "#FF4500" : "#FF4500"}   // dark orange stroke
                    strokeWidth="1.5"
                >
                <Path strokeLinecap="round" strokeLinejoin="round" d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </Svg>
            </TouchableOpacity>
        </SafeAreaView> 
        
            {
              loading? (
                <Loading/>
              ):(
                <View>
                      <Image
                      source={{uri: gameDetails.background_image}}
                      style={{width, height: height*0.55}}
                      />
                    <LinearGradient
                      colors= {['transparent', 'rgba(23,23,23,0.8)','rgba(23,23,23,1)']}
                      style ={{width, height: height*0.40, position:'absolute', bottom: 0}}
                      start={{x:0.5, y:0}}
                      end={{x:0.5, y:1}}
                      />
                      
                    
                </View>
              )
            }  
    </View>
      
      {/* Game Details View */}
        {/*<View style={{ marginTop: -(height * 0.09), marginTop:3 }}>*/}
        <View style={{ marginTop: 3 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 30, letterSpacing: 1.5 }}>{gameDetails.name}</Text>

        <Text style={{ color: 'grey', textAlign: 'center', fontWeight: '400', fontSize: 16, letterSpacing: 1.5 }}>
        Released: {gameDetails.released ? gameDetails.released : "Not Specified"}
        </Text>


        <View style={{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: 16 }}>
          {gameDetails.genres.map((genre, index) => {
            const genreText = typeof genre === 'string' ? genre : genre.name;
            return (
            <Text key={index} style={{ color: 'grey', textAlign: 'center', fontWeight: '400', fontSize: 16, letterSpacing: 1.5 }}>{genreText} {index < gameDetails.genres.length - 1 && '• '}</Text>
            );
          })}
        </View>
        <Text style={{ color: 'grey', textAlign: 'center', fontWeight: '400', fontSize: 16, letterSpacing: 1 }}>
        Platform: 
        {gameDetails.platforms && gameDetails.platforms.length > 0 
            ? gameDetails.platforms.map(item => item.platform.name).join(', ') 
            : 'No platforms available'}
        </Text>



        <Text style={{ color: 'grey', textAlign: 'center', fontWeight: '400', fontSize: 16, letterSpacing: 1 }}>
            {removeHTMLTags(gameDetails.description)}
        </Text>




      </View>
      
      {/* Star */}
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Text style={{ color: 'grey', marginTop: 10 }}>Rate This Game</Text>
      <View style={{ backgroundColor: '#151b1f', padding: 10, borderRadius: 10 }}>
        <Rating
            type="star"
            ratingCount={5}
            imageSize={30}
            onFinishRating={(rating) => setRating(rating)}
        />
    </View>
          
      </View>

      {/* Comment Box */}
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <TextInput
          style={{ borderColor: 'gray', borderWidth: 1, borderRadius: 5, padding: 10, color: 'white' }}
          multiline
          numberOfLines={4}
          placeholder="Write a comment..."
          placeholderTextColor="grey"
          onChangeText={(text) => setComment(text)}
          value={comment}
        />
      </View>
      {/* Submit Button */}
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <Button
          title="Submit"
          onPress={() => submitRatingAndComment(rating, comment)}
        />
      </View>



    </ScrollView>
  )
}