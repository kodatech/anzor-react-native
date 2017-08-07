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
      elementsHeight: Dimensions.get('window').height / 13
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
      elementsHeight: Dimensions.get('window').height / 13
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
    // const {email, password} = this.props
    // this.setState({ loading: true })
    this.props.loginUser(this.props.email, this.props.password)
    // Actions.listScene()
    // setTimeout(() => {
    //   this.setState({ loading: false })
    //   Actions.listScene()
    // }, 3000)
  }

  renderButton() {
    // <TouchableOpacity
    //   onPress={this.goToForgotPassword.bind(this)}
    //   style={{paddingBottom: 0, height: 60, width: this.state.width / 1.2, backgroundColor: '#0083a9', alignItems: 'center'}}>
    //   <Text style={{color: '#FFFFFF', fontSize: 15, textAlign: 'center', textAlignVertical: 'center', padding: 20}}> Forgot Password? </Text>
    // </TouchableOpacity>
    // <Button style={{width: this.state.width / 1.2, marginTop: 15, backgroundColor: '#0083a9', marginLeft: this.state.width / 9.5}} >
    //   <Spinner color='#FFFFFF' style={{height: 400, justifyContent: 'center', flex: 1}} />
    // </Button>
    if (this.props.loading) {
      return (
        <TouchableOpacity
          style={{height: this.state.elementsHeight, width: this.state.width / 1.2, backgroundColor: '#0083a9', alignItems: 'center', marginTop: 15}}>
          <Spinner color='#FFFFFF' style={{height: 400, justifyContent: 'center', flex: 1}} />
        </TouchableOpacity>
      )
    }
    return (
      // <Button
      //   style={{width: this.state.width / 1.2, marginTop: 15, backgroundColor: '#0083a9', marginLeft: this.state.width / 9.5}}
      //   onPress={this.onButtonPress.bind(this)}>
      //   <Text style={{flex: 1, justifyContent: 'center', textAlign: 'center'}}> Login </Text>
      // </Button>
      <TouchableOpacity
        onPress={this.onButtonPress.bind(this)}
        style={{height: this.state.elementsHeight, width: this.state.width / 1.2, backgroundColor: '#0083a9', alignItems: 'center', marginTop: 15}}>
        <Text style={{color: '#FFFFFF', fontSize: 15, textAlign: 'center', textAlignVertical: 'center', padding: 15}}> Login </Text>
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
          style={{height: this.state.elementsHeight, width: this.state.width / 1.2, textAlign: 'center', backgroundColor: 'white', marginTop: 15}}
          onChangeText={this.onEmailChange.bind(this)}
          value={this.props.email}
          underlineColorAndroid='transparent' />
        <View style={{flexDirection: 'row', position: 'relative'}}>
          <TextInput
            placeholder='Password'
            style={{height: this.state.elementsHeight, width: this.state.width / 1.2, textAlign: 'center', backgroundColor: 'white', marginTop: 15}}
            onChangeText={this.onPasswordChange.bind(this)}
            value={this.props.password}
            secureTextEntry={!this.state.passwordDisplayed}
            underlineColorAndroid='transparent' />
          <TouchableWithoutFeedback style={{position: 'absolute'}} onPress={this.toggleDisplay.bind(this)}>
            <Icon name={this.state.mdEye} style={{color: '#000000', position: 'absolute', top: 25, right: 20}} />
          </TouchableWithoutFeedback>
        </View>
        <View style={{height: this.state.elementsHeight, flexDirection: 'row', justifyContent: 'center', padding: 20}}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                checked: !this.state.checked
              })
              this.rememberMeCheck()
            }}
            style={{height: 25, width: 25, backgroundColor: '#0083a9', alignItems: 'center'}}>
            <Icon name='md-checkmark' style={{color: !this.state.checked ? '#FFFFFF' : '#0083a9', backgroundColor: '#0083a9', position: 'absolute', top: -2, right: 2}} />
          </TouchableOpacity>
          <Text style={{height: 25, color: '#FFFFFF', fontSize: 15, textAlign: 'center', textAlignVertical: 'center', paddingLeft: 20, paddingBottom: 3, paddingTop: 3}}>Remember Me</Text>
        </View>
        {this.renderButton()}
        <TouchableOpacity
          onPress={this.goToForgotPassword.bind(this)}
          style={{height: this.state.elementsHeight, width: this.state.width / 1.2, backgroundColor: '#0083a9', alignItems: 'center', marginTop: 15}}>
          <Text style={{color: '#FFFFFF', fontSize: 15, textAlign: 'center', textAlignVertical: 'center', padding: 15}}> Forgot Password? </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.goToSignUp.bind(this)}
          style={{height: this.state.elementsHeight, width: this.state.width / 1.2, backgroundColor: '#0083a9', alignItems: 'center', marginTop: 15}}>
          <Text style={{color: '#FFFFFF', fontSize: 15, textAlign: 'center', textAlignVertical: 'center', padding: 15}}>Request a Login</Text>
        </TouchableOpacity>
        <Text style={{color: '#FFFFFF', fontSize: 15, textAlign: 'center', textAlignVertical: 'center', marginTop: 15, paddingBottom: 15}}>{this.props.error}</Text>
      </View>
    )
  }

  // <TouchableWithoutFeedback
  //   style={{alignItems: 'center', backgroundColor: '#0083a9'}}
  //   onPress={() => this.setState({
  //     checked: !this.state.checked
  //   })}>
  //   <Icon name='md-checkmark' style={{color: '#FFFFFF', backgroundColor: !this.state.checked ? '#000000' : '#FFFFFF', position: 'absolute', top: 20, right: 200}} />
  // </TouchableWithoutFeedback>
  // <Text style={{height: 25, color: '#FFFFFF', fontSize: 15, textAlign: 'center', textAlignVertical: 'center', paddingLeft: 20, paddingBottom: 3, paddingTop: 3}}>Remember Me</Text>


  render () {
    return (
      <View style={styles.containerStyle}>
        <Image source={require('../resources/logo2.png')} />
        <Text style={{padding: 20, fontSize: 25, color: '#FFFFFF'}}>Barcode Scanner</Text>
        {this.renderScene()}
      </View>
    )
  }
  // render () {
  //   return (
  //     <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
  //       <View style={{width: this.state.width / 1.2, height: 50, backgroundColor: 'white', marginTop: 30}} >
  //         <Text style={{textAlignVertical: 'center', textAlign: 'center'}}>Anzor Logo</Text>
  //       </View>
  //       <Text style={{marginTop: 10, paddingBottom: 50, color: '#FFFFFF'}}>Product Scanner</Text>
  //       {this.renderScene()}
  //     </View>
  //   )
  // }
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
