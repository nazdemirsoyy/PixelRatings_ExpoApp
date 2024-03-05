import { View, Text, TouchableWithoutFeedback, Dimensions, Image } from 'react-native'
import React from 'react'
import Carousel from 'react-native-snap-carousel';
import {useNavigation} from  '@react-navigation/native'

var {width, height} = Dimensions.get('window');

export default function TrendingGames({data}) {
  const navigation = useNavigation();
  const handleClick = (item) => {
    navigation.navigate('Game', item);
  }

  return (
    <View style={{marginBottom: 8, marginLeft: 10}} >
      <Text style={{color: 'white',  fontSize: 30, marginTop:30, marginBottom:10}}>Trending</Text>
      <Carousel
        data={data}
        renderItem={({item}) => <MovieCard item = {item} handleClick ={handleClick} />}
        firstItem={1}
        inactiveSlideOpacity={0.60}
        sliderWidth={width}
        itemWidth={width*0.62}
        slideStyle = {{display:'flex', alignItems: 'center'}}
      />
    </View>
  )
}


const MovieCard = ({item, handleClick}) => {
  return (
    <TouchableWithoutFeedback onPress={() => handleClick(item)}>
      <Image
        // source = {require('../assets/tlou2.jpeg')}
        source={{uri: item.background_image}}
        
        style= {{
            width: width*0.6,
            height: height*0.4,
            borderRadius:20
        }}
        />
    </TouchableWithoutFeedback>
  )
}