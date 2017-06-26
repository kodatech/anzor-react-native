import React, { Component } from 'react'
import { Container, Content, Form, Item, Input, Label, Button, Text, Spinner } from 'native-base'
import {Actions} from 'react-native-router-flux'
import {Dimensions} from 'react-native'


const styles = {
  containerStyle: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#e6f2ff'
  }
}

export default class LoginScene extends Component {
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

  onButtonPress () {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({ loading: false })
      Actions.listScene()
    }, 3000)
  }

  renderButton () {
    if (this.state.loading) {
      return <Spinner style={{height: 400}} />
    }

    return (
      <Content style={{backgroundColor: 'black'}} onLayout={this.getNewDimensions.bind(this)}>
        <Form style={{justifyContent: 'center', alignItems: 'center', marginTop: 100, backgroundColor: 'black', width: this.state.width, height: this.state.height}}>
          <Item floatingLabel style={{width: this.state.width / 1.2, backgroundColor: 'white'}}>
            <Label style={{textAlign: 'center'}}>Username</Label>
            <Input style={{height: 45}} />
          </Item>
          <Item floatingLabel style={{width: this.state.width / 1.2, backgroundColor: 'white'}}>
            <Label style={{textAlign: 'center'}} >Password</Label>
            <Input style={{height: 45}} secureTextEntry />
          </Item>
          <Button style={{width: this.state.width / 1.2, marginTop: 15, backgroundColor: '#337ab7', marginLeft: this.state.width / 9.5}} onPress={this.onButtonPress.bind(this)}>
            <Text style={{flex: 1, justifyContent: 'center', textAlign: 'center'}}> Login </Text>
          </Button>
          <Button style={{width: this.state.width / 1.2, marginTop: 15, backgroundColor: '#337ab7', marginLeft: this.state.width / 9.5}}>
            <Text style={{flex: 1, justifyContent: 'center', textAlign: 'center'}}> Forgot Password? </Text>
          </Button>
          <Text style={{color: 'white', marginTop: 55}}>Dont have a login</Text>
          <Text style={{color: 'white'}}>Click here to Sign Up</Text>
        </Form>
      </Content>
    )
  }

  render () {
    return (
      <Container style={styles.containerStyle}>
        {this.renderButton()}
      </Container>
    )
  }
}
