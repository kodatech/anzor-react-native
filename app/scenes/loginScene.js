import React, { Component } from 'react'
import { Container, Content, Form, Item, Input, Label, Button, Text, Spinner, CheckBox, Icon } from 'native-base'
import {Actions} from 'react-native-router-flux'
import { Dimensions, Image, View, TouchableOpacity, TextInput, TouchableWithoutFeedback } from 'react-native'
import {connect} from 'react-redux'
import {emailChanged, passwordChanged, loginUser, rememberMe, checkIfRemember} from '../actions'

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

class LoginScene extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      // rememberMe: false,
      checked: false,
      passwordDisplayed: false,
      mdEye: 'md-eye-off',
      elementsHeight: Dimensions.get('window').height / 13,
      iconTop: Dimensions.get('window').height / 25,
      iconRight: Dimensions.get('window').height / 35,
      fiftheen: Dimensions.get('window').height / 45,
      heightRememberMe: Dimensions.get('window').height / 30,
      forty: Dimensions.get('window').height / 17
    }
  }

  componentDidMount () {
    this.props.rememberMe(true)
  }

  componentWillMount () {
    this.props.checkIfRemember()
  }

  toggleDisplay () {
    this.setState({
      passwordDisplayed: !this.state.passwordDisplayed,
      mdEye: this.state.passwordDisplayed ? 'md-eye-off' : 'md-eye'
    })
  }

  getNewDimensions () {
    this.setState({
      header: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      elementsHeight: Dimensions.get('window').height / 13,
      iconTop: Dimensions.get('window').height / 25,
      iconRight: Dimensions.get('window').height / 35,
      fiftheen: Dimensions.get('window').height / 45,
      heightRememberMe: Dimensions.get('window').height / 30,
      forty: Dimensions.get('window').height / 17
    })
  }

  rememberMeCheck () {
    this.props.rememberMe(this.state.checked)
    console.log(this.state.checked)
  }

  onPasswordChange (text) {
    this.props.passwordChanged(text)
  }

  onEmailChange (text) {
    this.props.emailChanged(text)
  }

  goToSignUp () {
    // console.log('goToSignUp')
    Actions.signUpScene()
  }

  goToForgotPassword () {
    Actions.passwordScene()
  }

  onButtonPress () {
    // loginUser email & password arguments
    this.props.loginUser(this.props.email, this.props.password)
  }

  renderButton() {
    if (this.props.loading) {
      return (
        <TouchableOpacity
          style={{height: this.state.elementsHeight, width: this.state.width / 1.2, backgroundColor: '#0083a9', alignItems: 'center', marginTop: this.state.fiftheen}}>
          <Spinner color='#FFFFFF' style={{height: 400, justifyContent: 'center', flex: 1}} />
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity
        onPress={this.onButtonPress.bind(this)}
        style={{height: this.state.elementsHeight, width: this.state.width / 1.2, backgroundColor: '#0083a9', alignItems: 'center', marginTop: this.state.fiftheen}}>
        <Text style={{color: '#FFFFFF', fontSize: this.state.fiftheen, textAlign: 'center', textAlignVertical: 'center', padding: this.state.fiftheen}}> Login </Text>
      </TouchableOpacity>
    )
  }

  renderScene () {
    if (this.state.loading) {
      return <Spinner color='#0083a9' style={{height: 400}} />
    }
    return (
      <View style={{backgroundColor: 'black', flexDirection: 'column', justifyContent: 'space-around'}} onLayout={this.getNewDimensions.bind(this)}>
        <TextInput
          placeholder='Username'
          style={{height: this.state.elementsHeight, width: this.state.width / 1.2, textAlign: 'center', backgroundColor: 'white', marginTop: this.state.fiftheen}}
          onChangeText={this.onEmailChange.bind(this)}
          value={this.props.email}
          underlineColorAndroid='transparent' />
        <View style={{flexDirection: 'row', position: 'relative'}}>
          <TextInput
            placeholder='Password'
            style={{height: this.state.elementsHeight, width: this.state.width / 1.2, textAlign: 'center', backgroundColor: 'white', marginTop: this.state.fiftheen}}
            onChangeText={this.onPasswordChange.bind(this)}
            value={this.props.password}
            secureTextEntry={!this.state.passwordDisplayed}
            underlineColorAndroid='transparent' />
          <TouchableWithoutFeedback style={{position: 'absolute'}} onPress={this.toggleDisplay.bind(this)}>
            <Icon name={this.state.mdEye} style={{color: '#000000', position: 'absolute', top: this.state.iconTop, right: this.state.iconRight, backgroundColor: '#FFFFFF'}} />
          </TouchableWithoutFeedback>
        </View>
        <View style={{height: this.state.elementsHeight, flexDirection: 'row', justifyContent: 'center', padding: this.state.fiftheen}}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                checked: !this.state.checked
              })
              this.rememberMeCheck()
            }}
            style={{height: this.state.forty, width: this.state.forty, backgroundColor: '#000000', alignItems: 'center'}}>
            <Icon name={!this.state.checked ? 'ios-radio-button-on' : 'ios-radio-button-off'} style={{position: 'absolute', top: 0, right: 2, fontSize: this.state.forty, color: '#0083a9'}} />
          </TouchableOpacity>
          <Text style={{height: this.state.forty - 5, color: '#FFFFFF', fontSize: this.state.fiftheen, textAlign: 'center', textAlignVertical: 'center', paddingLeft: this.state.forty / 2, paddingBottom: 0, paddingTop: this.state.forty / 4}}>Remember Me</Text>
        </View>
        {this.renderButton()}
        <TouchableOpacity
          onPress={this.goToForgotPassword.bind(this)}
          style={{height: this.state.elementsHeight, width: this.state.width / 1.2, backgroundColor: '#0083a9', alignItems: 'center', marginTop: this.state.fiftheen}}>
          <Text style={{color: '#FFFFFF', fontSize: this.state.fiftheen, textAlign: 'center', textAlignVertical: 'center', padding: this.state.fiftheen}}> Forgot Password? </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.goToSignUp.bind(this)}
          style={{height: this.state.elementsHeight, width: this.state.width / 1.2, backgroundColor: '#0083a9', alignItems: 'center', marginTop: this.state.fiftheen}}>
          <Text style={{color: '#FFFFFF', fontSize: this.state.fiftheen, textAlign: 'center', textAlignVertical: 'center', padding: this.state.fiftheen}}>Request a Login</Text>
        </TouchableOpacity>
        <Text style={{color: '#FFFFFF', fontSize: this.state.fiftheen, textAlign: 'center', textAlignVertical: 'center', marginTop: this.state.fiftheen, paddingBottom: this.state.fiftheen}}>{this.props.error}</Text>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.containerStyle}>
        <Image style={{width: 260}} source={require('../resources/logo2.png')} resizeMode='contain' />
        <Text style={{padding: 10, fontSize: 25, color: '#FFFFFF'}}>Barcode Scanner</Text>
        {this.renderScene()}
      </View>
    )
  }

}

const mapStateToProps = state => {
  // console.log(state)
  return {
    email: state.auth.email,
    password: state.auth.password,
    error: state.auth.error,
    loading: state.auth.loading
  }
}

export default connect(mapStateToProps, {emailChanged, passwordChanged, loginUser, rememberMe, checkIfRemember})(LoginScene)
