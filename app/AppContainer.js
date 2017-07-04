import React, { Component } from 'react'
import {AsyncStorage, NetInfo} from 'react-native'
import {Spinner} from 'native-base'
import {ActionConst, Scene, Router} from 'react-native-router-flux'

import ScanScene from './scenes/scanScene'
import ListScene from './scenes/listScene'
import LoginScene from './scenes/loginScene'


import HomeScene from './scenes/web/homeScene'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'

export default class AppContainer extends Component {
  constructor (props) {
    // console.log(Dimensions.get('window').height / 7)
    super(props)
    // const ds = new List.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      store: {
        history: 'historyStore',
        loading: true
      }
    }
  }
  async componentWillMount () {
    AsyncStorage.getItem('orders').then((value) => {
      // console.log(typeof value)
      let obj = JSON.parse(value)
      // console.log(typeof obj)
      const products = []
      for (let key in obj) {
        products.push({
          code: key,
          value: obj[key]
        })
      }
      // console.log(obj)
      this.setState({
        products,
        loading: true
      })
    })
  }
  render () {
    if (!this.state.loading) {
    // if (this.props.cartList.loading) {
      return <Spinner style={{height: 400}} />
    }
    const cartList = {
      list: this.state.products,
      loading: true,
      error: ''
    }

    const connectionState = {
      isConnected: false
    }

    return (
      <Provider store={createStore(reducers, {connectionState}, applyMiddleware(ReduxThunk))}>
        <Router>
          <Scene key='root' direction='horizontal'>
            <Scene key='loginScene' animation='fade' component={LoginScene} title='Login Scene' hideNavBar />
            <Scene key='listScene' animation='fade' type={ActionConst.REPLACE} component={ListScene} title='List Scene' hideNavBar initial />
            <Scene key='scanScene' animation='fade' component={ScanScene} title='Scan Scene' hideNavBar />
            <Scene key='homeScene' animation='fade' component={HomeScene} title='Home Scene' hideNavBar />
          </Scene>
        </Router>
      </Provider>
    )
  }
}
