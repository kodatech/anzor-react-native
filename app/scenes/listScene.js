import React, { Component } from 'react'
import {Actions} from 'react-native-router-flux'
import {Container, Content, Header, Button, Text, Left, Right, Footer, FooterTab, List, ListItem, Body, ActionSheet, Spinner, Input} from 'native-base'
import {Dimensions, StyleSheet, AsyncStorage, View} from 'react-native'

import {connect} from 'react-redux'

import {getCartList, qtyChanged} from '../actions'

const BUTTONS = [
  'Clear the list',
  'Option 1',
  'Option 2',
  'Delete',
  'Cancel'
]

const DESTRUCTIVE_INDEX = 3
const CANCEL_INDEX = 4

/**
 * Define the scene with cartList.
 * Search the web site, scan barcode, upload scanned items to cart, view cart and other actions buttons.
 */
class ListScene extends Component {
  /**
   *
   * @param {obj} props The first number.
   */
  constructor () {
    // console.log(props)
    // console.log(Dimensions.get('window').height / 7)
    super()
    // const ds = new List.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {}
  }

  componentWillMount () {
    this.props.getCartList()
    // AsyncStorage.getItem('orders').then((value) => {
    //   // console.log(typeof value)
    //   let obj = JSON.parse(value)
    //   // console.log(typeof obj)
    //   const products3 = []
    //   for (let key in obj) {
    //     if (obj) {
    //       products3.push({
    //         code: key,
    //         value: obj[key]
    //       })
    //     }
    //   }
    //   // console.log(obj)
    //   // this.setState({
    //   //   products: value,
    //   //   products3,
    //   //   loading: true
    //   // })
    // })
  }

  onQtyChange = (id, text) => {
    this.props.qtyChanged(text, id)
  }

  getNewDimensions () {
    this.setState({
      headerButtonHeight: Dimensions.get('window').height / 4.4,
      headerButtonWidth: Dimensions.get('window').width / 2.3,
      footerButtonHeight: Dimensions.get('window').height / 7
    })
  }

  render () {
    // console.log(this.state)

    // if (!this.state.loading) {
    if (this.props.cartList.loading) {
      return <Spinner style={{height: 400}} />
    }
    // console.log(this.props.cartList)
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
          <List dataArray={this.props.cartList.list}
            renderRow={(item) =>
              <ListItem>
                <Body>
                  <Text>{item.code}</Text>
                  <Text note>{item.code}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{textAlignVertical: 'center'}}>Qty</Text>
                    <Input style={{width: 20}} placeholder={item.value.toString()} onChangeText={this.onQtyChange.bind(this, item.code)} keyboardType='numeric' />
                    <Text style={{textAlignVertical: 'center', marginLeft: 30}}>x</Text>
                    <Text style={{textAlignVertical: 'center'}}>$</Text>
                    <Text style={{textAlignVertical: 'center'}}>100</Text>
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

const mapStateToProps = state => {
  // console.log(state)
  return {
    cartList: state.cartList
  }
}

export default connect(mapStateToProps, {getCartList, qtyChanged})(ListScene)
