import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ImageBackground,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {auth} from '../server/firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    const authInstance = getAuth();
    
    signInWithEmailAndPassword(authInstance, username, password)
      .then((userCredential) => {
        //console.log("Logged in successfully!");
        navigation.navigate('HomeScreen');
      })
      .catch((error) => {
        //console.error("Error logging in: ", error);
        Alert.alert("Wrong Password or Username!");
      });
  };
  
const handleRegister = () => {
    navigation.navigate('Register');  
};

const handleForgotPassword = () => {
  navigation.navigate('ForgotPassword');  
};

useEffect(() => {
  const authInstance = getAuth();

  // This listener automatically checks whether the user is already logged in or not.
  const unsubscribe = authInstance.onAuthStateChanged(user => {
    if (user) {
      // User is signed in, navigate to the HomeScreen.
      navigation.navigate('HomeScreen');
    }
    // If user is not signed in, stay on the Login screen.
    // You don't have to do anything else here.
  });

  // Cleanup the listener when the component unmounts.
  return unsubscribe;
}, []);

  return (
    <View style={styles.container}>
        <ImageBackground
          style={styles.background}
          source={require('../assets/bck6.jpg')}
        >
        <View style={styles.loginContainer}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#666"
          value={username}
          onChangeText={setUsername}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
          <View style={styles.optionsContainer}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.optionText}>Forgot Password</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.optionText}>Register</Text>
            </TouchableOpacity>
          </View>
      </View>
    </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    // backgroundColor: 'rgba(0,0,0,0.7)',
    // marginHorizontal: 20,
    // borderRadius: 10,
    paddingTop:0,
    flex:1,
  },background: {
    flex: 1,
    //resizeMode: 'cover',
    justifyContent: 'center',
  
  },
  loginContainer: {
    marginHorizontal: 35,
    paddingVertical: 45,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#179000',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  optionText: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18
  },
  forgotPasswordText: {
    color: '#FFF',
    marginTop: 10,
    textDecorationLine: 'underline',
    textAlign: 'center',
  }  
});