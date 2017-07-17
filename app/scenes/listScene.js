import React, { Component } from 'react'
import {Actions} from 'react-native-router-flux'
import {Container, Content, Header, Button, Text, Left, Right, Footer, FooterTab, List, ListItem, Body, ActionSheet, Spinner, Input, Icon} from 'native-base'
import {Dimensions, StyleSheet, AsyncStorage, View, NetInfo, Networking, TouchableWithoutFeedback} from 'react-native'

import {connect} from 'react-redux'
import {getCartList, qtyChanged, clearList, deleteProduct, setIsConnected, checkOut, checkIfLoggedOn, logOut} from '../actions'

import {ConfirmModalScene} from './confirmModalScene'

/* *
 * Define the scene with cart.
 * Search the web site, scan barcode, upload scanned items to cart, view cart and other actions buttons.
 */
class ListScene extends Component {
  /**
   *
   * @param {obj} props The first number.
   */
  constructor () {
    // AsyncStorage.clear()
    super()
    // const ds = new List.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      headerButtonHeight: Dimensions.get('window').height / 4.4,
      headerButtonWidth: Dimensions.get('window').width / 2.3,
      footerButtonHeight: Dimensions.get('window').height / 7,
      widthDescription: Dimensions.get('window').width / 1.3,
      showModal: false
    }
  }

  async componentWillMount () {
    this.props.checkIfLoggedOn('listScene')
    this.props.cart.loading = true
    this.props.getCartList()
    let address = 'http://www.anzor.co.nz/'
    fetch(address, { method: 'HEAD' })
      .then(() => {
        this.props.setIsConnected(true)
      })
      .catch(() => {
        this.props.setIsConnected(false)
      })
  }

  async componentDidMount() {
    const dispatchConnected = isConnected => {
      console.log(isConnected)
      let address = 'http://www.anzor.co.nz/'
      fetch(address, { method: 'HEAD' })
        .then(() => {
          this.props.setIsConnected(true)
        })
        .catch(() => {
          this.props.setIsConnected(false)
        })
    }
    NetInfo.isConnected.fetch().then(() => {
      NetInfo.isConnected.addEventListener('change', dispatchConnected)
    })

  }

  onQtyChange = (id, text) => {
    this.props.cart.loading = true
    this.props.qtyChanged(text, id)
  }

  onCheckOut = () => {
    // this.props.cart.loading = true
    this.props.checkOut()
  }

  onAccept = () => {
    this.props.cart.loading = true
    // console.log(this.state.itemToDelete)
    this.props.deleteProduct(this.state.itemToDelete)
    this.setState({
      showModal: false
    })
  }

  onDecline = () => {
    // console.log(this.state.itemToDelete)
    this.setState({
      showModal: false
    })
  }

  getNewDimensions () {
    this.setState({
      headerButtonHeight: Dimensions.get('window').height / 4.4,
      headerButtonWidth: Dimensions.get('window').width / 2.3,
      footerButtonHeight: Dimensions.get('window').height / 7,
      widthDescription: Dimensions.get('window').width / 1.3
    })
    // console.log(this.state.widthDescription)
  }

  articleList() {
    if (!this.props.conn.isConnected) {
      return (
        <Content style={{flex: 1, flexDirection: 'column'}}>
          <Icon style={{fontSize: 100, marginLeft: 130, marginTop: 100, color: 'gray'}} name='md-cloud-outline' />
          <Text style={{fontSize: 10, marginLeft: 125, paddingTop: 10, color: 'gray'}}>No Internet Connection</Text>
        </Content>
      )
    }
    if (this.props.cart.loading) {
      return (
        <Spinner color='#0083a9' style={{height: 400}} />
      )
    }
    if (this.props.conn.isConnected) {
      console.log(this.props.cart.loading)
      if(!this.props.cart.loading) {
        return (
        <Content style={{marginLeft: 2}}>
          <ListItem style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View>
              <Text style={{color: 'red'}}>{this.props.cart.error}</Text>
              <Text style={{textAlignVertical: 'center', fontSize: 25}}>Scanned Product List</Text>
            </View>
          </ListItem>
          <List dataArray={this.props.cart.list}
            renderRow={(item) =>
              <ListItem>
                <Body>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#0083a9', width: this.state.widthDescription}}>{item.description}</Text>
                    <TouchableWithoutFeedback onPress={() => this.setState({
                      showModal: !this.state.showModal,
                      itemToDelete: item.code
                    })}><Text style={{fontWeight: 'bold'}}>X</Text></TouchableWithoutFeedback>
                  </View>
                  <Text note>{item.stockcode}</Text>
                  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'flex-start'}}>
                    <Text style={{textAlignVertical: 'center', width: 30}}>Qty</Text>
                    <View style={{width: 40, marginLeft: 1}}>
                      <Input name={item.code} defaultValue={item.value.toString()}
                        // onEndEditing={
                        onChange={
                          (e) => {
                            if (e.nativeEvent.text.trim() === '') {
                              return
                            }
                            this.onQtyChange(item.code, e.nativeEvent.text)
                          }
                        }
                        keyboardType='numeric' editable />
                    </View>
                    <Text style={{textAlignVertical: 'center', width: 10, marginLeft: 1}}>x</Text>
                    <Text style={{textAlignVertical: 'center', width: 10}}>$</Text>
                    <Text style={{textAlignVertical: 'center', width: 60, marginLeft: 1, marginRight: 10}}>{item.price}</Text>
                    <Text style={{textAlignVertical: 'center', width: 10}}>=</Text>
                    <Text style={{textAlignVertical: 'center'}}>{item.total}</Text>
                  </View>
                </Body>
              </ListItem>
          }>
          </List>
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
            <Text style={{color: 'green', fontSize: 30, textAlign: 'center'}}>{this.props.cart.message}</Text>
            <Text style={{color: 'green', fontSize: 100, textAlign: 'center'}}>{this.props.cart.arrow}</Text>
          </View>
          <ListItem style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', justifyContent: 'center', paddingLeft: 12}}>
              <Text style={{textAlignVertical: 'center', fontWeight: 'bold'}}>{this.props.cart.list.length}</Text>
              <Text style={{textAlignVertical: 'center', fontWeight: 'bold'}}> items</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center', paddingRight: 12}}>
              <Text style={{textAlignVertical: 'center', fontWeight: 'bold'}}>Total: </Text>
              <Text style={{textAlignVertical: 'center', fontWeight: 'bold'}}>{this.props.cart.totalOrder}</Text>
            </View>
          </ListItem>
          <ConfirmModalScene
            visible={this.state.showModal}
            onAccept={this.onAccept.bind(this)}
            onDecline={this.onDecline.bind(this)}>
            Are you sure you want to delete this?
          </ConfirmModalScene>
        </Content>
        )
      } else {
        return (
          <Spinner color='#0083a9' style={{height: 400}} />
        )
      }
    }
  }

  render () {
    // console.log(this.props)

    // if (!this.state.loading) {
    if (this.props.cart.loading) {
      return <Spinner color='#0083a9' style={{height: 400}} />
    }
    return (
      <Container style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}} onLayout={this.getNewDimensions.bind(this)}>
        <Header style={{backgroundColor: '#0083a9', height: this.state.headerButtonHeight + 20, paddingTop: 10, paddingBottom: 10, elevation: 0}}>
          <Left>
            <Button onPress={Actions.homeScene} disabled={!this.props.conn.isConnected} style={{backgroundColor: 'black', height: this.state.headerButtonHeight, width: this.state.headerButtonWidth}}>
              <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Icon style={{fontSize: 50}} color='white' name='search' />
                <Text style={{fontSize: 15, textAlign: 'center'}}>Search the Website</Text>
              </View>
            </Button>
          </Left>
          <Right>
            <Button onPress={Actions.scanScene} disabled={!this.props.conn.isConnected} style={{backgroundColor: 'black', height: this.state.headerButtonHeight, width: this.state.headerButtonWidth}}>
              <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Icon style={{fontSize: 50}} color='white' name='md-barcode' />
                <Text style={{fontSize: 15, textAlign: 'center'}}>Scan Barcode</Text>
              </View>
            </Button>
          </Right>
        </Header>
          {this.articleList()}
        <Footer style={{backgroundColor: 'white', height: this.state.footerButtonHeight + 20, elevation: 0}}>
          <FooterTab style={{backgroundColor: 'black'}}>
            <Button
              onPress={
                this.onCheckOut.bind(this)
              }
              disabled={!this.props.conn.isConnected}
              style={{backgroundColor: '#0083a9', height: this.state.footerButtonHeight, marginLeft: 10, marginRight: 5}}>
              <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Icon style={{fontSize: 35}} color='white' name='ios-cloud-upload-outline' />
                <Text style={{textAlign: 'center', color: 'white'}}>Upload to Cart</Text>
              </View>
            </Button>
            <Button onPress={Actions.cartScene} disabled={!this.props.conn.isConnected} style={{backgroundColor: '#0083a9', marginLeft: 5, height: this.state.footerButtonHeight, marginRight: 5}}>
              <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Icon style={{fontSize: 35}} color='white' name='ios-cart-outline' />
                <Text style={{textAlign: 'center', color: 'white'}}>View Cart</Text>
              </View>
            </Button>
            <Button onPress={this.bottomOptions.bind(this)} style={{backgroundColor: '#0083a9', marginLeft: 5, height: this.state.footerButtonHeight, marginRight: 10}}>
              <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Icon style={{fontSize: 35}} color='white' name='ios-list-outline' />
                <Text style={{textAlign: 'center', color: 'white'}}>Other Actions</Text>
              </View>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
  bottomOptions() {
    const BUTTONS = [
      'Clear the list',
      'Logout'
    ]

    const DESTRUCTIVE_INDEX = 3
    const CANCEL_INDEX = 4
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: 'OTHER ACTIONS'
      },
      (buttonIndex) => {
        if (BUTTONS[buttonIndex] === 'Clear the list') {
          this.props.clearList()
        }
        if (BUTTONS[buttonIndex] === 'Logout') {
          console.log('logout')
          // AsyncStorage.removeItem('user')
          // Actions.loginScene()
          this.props.logOut()
        }
        // this.setState({ clicked: BUTTONS[buttonIndex] })
      }
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
  console.log(state)
  return {
    cart: state.cart,
    conn: state.conn
  }
}

export default connect(mapStateToProps, {getCartList, qtyChanged, clearList, deleteProduct, setIsConnected, checkOut, checkIfLoggedOn, logOut})(ListScene)
