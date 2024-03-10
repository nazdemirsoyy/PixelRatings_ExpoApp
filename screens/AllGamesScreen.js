import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { styles } from '../theme';
import {useNavigation} from  '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function AllGamesScreen({ route }) {
  const [games, setGames] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // The games data is passed from the previous screen via navigation params
    if (route.params && route.params.games) {
      setGames(route.params.games);
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#151b1f' , paddingTop:0}}>
        {/* Back Button*/}
        <TouchableOpacity onPress ={() => navigation.goBack()}style ={ {borderRadius: 12, padding: 4, marginTop:30, marginBottom:30}}>
                <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5">
                <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </Svg>
            </TouchableOpacity>

           
        <FlatList
            data={games}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => navigation.navigate('Game', item)}>
                <View style={{ marginBottom: 4, marginLeft: 16, marginRight: 16, flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={{ uri: item.background_image }}
                        style={{
                            width: width * 0.33,
                            height: height * 0.22,
                            borderRadius: 20,
                            marginRight: 10
                        }}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>
                            {item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name}
                        </Text>
                    </View>
                </View>
                </TouchableWithoutFeedback>
            )}
        />
    </View>
);
}