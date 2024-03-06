import React, { useState, useEffect } from 'react';
import { View, Text , StyleSheet, FlatList,TouchableOpacity} from 'react-native';
import { fetchRatingsFromUser,auth } from '../server/firebase';
import { fetchGameDetails } from '../server/api';
import Svg, { Path } from 'react-native-svg';
import {useNavigation} from  '@react-navigation/native';




export default function UserComment() {
  const [gamesWithComments, setGamesWithComments] = useState([]);
  const [orderDirection, setOrderDirection] = useState('asc'); // 'asc' or 'desc'
  const navigation = useNavigation(); 

  // A helper function to format timestamps
  const formatDate = (timestamp) => {
    return timestamp ? timestamp.toDate().toLocaleString() : '';
  };

  // Helper function to toggle order direction
  const toggleOrder = () => {
    setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
  };


    // useEffect(() => {
    //   const fetchData = async () => {
    //     if (auth.currentUser) {
    //       const userUid = auth.currentUser.uid;
    //       const ratings = await fetchRatingsFromUser(userUid);
    //       console.log('userID: ', userUid);
    //       console.log('Ratings set in state:', ratings);
    //       setComments(ratings);
    //     }
    //   };
  
    //   fetchData();
    // }, []);

    useEffect(() => {
      const fetchGamesWithUserComments = async () => {
        if (auth.currentUser) {
          const userUid = auth.currentUser.uid;
          const userRatings = await fetchRatingsFromUser(userUid); // Fetch user ratings
          const games = [];
  
          for (let rating of userRatings) {
            const gameDetails = await fetchGameDetails(rating.gameId); // Fetch game details
            games.push({
              ...gameDetails,
              userRating: rating.rating,
              userComment: rating.comment,
              timestamp: rating.timestamp
            });
          }
  
          setGamesWithComments(games);
        }
      };
  
      fetchGamesWithUserComments();
    }, []);
  

    // Function to sort gamesWithComments based on userComment
    const getSortedData = () => {
      return gamesWithComments.sort((a, b) => {
        if (orderDirection === 'asc') {
          return a.userComment.localeCompare(b.userComment);
        } else {
          return b.userComment.localeCompare(a.userComment);
        }
      });
    };

    return (
      <View style={styles.container}>
        {/* Back Button*/}
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}style={styles.backButton}>
            <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5">
              <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </Svg>
          </TouchableOpacity>
         
         {/* Order Button*/}
         <View style={styles.rightAligned}>
          <TouchableOpacity onPress={toggleOrder} style={styles.orderButton}>
            <Text style={styles.orderButtonText}>
              Order: {orderDirection.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

       
      
          
      
         {/* List of Games with Comments */}
        <FlatList
           data={getSortedData()}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.gameTitle}>{item.name}</Text>
              <Text style={styles.rating}>Rating: {item.userRating} / 5</Text>
              <Text style={styles.comment}>{item.userComment}</Text>
              <Text style={styles.date}>
                Commented on: {formatDate(item.timestamp)}
              </Text>
            </View>
          )}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: { 
      flex: 1,
      padding: 10,
      backgroundColor: '#151b1f',
    },
    card: {
      backgroundColor: '#f9f6f2',
      padding: 15,
      borderRadius: 10,
      marginVertical: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 3,
    },
    gameTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    rating: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4caf50',
      marginBottom: 10,
    },
    comment: {
      fontSize: 16,
      color: '#333',
      marginBottom: 5,
    },
    date: {
      fontSize: 14,
      color: '#666',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    orderButton: {
      backgroundColor: '#eab308',
      padding: 10,
      borderRadius: 5,
      
    },
    orderButtonText: {
      color: '#151b1f',
    },
    rightAligned: {
      // This will align its children (order button) to the right
      alignItems: 'flex-end', // Aligns children to the right
      flex: 1, // Takes up the remaining space
    },
  });
  