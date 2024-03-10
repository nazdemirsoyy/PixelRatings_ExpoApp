import { View, Text, TouchableWithoutFeedback, Dimensions, Image } from 'react-native'
import React, { useState } from 'react'
import Carousel from 'react-native-snap-carousel';
import {useNavigation} from  '@react-navigation/native'

var {width, height} = Dimensions.get('window');

export default function TrendingGames({data}) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(!data); // Assuming 'data' is passed as a prop

  const handleClick = (item) => {
    navigation.navigate('GameScreen', item);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
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