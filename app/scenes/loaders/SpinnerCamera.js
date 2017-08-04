import React from 'react'
import { View, Image, Text } from 'react-native'

const SpinnerCamera = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
      <Text style={{color: '#FFFFFF', fontSize: 20, textAlign: 'center', paddingBottom: 30}}>Please scan your product</Text>
      <Image source={require('../../resources/gif/spinner1.gif')} />
    </View>
  )
}

export default SpinnerCamera
