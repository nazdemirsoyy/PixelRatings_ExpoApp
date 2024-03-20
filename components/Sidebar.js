import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


export default function Sidebar({ navigation, isLoggedIn }) {

  const handleProfileNavigation = () => {
    if (isLoggedIn) {
       navigation.navigate('Profile');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
      <Text style={styles.title}>Home</Text>
      </TouchableOpacity>
       <TouchableOpacity onPress={handleProfileNavigation}>
        <Text style={styles.option}>Profile</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
        <Text style={styles.option}>Settings</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151b1f',
    
    padding: 20,
  },
  title: {
    fontSize: 30,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  option: {
    fontSize: 18,
    color: '#FFFFFF',
    marginVertical: 10,
  },
});