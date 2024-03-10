import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image,FlatList , Alert, Dimensions,RefreshControl  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchFavoriteGames, fetchUserComments, auth ,fetchRatingsFromUser} from '../server/firebase';
import { getAuth, signOut } from "firebase/auth";
import { fetchGameDetails } from '../server/api';
import { getFirestore, doc, onSnapshot,getDoc } from 'firebase/firestore'; 
import Svg, { Path } from 'react-native-svg';
import { EvilIcons } from '@expo/vector-icons'; 

const db = getFirestore();
var { width, height } = Dimensions.get('window');


export default function PublicProfile({ userId }) {
    const navigation = useNavigation(); 
    const [favoriteGames, setFavoriteGames] = useState([]);
    const [gamesWithComments, setGamesWithComments] = useState([]);
    const [userName, setUserName] = useState('');
    const [avatar, setAvatar] = useState('');

    const [refreshing, setRefreshing] = useState(false);

//For Favorited Game
useEffect(() => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You need to be logged in to view this profile.');
      return;
    }

    const userUid = auth.currentUser.uid;
    const unsubscribe = onSnapshot(doc(db, 'users', userUid), async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const favoriteGameIds = userData.favoriteGames || [];
        const gamesPromises = favoriteGameIds.map(gameId => fetchGameDetails(gameId));
        const games = await Promise.all(gamesPromises);
        
        // Assuming fetchGameDetails returns an object with a background_image property
        const gamesWithImages = games.map(game => ({
          id: game.id,
          background_image: game.background_image,
          name: game.name
        }));
        
        setFavoriteGames(gamesWithImages);
      } else {
        console.warn("User document doesn't exist");
      }
    });

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, []);


//For Reviews & Ratings
useEffect(() => {
    const fetchUserCommentsAndGames = async () => {
      if (auth.currentUser) {
        const userUid = auth.currentUser.uid;
        const ratings = await fetchRatingsFromUser(userUid);
        const gameDetailsPromises = ratings.map((rating) => 
          fetchGameDetails(rating.gameId).then((gameDetails) => ({
            name: gameDetails.name, // Assuming fetchGameDetails returns an object with a name property
            ...rating
          }))
        );

        Promise.all(gameDetailsPromises)
          .then(setGamesWithComments)
          .catch((error) => {
            console.error("Error fetching game details for comments:", error);
            Alert.alert("Error", "There was an error fetching the game details for the comments.");
          });
      }
    };

    fetchUserCommentsAndGames();
  }, []);

// Function to format date
const formatDate = (timestamp) => {
        // Adjust the formatting to match your timestamp
        return new Date(timestamp).toLocaleString();
    };

// const handleClick = (gameID) => {
//     navigation.navigate('GameScreen', { gameID: game.id });
//     };
  
const handleNavigateToSettings = () => {
  navigation.navigate('UserProfile');
};

//For username
const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.log("No such user!");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
useEffect(() => {
    // Check if user is logged in
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      // Fetch the user data
      fetchUserData(uid).then(userData => {
        if (userData) {
          // Set user data in state
          setUserName(userData.name || 'User'); // Default to 'User' if name is not set
          // ... set other user data in state as needed
        }
      }).catch(error => {
        console.error("Error fetching user data:", error);
        Alert.alert('Error', 'Unable to fetch user data');
      });
    }
  }, []);
  
//Refresher
const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUserData(auth.currentUser.uid).then(userData => {
      if (userData) {
        setUserName(userData.name || 'User'); // Update the user's name
        setRefreshing(false); // Stop the refresh
      }
    });
  }, []);
  

  return (
    <View style={{ padding: 16, backgroundColor: '#151b1f', flex: 1 , paddingTop:0}}>
    <ScrollView style={styles.container}
    refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
    />}>
     {/* Back Button*/}
     <View style={styles.header}>
        <TouchableOpacity onPress ={() => navigation.navigate('HomeScreen')}style ={ {borderRadius: 12, padding: 4, paddingLeft:0}}>
        <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5">
        <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </Svg>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNavigateToSettings} style={styles.settingsButton}>
          <EvilIcons  name="gear" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View style = {styles.userInfoPanel}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.avatarPlaceholder}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <EvilIcons name="image" size={100} color="#aaa" /> // Placeholder icon when no image is present
          )}
        </TouchableOpacity>
            <Text style={styles.username}>{userName}</Text>
        </View>
      
      <View style={styles.favoriteGamesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Favorite Games</Text>
          <TouchableOpacity style={styles.seeAllButton}>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('FavoriteGameScreen')} 
          >
            <Text style={{color:'#eab308'}}>See All</Text>
          </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal={true} contentContainerStyle={styles.gamesContainer}>
            {favoriteGames.map((game, index) => (
                // <TouchableOpacity key={index} style={styles.gameContainer} onPress={() => handleClick(game.id)}>
                <View key={index} style={styles.gameContainer}>
                <Image source={{ uri: game.background_image }} style={styles.gameImage} />
                <Text style={styles.gameTitle}>
                    {game.name.length > 20 ? `${game.name.slice(0, 20)}...` : game.name}
                </Text>
                </View>
                // </TouchableOpacity> // Correctly place the JSX comment here if you want to keep it commented out
            ))}
        </ScrollView>


      </View>


      <View style={styles.reviewsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Reviews & Ratings</Text>
          <TouchableOpacity style={styles.seeAllButton}>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('UserComment')} 
          >
            <Text style={{color:'#eab308'}}>See All</Text>
          </TouchableOpacity>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.container}>
      {/* ...other profile sections... */}
      {/* Reviews & Ratings Section */}
      <View style={styles.reviewsSection}>
        {gamesWithComments.map((gameWithComment, index) => (
          <View key={index} style={styles.reviewCard}>
            <Text style={{color:'black', fontSize:16, fontWeight:'bold',marginBottom: 5,}}>{gameWithComment.name}</Text>
            <Text style={styles.rating}>Rating: {gameWithComment.rating} / 5</Text>
            <Text style={styles.comment}>{gameWithComment.comment}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151b1f',
  },
  header: {
    flexDirection: 'row', // Aligns items horizontally
    justifyContent: 'space-between', // Places one item on each end
    alignItems: 'center', // Centers items vertically
    width: '100%', // Ensures header spans full width
    paddingTop: 16, // Space from the top of the container
    paddingHorizontal: 16, // Space from the sides of the container
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20, // Provide some space from the top elements
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5, // Adjust the horizontal padding to match the rest of the content
  },
  seeAllButton: {
    // Style for "See All" buttons
    color:'#eab308',
  },
  favoriteGamesSection: {
    // Styles for the favorite games section
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#eab308',
  },
  gamesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginTop: 10,
    // width: width * 0.33,
    height: height * 0.30,
    justifyContent: 'flex-start',
  },
  gameContainer: {
    width: width * 0.4,
    height: width * 0.6 ,
    marginRight: 10, // Add some right margin for spacing between items
    marginBottom: 20, // Add some bottom margin if you want space below the container
    alignItems: 'center', // Center-align children
  },
  gameImage: {
    width: '100%', // Image takes up full container width
    height: '85%', // Adjust the height to leave space for the text below
    borderRadius: 10, // Round the corners of the image
    resizeMode: 'cover', // Cover the entire area of the image container, might crop a bit
  },
  gameTitle: {
    color: 'white', 
    marginTop: 4, 
  },
  reviewsSection: {
    // Styles for the reviews section
  },
  reviewsContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
  reviewCard: {
    backgroundColor: '#f9f6f2',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  rating:{
    fontSize: 14,
    //fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 10,
  },
  comment: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  settingsButton: {
    position: 'absolute', // Use absolute positioning
    top: 16, // Distance from the top of the header
    right: 16, // Distance from the right edge of the header
    padding: 8, // Padding for the touchable area
  },
  userInfoPanel: {
    alignItems: 'center', // Centers items horizontally in the container
    justifyContent: 'center', // Centers items vertically in the container
    paddingVertical: 20, // Adds padding at the top and bottom
  },
  avatarPlaceholder: {
    width: 100, // Adjust width if needed
    height: 100, // Adjust height if needed
    borderRadius: 50, // Half of width/height to make it round
    backgroundColor: '#e0e0e0', // Placeholder color
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // To make sure the image stays within the bounds
    marginTop: 20, // Space from the username or top elements
    marginBottom: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },

});
