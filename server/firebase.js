import firebase from "firebase/app";
import { initializeApp } from "firebase/app"
import { getAuth, initializeAuth, getReactNativePersistence }  from "firebase/auth";
import { getFirestore, doc, getDoc,setDoc, deleteDoc, collection, getDocs,query, where , updateDoc,addDoc} from 'firebase/firestore';
import { arrayUnion, arrayRemove } from 'firebase/firestore';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVTLlK_nedP6b_Xoad2H0k7uhBLBbQj4w",
  authDomain: "fir-aut-98872.firebaseapp.com",
  projectId: "fir-aut-98872",
  storageBucket: "fir-aut-98872.appspot.com",
  messagingSenderId: "714802380602",
  appId: "1:714802380602:web:c8ac97caa0672c5e5c5a03"
};


// Initialize Firebase
export const firebase_app = initializeApp(firebaseConfig);
//export const auth = getAuth(firebase_app)
export const auth = initializeAuth(firebase_app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(firebase_app)
collection(db, 'FavoriteGameList');


// Function to create a new user and their favorite list
async function createUserAndFavoriteList(username) {
  try {
    // Reference to the users collection
    const usersCollection = collection(db, 'users');

    // Create a new document in the favorite_list collection
    const favoriteListDocRef = await addDoc(collection(db, 'FavoriteGameList'), {
      // Initialize with empty favorites if needed
      // favorites: []
    });

    // Create a new user with the reference to the favorite list
    const userDocRef = await addDoc(usersCollection, {
      username: username,
      favoriteListReference: favoriteListDocRef // This is the reference to the favorite list
    });

    return userDocRef;
  } catch (error) {
    console.error("Error creating user and favorite list:", error);
    throw error;
  }
}


// Usage
// createUserAndFavoriteList('newUsername').then((userDoc) => {
//   console.log("User and favorite list created with userID:", userDoc.id);
// }).catch((error) => {
//   console.error("Error creating user and favorite list:", error);
// });


const getUserFavoritesReference = (userUid) => {
  return collection(db, 'FavoriteGameList', userUid, 'favorites');
}

// export const addGameToFavorites = async (userUid, gameId, gameData) => {
//   try {
//     const favoritesRef = getUserFavoritesReference(userUid);
//     const gameRef = doc(favoritesRef, gameId);
//     await setDoc(gameRef, gameData);
//     return { success: true };
//   } catch (error) {
//     console.error("Error adding game to favorites:", error);
//     return { success: false, error };
//   }
// }

// export const removeGameFromFavorites = async (userUid, gameId) => {
//   try {
//     const favoritesRef = getUserFavoritesReference(userUid);
//     const gameRef = doc(favoritesRef, gameId);
//     await deleteDoc(gameRef);
//     return { success: true };
//   } catch (error) {
//     console.error("Error removing game from favorites:", error);
//     return { success: false, error };
//   }
// }


export const addGameToFavorites = async (userUid, gameId) => {
  const userRef = doc(db, 'users', userUid);
  await updateDoc(userRef, {
    favoriteGames: arrayUnion(gameId)
  });
};


export const removeGameFromFavorites = async (userUid, gameId) => {
  const userRef = doc(db, 'users', userUid);
  await updateDoc(userRef, {
    favoriteGames: arrayRemove(gameId)
  });
};


export const isGameFavorited = async (userUid, gameId) => {
  const userRef = doc(db, 'users', userUid);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists() && userDoc.data().favoriteGames) {
    return userDoc.data().favoriteGames.includes(gameId);
  }
  return false;
};


export async function fetchFavoriteGames(userUid) {
  const userDocRef = doc(db, 'users', userUid); 
  const userDoc = await getDoc(userDocRef);
  const userData = userDoc.data();
  //console.log('User Doc Data:', userDoc.data());


  if (userDoc.exists()) {
    const userData = userDoc.data();
    return userData.favoriteGames || [];
} else {
    console.warn("User document doesn't exist");
    return [];
}

  const favoriteGameIDs = userData.favoriteGames;
  let favoriteGamesList = [];

  // Fetch details for each gameID
  for (let gameID of favoriteGameIDs) {
    const gameDocRef = doc(db, 'games', gameID.toString()); 
    const gameDoc = await getDoc(gameDocRef);

    if (gameDoc.exists()) {
      favoriteGamesList.push(gameDoc.data());
    }
  }

  return favoriteGamesList;
}


export async function fetchRatingsFromUser(userUid) {
  const userDocRef = doc(db, 'users', userUid);
  
  try {
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      console.log('User document not found.');
      return [];
    }

    const userData = userDocSnap.data();
    const ratings = userData.ratings || []; // Use an empty array as a fallback
    //console.log('Ratings found:', ratings);



    return ratings;
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    return []; 
  }
}

export const deleteUserComment = async (userUid, gameId) => {
  const userRef = doc(db, 'users', userUid);
  try {
    // Get the current user's document
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      console.error("User document doesn't exist");
      return { success: false, error: "User document doesn't exist" };
    }

    // Extract the ratings array from the user's document
    const userData = userDoc.data();
    const ratings = userData.ratings || [];

    // Filter out the rating for the specified game
    const updatedRatings = ratings.filter(rating => rating.gameId !== gameId);

    // Update the user's document with the new ratings array
    await updateDoc(userRef, {
      ratings: updatedRatings
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting user comment:", error);
    return { success: false, error };
  }
};


export { createUserAndFavoriteList };
export { getUserFavoritesReference };