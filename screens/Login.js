import React, { useState } from 'react';
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
import {auth} from '../server/firebase'
import { getAuth, signInWithEmailAndPassword,sendPasswordResetEmail } from "firebase/auth";


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleLogin = () => {
    const authInstance = getAuth();
    
    signInWithEmailAndPassword(authInstance, username, password)
      .then((userCredential) => {
        // Successfully logged in
        console.log("Logged in successfully!");
        // Navigate to HomeScreen
        navigation.navigate('HomeScreen');
      })
      .catch((error) => {
        console.error("Error logging in: ", error);
        // Handle the error (maybe show a message to the user)
      });
  };
  
const handleRegister = () => {
    navigation.navigate('Register');  
};


  
const handleForgotPassword = () => {
  navigation.navigate('ForgotPassword');  
};


  return (
    <ImageBackground
      style={styles.background}
      //source={require('../assets/bck_image.jpg')}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  container: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#2E8B57',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:5,
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