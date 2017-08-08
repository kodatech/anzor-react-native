import React, { Component } from 'react'
import { Container, Content, Form, Item, Input, Label, Button, Text, Spinner, CheckBox, Icon, ActionSheet } from 'native-base'
import {Actions} from 'react-native-router-flux'
import { Dimensions, Image, View, TouchableOpacity, TextInput, TouchableWithoutFeedback } from 'react-native'
import {connect} from 'react-redux'
import {removeFromDevice, getUser} from '../actions'

const styles = {
  containerStyle: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    // justifyContent: 'space-around',
    backgroundColor: '#000000',
    paddingTop: 20
  }
}

class LogOutScene extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      elementsHeight: Dimensions.get('window').height / 10
    }
  }

  componentWillMount () {
    this.props.getUser()
  }

  getNewDimensions () {
    this.setState({
      header: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      elementsHeight: Dimensions.get('window').height / 10
    })
  }

  bottomOptions() {
    const BUTTONS = [
      'Remove account from device',
    ]

    const DESTRUCTIVE_INDEX = 3
    const CANCEL_INDEX = 4
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: ''
      },
      (buttonIndex) => {
        if (BUTTONS[buttonIndex] === 'Remove account from device') {
          this.props.removeFromDevice()
        }
        // this.setState({ clicked: BUTTONS[buttonIndex] })
      }
      )
  }
  renderScene () {
    if (this.state.loading) {
      return <Spinner color='#0083a9' style={{height: 400}} />
    }
    return (
      <View style={{backgroundColor: 'black', flexDirection: 'column', justifyContent: 'space-around', paddingTop: 100}} onLayout={this.getNewDimensions.bind(this)}>
        <Text style={{color: '#FFFFFF', fontSize: 15, textAlign: 'left', textAlignVertical: 'center', marginTop: 15, paddingBottom: 15}}>Tap to log in</Text>
        <TouchableOpacity
          onPress={Actions.loginScene}
          style={{height: this.state.elementsHeight, width: this.state.width / 1.2, backgroundColor: '#0083a9', alignItems: 'center', marginTop: 15}}>
          <Image source={require('../resources/user.png')} style={{position: 'absolute', top: 10, right: 255, width: 40, height: 40}} />
          <Text style={{color: '#FFFFFF', fontSize: 15, textAlign: 'center', textAlignVertical: 'center', padding: 20}}> User name </Text>
          <TouchableWithoutFeedback
            onPress={this.bottomOptions.bind(this)}>
            <Image source={require('../resources/mark_vertical.png')} style={{position: 'absolute', top: 15, right: 5, width: 30, height: 30}} />
          </TouchableWithoutFeedback>
        </TouchableOpacity>
        <Text style={{color: '#FFFFFF', fontSize: 15, textAlign: 'center', textAlignVertical: 'center', marginTop: 15, paddingBottom: 15}}>{this.props.error}</Text>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.containerStyle}>
        <Image source={require('../resources/logo2.png')} />
        <Text style={{padding: 20, fontSize: 25, color: '#FFFFFF'}}>Barcode Scanner</Text>
        {this.renderScene()}
      </View>
    )
  }
}

const mapStateToProps = state => {
  // console.log(state)
  return {
    email: state.auth.email,
    error: state.auth.error,
    loading: state.auth.loading
  }
}

export default connect(mapStateToProps, {removeFromDevice, getUser})(LogOutScene)
