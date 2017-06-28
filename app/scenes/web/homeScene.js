import React, { Component } from 'react'
import { WebView } from 'react-native'

export default class HomeScene extends Component {
  render () {
    return (
      <WebView
        // source={{uri: 'https://github.com/facebook/react-native'}}
        source={{uri: 'http://www.anzor.co.nz/'}}
      />
    )
  }
}
