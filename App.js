import { StatusBar } from 'expo-status-bar';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import Navigation from './Navigation';


function App() {
  return (
    <Navigation/>
  );
}


AppRegistry.registerComponent('PixelRatings', () => App);

export default App;