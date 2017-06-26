import React, { Component } from 'react'
import {ActionConst, Scene, Router} from 'react-native-router-flux'

import ScanScene from './scenes/scanScene'
import ListScene from './scenes/listScene'
import LoginScene from './scenes/loginScene'

import HomeScene from './scenes/web/homeScene'

export default class AppContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      store: {
        history: 'historyStore'
      }
    }
  }
  render () {
    return (
      <Router>
        <Scene key='root' direction='horizontal'>
          <Scene key='loginScene' animation='fade' component={LoginScene} stores={this.state.store} title='Login Scene' hideNavBar />
          <Scene key='listScene' animation='fade' type={ActionConst.REPLACE} component={ListScene} stores={this.state.store} title='List Scene' hideNavBar initial />
          <Scene key='scanScene' animation='fade' component={ScanScene} stores={this.state.store} title='Scan Scene' hideNavBar />
          <Scene key='homeScene' animation='fade' component={HomeScene} stores={this.state.store} title='Home Scene' hideNavBar />
        </Scene>
      </Router>
    )
  }
}
