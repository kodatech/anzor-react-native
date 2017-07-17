import React, { Component } from 'react'
import { Container, Content, Form, Item, Input, Label, Button, Text, Spinner } from 'native-base'
import {Actions} from 'react-native-router-flux'
import {Dimensions, Image, View} from 'react-native'
import {connect} from 'react-redux'
import {emailChanged, passwordChanged, loginUser} from '../actions'



const styles = {
  containerStyle: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    // backgroundColor: '#e6f2ff'
    backgroundColor: 'black'
  }
}

class LoginScene extends Component {
  constructor (props) {
    super(props)
    this.state = { loading: false }
  }

  getNewDimensions () {
    this.setState({
      header: Dimensions.get('window').height,
      width: Dimensions.get('window').width
    })
  }

  onPasswordChange (text) {
    this.props.passwordChanged(text)
  }

  onEmailChange (text) {
    this.props.emailChanged(text)
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
    if (this.props.loading) {
      return (
        <Button style={{width: this.state.width / 1.2, marginTop: 15, backgroundColor: '#0083a9', marginLeft: this.state.width / 9.5}} >
          <Spinner color='#FFFFFF' style={{height: 400, justifyContent: 'center', flex: 1}} />
        </Button>
      )
    }
    return (
      <Button
        style={{width: this.state.width / 1.2, marginTop: 15, backgroundColor: '#0083a9', marginLeft: this.state.width / 9.5}}
        onPress={this.onButtonPress.bind(this)}>
        <Text style={{flex: 1, justifyContent: 'center', textAlign: 'center'}}> Login </Text>
      </Button>
    )
  }

  renderScene () {
    if (this.state.loading) {
      return <Spinner color='#0083a9' style={{height: 400}} />
    }
    return (
      <View style={{backgroundColor: 'black'}} onLayout={this.getNewDimensions.bind(this)}>
        <Form style={{alignItems: 'center', width: this.state.width, height: this.state.height}}>
          <Item style={{width: this.state.width / 1.2, backgroundColor: 'white'}}>
            <Input
              placeholder='Username'
              style={{height: 45, textAlign: 'center'}}
              onChangeText={this.onEmailChange.bind(this)}
              value={this.props.email} />
          </Item>
          <Item style={{width: this.state.width / 1.2, backgroundColor: 'white', marginTop: 15}}>
            <Input
              placeholder='Password'
              style={{height: 45, textAlign: 'center'}}
              onChangeText={this.onPasswordChange.bind(this)}
              value={this.props.password}
              secureTextEntry />
          </Item>
          {this.renderButton()}
          <Button disabled style={{width: this.state.width / 1.2, marginTop: 15, backgroundColor: '#0083a9', marginLeft: this.state.width / 9.5}}>
            <Text style={{flex: 1, justifyContent: 'center', textAlign: 'center'}}> Forgot Password? </Text>
          </Button>
          <Text style={{color: '#FFFFFF', marginTop: 25}}>{this.props.error}</Text>
          <Text style={{color: '#FFFFFF', marginTop: 25}}>Dont have a login</Text>
          <Text style={{color: '#FFFFFF'}}>Click here to Sign Up</Text>
        </Form>
      </View>
    )
  }

  // renderScene () {
  //   if (this.state.loading) {
  //     return <Spinner color='#0083a9' style={{height: 400}} />
  //   }
  //   return (
  //     <View style={{backgroundColor: 'black'}} onLayout={this.getNewDimensions.bind(this)}>
  //       <Form style={{justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: 'black', width: this.state.width, height: this.state.height}}>
  //         <Item style={{width: this.state.width / 1.2, backgroundColor: 'white'}}>
  //           <Input
  //             placeholder='Username'
  //             style={{height: 45, textAlign: 'center'}}
  //             onChangeText={this.onEmailChange.bind(this)}
  //             value={this.props.email} />
  //         </Item>
  //         <Item style={{width: this.state.width / 1.2, backgroundColor: 'white', marginTop: 15}}>
  //           <Input
  //             placeholder='Password'
  //             style={{height: 45, textAlign: 'center'}}
  //             onChangeText={this.onPasswordChange.bind(this)}
  //             value={this.props.password}
  //             secureTextEntry />
  //         </Item>
  //         {this.renderButton()}
  //         <Button disabled style={{width: this.state.width / 1.2, marginTop: 15, backgroundColor: '#0083a9', marginLeft: this.state.width / 9.5}}>
  //           <Text style={{flex: 1, justifyContent: 'center', textAlign: 'center'}}> Forgot Password? </Text>
  //         </Button>
  //         <Text style={{color: '#FFFFFF', marginTop: 25}}>{this.props.error}</Text>
  //         <Text style={{color: '#FFFFFF', marginTop: 25}}>Dont have a login</Text>
  //         <Text style={{color: '#FFFFFF'}}>Click here to Sign Up</Text>
  //       </Form>
  //     </View>
  //   )
  // }

  render () {
    return (
      <Container style={styles.containerStyle}>
        <View style={{width: this.state.width / 1.2, height: 100, backgroundColor: 'white', marginTop: 10}} >
          <Text style={{textAlignVertical: 'center', textAlign: 'center'}}>Anzor Logo</Text>
        </View>
        <Text style={{marginTop: 10, paddingBottom: 50, color: '#FFFFFF'}}>Product Scanner</Text>
        {this.renderScene()}
      </Container>
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
  console.log(state)
  return {
    email: state.auth.email,
    password: state.auth.password,
    error: state.auth.error,
    loading: state.auth.loading
  }
}

export default connect(mapStateToProps, {emailChanged, passwordChanged, loginUser})(LoginScene)
