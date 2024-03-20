//import ImagePicker from 'react-native-image-picker';
// import { launchImageLibrary } from 'react-native-image-picker';
import Svg, { Path } from 'react-native-svg';
import React, { useState,useEffect } from 'react';
import { Modal ,View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity,Alert } from 'react-native';
import { getFirestore, doc, getDoc,setDoc,getStorage, ref, uploadBytes, getDownloadURL  } from 'firebase/firestore';
import { auth } from '../server/firebase'; 
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

const db = getFirestore();

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

const saveUserData = async (name, email, avatar) => {
  const userRef = doc(db, 'users', auth.currentUser.uid);

  try {
    await setDoc(userRef, {
      name: name,
      email: email,
      avatar: avatar 
    }, { merge: true });  // This ensures it updates the fields and doesn't overwrite the whole document
    Alert.alert("User profile updated!");
    console.log("User profile updated!");
  } catch (error) {
    console.error("Error updating profile: ", error.message);
  }
};

const handleLogOff = () => {
  const authInstance = getAuth();

  signOut(authInstance).then(() => {
    console.log("User Logged Off");

    // Close the drawer
    navigation.dispatch(DrawerActions.closeDrawer());

    // Navigate specifically to the LoginPage within the MainStackNavigator
    navigation.navigate('Login');
  }).catch((error) => {
    console.error("Error logging off: ", error);
  });
};

const UserProfile = () => {
  const [name, setName] = useState('');
  // const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);


  const navigation = useNavigation();

  const gameImages = [
    { id: 1, source: require('../assets/tlou2.jpeg') },
    // Add other game images here
  ];

  const selectAvatar = (image) => {
    setAvatar(image);
    setModalVisible(false); // Close modal after selection
  };


  const chooseImage = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

  //   ImagePicker.showImagePicker(options, async (response) => {
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else {
  //       const source = { uri: response.uri };
  //       // Upload image to Firebase Storage
  //       const storage = getStorage();
  //       const storageRef = ref(storage, `users/${auth.currentUser.uid}/avatar.jpg`);
  //       await uploadBytes(storageRef, response.data, {
  //         contentType: response.type,
  //       });
  //       const downloadURL = await getDownloadURL(storageRef);
  //       setAvatar(downloadURL); // this is the URL you can save in Firestore and use to display the image
  //     }
  //   });
  // };

//   launchImageLibrary(options, async (response) => {
//     if (response.didCancel) {
//       console.log('User cancelled image picker');
//     } else if (response.error) {
//       console.log('ImagePicker Error: ', response.error);
//     } else {
//       const source = { uri: response.uri };

//       // Upload image to Firebase Storage
//       const storage = getStorage();
//       const storageRef = ref(storage, `users/${auth.currentUser.uid}/avatar.jpg`);

//       // NOTE: I changed `response.data` to `response.assets[0].uri` based on the updated library
//       await uploadBytes(storageRef, response.assets[0].uri, {
//         contentType: response.type,
//       });
      
//       const downloadURL = await getDownloadURL(storageRef);
//       setAvatar(downloadURL); // this is the URL you can save in Firestore and use to display the image
//       setModalVisible(false); // Close modal after selection
//     }
//   });
};



  useEffect(() => {
    const uid = auth.currentUser.uid;
    fetchUserData(uid).then(userData => {
      if (userData) {
        setName(userData.name || '');
        //setSurname(userData.surname || '');
        setEmail(userData.email || '');
        setAvatar(userData.avatar || null);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
    <View style ={styles.header}>
     <TouchableOpacity onPress={() => navigation.navigate('Profile')}style={styles.backButton}>
            <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5">
              <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </Svg>
    </TouchableOpacity>
      </View>
      {avatar ? (
      <UserAvatar size="100" src={avatar} />
      ) : (
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>Add Profile Picture</Text>
          </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {gameImages.map((img) => (
              <TouchableOpacity key={img.id} onPress={() => selectAvatar(img)}>
                <Image source={img.source} style={styles.gameImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>


      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={name}
        onChangeText={setName}
      />

      {/* <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={surname}
        onChangeText={setSurname}
      /> */}

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
      />

        <TouchableOpacity onPress={() => navigation.navigate('FavoriteGameScreen')}>
            <Text style={{color: 'blue', textDecorationLine: 'underline',alignSelf: 'flex-start', color:'white'}}>Favorites List</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('UserComment')}>
            <Text style={{color: 'blue', textDecorationLine: 'underline',alignSelf: 'flex-start', color:'white'}}>Comment List</Text>
        </TouchableOpacity>


      <View style={{ margin: 10 }}>
        <Button title="Save Profile" onPress={() => {
          saveUserData(name, email, avatar);
          console.log("User saved");
        }}/>
      </View>

      
    <Button title="Log Off" onPress={() => {
        handleLogOff();
        console.log("User logged off")
      }}/> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#151b1f',
    paddingTop:0,
  },
  header:{
    width: '100%', // Ensure the header container spans the full width
    flexDirection: 'row',
    justifyContent: 'flex-start', // Aligns children to the start of the cross axis (left)
    alignItems: 'center', // Aligns children to the center of the cross axis (vertically)
    marginBottom: 10,
    paddingTop:16,
  },
  backButton:{
    alignSelf: 'flex-start'
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  avatarText: {
    color: '#aaa',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    color:'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  gameImage: {
    width: 100,
    height: 100,
    margin: 10,
  },
});

export default UserProfile;