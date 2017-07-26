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
import SignUpScene from './scenes/web/signUpScene'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'

import Spinnerd from './scenes/loaders/Spinnerd'

export default class AppContainer extends Component {
  // constructor (props) {
  //   // super(props)
  //   // this.state = {
  //   //   store: {
  //   //     // history: 'historyStore',
  //   //     loading: true
  //   //   }
  //   // }
  // }
  async componentWillMount () {
    // AsyncStorage.getItem('orders').then((value) => {
    //   let obj = JSON.parse(value)
    //   const products = []
    //   for (let key in obj) {
    //     if (obj[key]) {
    //       products.push({
    //         code: key,
    //         value: obj[key]
    //       })
    //     }
    //   }
    //   this.setState({
    //     products,
    //     loading: true
    //   })
    // })
    this.setState({
      loading: true
    })
  }
  render () {
    if (!this.state.loading) {
      return <Spinnerd />
    }
    // const cart = {
    //   // list: this.state.products,
    //   loading: true,
    //   error: ''
    // }

    const conn = {
      isConnected: false
    }

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
            <Scene key='signUpScene' animation='fade' component={SignUpScene} title='Sign Up Scene' hideNavBar />
          </Router>
        </Provider>
      </Root>
    )
  }
}
