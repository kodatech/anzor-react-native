import React from 'react'
import { View, Image, Text } from 'react-native'

const Spinnerb = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
      <Image source={require('../../resources/gif/spinner3.gif')} />
    </View>
  )
}

export default Spinnerb
