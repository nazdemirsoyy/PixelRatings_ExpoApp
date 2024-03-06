import { View, Text, Dimensions } from 'react-native';
import React from 'react';
import * as Progress from 'react-native-progress';
import { theme } from '../theme';

const {width, height} = Dimensions.get('window');

export default function Loading() {
  return (
    <View style ={{height,
        width,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#151b1f'
       }}>
     <Progress.Circle
        size={160}
        color='transparent' 
        unfilledColor='grey'
        borderWidth={0}
        
      />
      <Progress.CircleSnail
        color={theme.background}
        thickness={12}
        size={160}
        style={{ position: 'absolute' }} // This ensures it overlays on top of the Circle
      />
    </View>
  );
}