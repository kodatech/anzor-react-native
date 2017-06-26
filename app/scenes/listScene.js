import React, { Component } from 'react'
import {Actions} from 'react-native-router-flux'
import {Container, Content, Header, Button, Text, Left, Right, Footer, FooterTab, List, ListItem, Body, ActionSheet, Spinner, Input, Form} from 'native-base'
import {Dimensions, StyleSheet, AsyncStorage, View} from 'react-native'

var BUTTONS = [
  'Option 0',
  'Option 1',
  'Option 2',
  'Delete',
  'Cancel'
]

var DESTRUCTIVE_INDEX = 3
var CANCEL_INDEX = 4

export default class ListScene extends Component {
  constructor (props) {
    // console.log(Dimensions.get('window').height / 7)
    super(props)
    // const ds = new List.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      store: {
        history: 'historyStore'
      }
    }
  }

  componentWillMount () {
    AsyncStorage.getItem('orders').then((value) => {
      // console.log(typeof value)
      var obj = JSON.parse(value)
      // console.log(typeof obj)
      const products3 = []
      for (let key in obj) {
        products3.push({
          code: key,
          value: obj[key]
        })
      }
      // console.log(obj)
      this.setState({
        products: value,
        products3,
        loading: true
      })
    })
  }

  getNewDimensions () {
    this.setState({
      headerButtonHeight: Dimensions.get('window').height / 4.4,
      headerButtonWidth: Dimensions.get('window').width / 2.3,
      footerButtonHeight: Dimensions.get('window').height / 7
    })
  }

  render () {
    if (!this.state.loading) {
      return <Spinner style={{height: 400}} />
    }
    // var items = ['Simon Mignolet', 'Nathaniel Clyne', 'Dejan Lovren', 'Mama Sakho', 'Emre Can']
    return (
      <Container style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}} onLayout={this.getNewDimensions.bind(this)}>
        <Header style={{backgroundColor: 'white', height: this.state.headerButtonHeight + 5, paddingTop: 15, elevation: 0}}>
          <Left>
            <Button onPress={Actions.homeScene} style={{backgroundColor: 'black', height: this.state.headerButtonHeight, width: this.state.headerButtonWidth}}>
              <Text style={{flex: 1, fontSize: 20, textAlign: 'center'}}>Search the Website</Text>
            </Button>
          </Left>
          <Right>
            <Button onPress={Actions.scanScene} style={{backgroundColor: 'black', height: this.state.headerButtonHeight, width: this.state.headerButtonWidth}}>
              <Text style={{flex: 1, fontSize: 20, textAlign: 'center'}}>Scan Barcode</Text>
            </Button>
          </Right>
        </Header>
        <Content style={{paddingLeft: 10}}>
          <ListItem>
            <Body>
              <Text>{this.state.products}</Text>
            </Body>
          </ ListItem>
          <List dataArray={this.state.products3}
            renderRow={(item) =>
              <ListItem>
                <Body>
                  <Text>{item.code}</Text>
                  <Text note>{item.code}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{textAlignVertical: 'center'}}>Qty</Text>
                    <Input style={{width: 20}} value={item.value.toString()} onChangeText={(text) => this.setState({text})} />
                    <Text style={{textAlignVertical: 'center', marginLeft: 30}}>x</Text>
                    <Text style={{textAlignVertical: 'center'}}>$</Text>
                    <Input value='100' onChangeText={(text) => this.setState({text})} />
                    <Text style={{textAlignVertical: 'center'}}>=</Text>
                    <Text style={{textAlignVertical: 'center'}}>100</Text>
                  </View>
                </Body>
              </ListItem>
            }>
          </List>
          <ListItem>
            <Text style={{textAlignVertical: 'center'}}>2</Text>
            <Text style={{textAlignVertical: 'center'}}> items</Text>
            <Text style={{textAlignVertical: 'center'}}>Total: </Text>
            <Text style={{textAlignVertical: 'center'}}> xxxx.xx</Text>
          </ListItem>
        </Content>
        <Footer style={{backgroundColor: 'white', height: this.state.footerButtonHeight + 10, elevation: 0}}>
          <FooterTab style={{backgroundColor: 'white'}}>
            <Button style={{backgroundColor: 'black', height: this.state.footerButtonHeight, marginLeft: 10, marginRight: 5}}>
              <Text style={{textAlign: 'center', color: 'white'}}>Upload Scanned Items to Cart</Text>
            </Button>
            <Button style={{backgroundColor: 'black', marginLeft: 5, height: this.state.footerButtonHeight, marginRight: 5}}>
              <Text style={{textAlign: 'center', color: 'white'}}>View</Text>
              <Text style={{textAlign: 'center', color: 'white'}}>Cart</Text>
            </Button>
            <Button onPress={() => ActionSheet.show(
              {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: DESTRUCTIVE_INDEX,
                title: 'Testing ActionSheet'
              },
              (buttonIndex) => {
                this.setState({ clicked: BUTTONS[buttonIndex] })
              }
              )} style={{backgroundColor: 'black', marginLeft: 5, height: this.state.footerButtonHeight, marginRight: 10}}>
              <Text style={{textAlign: 'center', color: 'white'}}>Other Actions</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}
/* <Content style={{paddingLeft: 10}}>
  <Form>
    <ListItem>
      <Text>{this.state.products}</Text>
    </ListItem>
    <List dataArray={this.state.products3}
      renderRow={(item) =>
        <ListItem>
          <Text>{item.code}</Text>
          <Text>-</Text>
          <Text>{item.value}</Text>
          <Input />
        </ListItem>
      } />
    </Form>
</Content> */

const styles = StyleSheet.create({
  lineblack: {
    position: 'absolute',
    height: 1,
    width: Dimensions.get('window').width,
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'transparent'
  }
})
