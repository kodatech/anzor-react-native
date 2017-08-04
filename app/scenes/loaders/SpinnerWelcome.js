import React from 'react'
import { View, Image, Text } from 'react-native'

const SpinnerWelcome = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
      <Text style={{color: '#FFFFFF', fontSize: 20, textAlign: 'center', paddingBottom: 30}}>Welcome</Text>
      <Image source={require('../../resources/gif/spinner2.gif')} />
    </View>
  )
}

export default SpinnerWelcome
