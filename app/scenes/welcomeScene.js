import React, { Component } from 'react'
import { View, Image, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { checkIfLoggedOn } from '../actions'

import { Input, Spinner } from 'native-base'

class WelcomeScene extends Component {

  componentDidMount() {
    // AsyncStorage.clear()
    this.props.checkIfLoggedOn()
  }

  // componentWillMount() {
  //
  // }

  render() {
    // if (this.props.loading) {
    //   return <Spinner size='large' />
    // }
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('../resources/logo.png')} />
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    loading: state.auth.loading
  }
}

export default connect(mapStateToProps, {checkIfLoggedOn})(WelcomeScene)
