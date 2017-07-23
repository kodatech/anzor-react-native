import React, { Component } from 'react'
import { View, Image, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { checkIfLoggedOn } from '../actions'

import { Input, Spinner } from 'native-base'

import Spinnerb from './loaders/Spinnerd'

class WelcomeScene extends Component {

  componentDidMount() {
    // AsyncStorage.clear()
    this.props.checkIfLoggedOn('listScene')
  }

  // componentWillMount() {
  //
  // }

  render() {
    // if (this.props.loading) {
    //   return <Spinner size='large' />
    // }
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
        <Spinnerb />
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    loading: state.auth.loading,
    auth: state.auth
  }
}

export default connect(mapStateToProps, {checkIfLoggedOn})(WelcomeScene)
