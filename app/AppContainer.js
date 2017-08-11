import React, { Component } from 'react'
import {AsyncStorage, BackHandler} from 'react-native'
import {Spinner, Root} from 'native-base'
import {ActionConst, Scene, Router} from 'react-native-router-flux'

import WelcomeScene from './scenes/welcomeScene'
import ScanScene from './scenes/scanScene'
import ListScene from './scenes/listScene'
import LoginScene from './scenes/loginScene'
import QtyScene from './scenes/qtyScene'
import LogOutScene from './scenes/logOutScene'

import HomeScene from './scenes/web/homeScene'
import CartScene from './scenes/web/cartScene'
import SignUpScene from './scenes/web/signUpScene'
import PasswordScene from './scenes/web/passwordScene'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'

import SpinnerWelcome from './scenes/loaders/SpinnerWelcome'

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
      return <SpinnerWelcome />
    }

    const conn = {
      isConnected: false
    }

    return (
      <Root>
        <Provider store={createStore(reducers, {conn}, applyMiddleware(ReduxThunk))}>
          <Router>
            <Scene key='welcomeScene' animation='withoutAnimation' type={ActionConst.REPLACE} component={WelcomeScene} title='Welcome Scene' hideNavBar />
            <Scene key='loginScene' animation='withoutAnimation' type={ActionConst.REPLACE} component={LoginScene} title='Login Scene' hideNavBar />
            <Scene key='listScene' animation='withoutAnimation' type={ActionConst.REPLACE} component={ListScene} title='List Scene' hideNavBar />
            <Scene key='scanScene' animation='withoutAnimation' component={ScanScene} title='Scan Scene' hideNavBar />
            <Scene key='qtyScene' animation='withoutAnimation' component={QtyScene} title='Quantity Scene' hideNavBar />
            <Scene key='homeScene' animation='withoutAnimation' component={HomeScene} title='Home Scene' hideNavBar />
            <Scene key='cartScene' animation='withoutAnimation' component={CartScene} title='Cart Scene' hideNavBar />
            <Scene key='signUpScene' animation='withoutAnimation' type={ActionConst.REPLACE} component={SignUpScene} title='Sign Up Scene' hideNavBar />
            <Scene key='passwordScene' animation='withoutAnimation' type={ActionConst.REPLACE} component={PasswordScene} title='Password Scene' hideNavBar />
            <Scene key='logOutScene' animation='withoutAnimation' type={ActionConst.REPLACE} component={LogOutScene} title='Logout Scene' hideNavBar />
          </Router>
        </Provider>
      </Root>
    )
  }
}
