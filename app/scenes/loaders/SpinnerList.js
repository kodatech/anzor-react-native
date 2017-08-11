import React from 'react'
import { View, Image, Text } from 'react-native'

const SpinnerList = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
      <Image source={require('../../resources/gif/spinner2.gif')} />
    </View>
  )
}

export default SpinnerList
