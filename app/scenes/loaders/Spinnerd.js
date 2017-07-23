import React from 'react'
import { View, Image, Text } from 'react-native'

const Spinnerd = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
      <Text style={{color: '#FFFFFF', fontSize: 20, textAlign: 'center', paddingBottom: 30}}>Please wait while we load your stored list of products</Text>
      <Image source={require('../../resources/gif/spinner4.gif')} />
    </View>
  )
}

export default Spinnerd
