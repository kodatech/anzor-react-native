import React from 'react'
import { View, Image, Text } from 'react-native'

const SpinnerQty = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
      <Image source={require('../../resources/gif/spinner1.gif')} />
    </View>
  )
}

export default SpinnerQty
