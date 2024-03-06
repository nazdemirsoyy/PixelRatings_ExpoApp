import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator , DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import HomeScreen from './screens/HomeScreen';
import AllGamesScreen from './screens/AllGamesScreen';
import SearchScreen from './screens/SearchScreen';
import GameScreen from './screens/GameScreen';
import Login from './screens/Login';
import Register from './screens/Register';
import ForgotPassword from './screens/ForgotPassword';
import Profile from './screens/Profile';
import Sidebar from './components/Sidebar';
import FavoriteGameScreen from './screens/FavoriteGameScreen';
import UserComment from './screens/UserComment';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
       <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
       <Stack.Screen name="AllGamesScreen" component={AllGamesScreen} options={{ headerShown: false }} />
       <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
       <Stack.Screen name="GameScreen" component={GameScreen} options={{ headerShown: false }} />
       <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
       <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
       <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
       <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
       <Stack.Screen name="FavoriteGameScreen" component={FavoriteGameScreen} options={{ headerShown: false }} />
       <Stack.Screen name="UserComment" component={UserComment} options={{ headerShown: false }} />
    </Stack.Navigator>
    
  );
}


function SidebarDrawer(props) {
  return (
    <Drawer.Navigator drawerContent={drawerProps => <Sidebar {...drawerProps} isLoggedIn={isLoggedIn} />}>
      <Drawer.Screen name="MainStack" component={MainStackNavigator} options={{ headerShown: false }} />
      <Drawer.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
      {/* Add more drawer screens if needed */}
    </Drawer.Navigator>
  );
}

// function Navigation() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//       <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
//       <Stack.Screen name="AllGamesScreen" component={AllGamesScreen} options={{ headerShown: false }} />
//       <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
//       <Stack.Screen name="GameScreen" component={GameScreen} options={{ headerShown: false }} />
//       <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
//       <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
//       <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
//       <Stack.Screen name="SidebarDrawer" component={Sidebar} options={{ headerShown: false }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// function Navigation() {
//   return (
//     <NavigationContainer ref={navigationRef}>
//       <MainDrawerNavigator />
//     </NavigationContainer>
//   );
// }


export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigationRef = useRef(null);

  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setIsLoggedIn(!!user); // Simplified this statement
    });

    return () => unsubscribe();
  }, []);

  // Use the reference to navigate
  useEffect(() => {
    if (!isLoggedIn && navigationRef.current) {
      // Use a delay to allow for the navigation state to be updated after logout
      setTimeout(() => navigationRef.current.navigate('Login'), 0);
    }
  }, [isLoggedIn]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Drawer.Navigator 
      initialRouteName="Home" 
      drawerContent={(props) => <Sidebar {...props} isLoggedIn={isLoggedIn} />}
      drawerStyle={{
        width: '50%',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={MainStackNavigator} 
        options={{ headerShown: false }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={Profile} 
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>

    </NavigationContainer>
  );
}

