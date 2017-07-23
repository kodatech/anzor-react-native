import React from 'react'
import { View, Image, Text } from 'react-native'

const Spinnerc = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
      <Text style={{color: '#FFFFFF', fontSize: 40}}>Please wait</Text>
      <Image source={require('../../resources/gif/spinner3.gif')} />
    </View>
  )
}

export default Spinnerc
