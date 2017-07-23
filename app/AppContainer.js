import React, { Component } from 'react'
import {AsyncStorage, NetInfo} from 'react-native'
import {Spinner, Root} from 'native-base'
import {ActionConst, Scene, Router} from 'react-native-router-flux'

import WelcomeScene from './scenes/welcomeScene'
import ScanScene from './scenes/scanScene'
import ListScene from './scenes/listScene'
import LoginScene from './scenes/loginScene'


import HomeScene from './scenes/web/homeScene'
import CartScene from './scenes/web/cartScene'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'

import Spinnerd from './scenes/loaders/Spinnerd'

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
        if (obj[key]) {
          products.push({
            code: key,
            value: obj[key]
          })
        }
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
      // return <Spinner color='#0083a9' style={{height: 400}} />
      return <Spinnerd />
    }
    const cart = {
      list: this.state.products,
      loading: true,
      error: ''
    }

    const conn = {
      isConnected: false
    }

    // <Scene key='root' direction='horizontal'>
    //   <Scene key='welcomeScene' animation='fade' component={WelcomeScene} title='Welcome Scene' hideNavBar />
    //   <Scene key='loginScene' animation='fade' component={LoginScene} title='Login Scene' hideNavBar />
    //   <Scene key='listScene' animation='fade' type={ActionConst.REPLACE} component={ListScene} title='List Scene' hideNavBar />
    //   <Scene key='scanScene' animation='fade' component={ScanScene} title='Scan Scene' hideNavBar />
    //   <Scene key='homeScene' animation='fade' component={HomeScene} title='Home Scene' hideNavBar />
    //   <Scene key='cartScene' animation='fade' component={CartScene} title='Cart Scene' hideNavBar />
    // </Scene>

    return (
      <Root>
        <Provider store={createStore(reducers, {conn}, applyMiddleware(ReduxThunk))}>
          <Router>
            <Scene key='welcomeScene' animation='fade' component={WelcomeScene} title='Welcome Scene' hideNavBar />
            <Scene key='loginScene' animation='fade' component={LoginScene} title='Login Scene' hideNavBar />
            <Scene key='listScene' animation='fade' type={ActionConst.REPLACE} component={ListScene} title='List Scene' hideNavBar />
            <Scene key='scanScene' animation='fade' component={ScanScene} title='Scan Scene' hideNavBar />
            <Scene key='homeScene' animation='fade' component={HomeScene} title='Home Scene' hideNavBar />
            <Scene key='cartScene' animation='fade' component={CartScene} title='Cart Scene' hideNavBar />
          </Router>
        </Provider>
      </Root>
    )
  }
}
