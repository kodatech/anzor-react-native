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
      elementsHeight: Dimensions.get('window').height / 10,
      iconSize: Dimensions.get('window').height / 17,
      top: Dimensions.get('window').height / 65,
      left: Dimensions.get('window').height / 65,
      fiftheen: Dimensions.get('window').height / 45,
      fifty: Dimensions.get('window').height / 13
    }
  }

  componentWillMount () {
    this.props.getUser()
  }

  getNewDimensions () {
    this.setState({
      header: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      elementsHeight: Dimensions.get('window').height / 10,
      iconSize: Dimensions.get('window').height / 17,
      top: Dimensions.get('window').height / 65,
      left: Dimensions.get('window').height / 65,
      fiftheen: Dimensions.get('window').height / 45,
      fifty: Dimensions.get('window').height / 13
    })
    console.log(Dimensions.get('window').height / 13)
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

  //           <Image source={require('../resources/user.png')} style={{position: 'absolute', top: 15, right: 265, width: 30, height: 30}} />

  renderScene () {
    if (this.state.loading) {
      return <Spinner color='#0083a9' style={{height: 400}} />
    }
    return (
      <View style={{backgroundColor: 'black', flexDirection: 'column', justifyContent: 'space-around', paddingTop: 100}} onLayout={this.getNewDimensions.bind(this)}>
        <Text style={{color: '#FFFFFF', fontSize: this.state.fiftheen, textAlign: 'left', textAlignVertical: 'center', marginTop: this.state.fiftheen, paddingBottom: this.state.fiftheen}}>Tap to log in</Text>
        <TouchableOpacity
          onPress={Actions.loginScene}
          style={{height: this.state.elementsHeight, width: this.state.width / 1.2, backgroundColor: '#0083a9', alignItems: 'center', marginTop: this.state.fiftheen}}>
          <Icon style={{fontSize: this.state.iconSize, top: this.state.top, left: this.state.left, position: 'absolute', color: '#e6ffff'}} name='md-person' />
          <Text style={{color: '#FFFFFF', fontSize: this.state.fiftheen - 2, textAlign: 'center', textAlignVertical: 'center', paddingTop: this.state.fiftheen + 10, paddingLeft: 5}}> {this.props.email} </Text>
          <TouchableWithoutFeedback
            onPress={this.bottomOptions.bind(this)}
            style={{width: this.state.fifty, height: this.state.fifty, position: 'absolute', top: this.state.fiftheen + 5}}>
            <Icon name='md-menu' style={{color: '#FFFFFF', position: 'absolute', top: this.state.top, right: this.state.fiftheen + 5, width: 3, fontSize: this.state.iconSize + 5}} />
          </TouchableWithoutFeedback>
        </TouchableOpacity>
        <Text style={{color: '#FFFFFF', fontSize: this.state.fiftheen, textAlign: 'center', textAlignVertical: 'center', marginTop: this.state.fiftheen, paddingBottom: this.state.fiftheen}}>{this.props.error}</Text>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.containerStyle}>
        <Image source={require('../resources/logo2.png')} />
        <Text style={{padding: this.state.fiftheen + 5, fontSize: this.state.fiftheen, color: '#FFFFFF'}}>Barcode Scanner</Text>
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
