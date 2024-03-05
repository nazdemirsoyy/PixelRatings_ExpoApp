import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../theme';
import AllGamesScreen from '../screens/AllGamesScreen';

const { width, height } = Dimensions.get('window');

export default function GameList({title, data}) {
  const navigation = useNavigation();
  return (
    <View style= {{marginBottom: 16}}>
      <View style={{ marginLeft: 16, marginRight: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style ={{color: 'white', fontSize: 16}}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllGamesScreen', { games: data })}>
          <Text style={[styles.text, {fontSize: 16}]}> See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator ={false}
        contentContainerStyle = {{paddingHorizontal:15}}
      >
        {
          data && data.map((item, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => navigation.navigate('GameScreen', item)}
            >
              <View style={{marginRight: 4, marginBottom: 4, marginTop: 10}}>
                <Image
                  source={{uri: item.background_image}}
                  style={{
                    width: width * 0.33,
                    height: height * 0.22,
                    borderRadius: 20
                  }}
                />
                <Text style={{color:'white'}}>
                  {
                    item.name.length > 14 ? item.name.slice(0, 14) + '...' : item.name
                  }
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ))
        }
      </ScrollView>
    </View>
  );
}