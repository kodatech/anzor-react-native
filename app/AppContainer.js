import React, { Component } from 'react'
import {Scene, Router} from 'react-native-router-flux'

import ScanScene from './scenes/scanScene'
import ListScene from './scenes/listScene'

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
        <Scene key='root'>
          <Scene key='listScene' component={ListScene} stores={this.state.store} title='List Scene' hideNavBar />
          <Scene key='scanScene' component={ScanScene} stores={this.state.store} title='Scan Scene' hideNavBar />
        </Scene>
      </Router>
    )
  }
}
