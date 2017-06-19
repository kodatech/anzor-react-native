import React, { Component } from 'react'
import {Scene, Router} from 'react-native-router-flux'
import { Container, Content, Spinner, Header, Item, Input, Icon, Button, Text, Left, Body, Title, Right } from 'native-base'

export default class ListScene extends Component {
  constructor (props) {
    super(props)
    this.state = {
      store: {
        history: 'historyStore'
      }
    }
  }
  render () {
    return (
      <Container style={{borderBottomColor: 'black'}}>
        <Header style={{backgroundColor: 'white', height: 150, paddingTop: 20, paddingBottom: 20}}>
          <Left style={{paddingLeft: 15}}>
            <Button style={{backgroundColor: 'black', height: 130, width: 140}}>
              <Text style={{fontSize: 20, textAlign: 'center'}}>Search the Website</Text>
            </Button>
          </Left>

          <Right style={{paddingRight: 15}}>
            <Button style={{backgroundColor: 'black', height: 130, width: 140}}>
              <Text style={{fontSize: 20, textAlign: 'center'}}>Scan Barcode</Text>
            </Button>
          </Right>
        </Header>
      </Container>
    )
  }
}
