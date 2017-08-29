import React, { Component } from 'react'
import {Actions} from 'react-native-router-flux'
import {Container, Content, Header, Button, Text, Left, Right, Footer, FooterTab, List, Body, ActionSheet, Spinner, Input, Icon, ListItem} from 'native-base'
import {Dimensions, StyleSheet, AsyncStorage, View, NetInfo, TouchableWithoutFeedback, ListView, TextInput, BackHandler} from 'react-native'
import {connect} from 'react-redux'
import {getCartList, qtyChanged, clearList, clearError, deleteProduct, setIsConnected, checkOut, checkIfLoggedOn, logOut} from '../actions'
import {ConfirmModalScene} from './confirmModalScene'
import {NoConnectionModalScene} from './noConnectionModalScene'
import { ADDRESS } from '../actions/configuration'
import SpinnerList from './loaders/SpinnerList'

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
    this.state = {
      headerButtonHeight: Dimensions.get('window').height / 5.5,
      headerButtonWidth: Dimensions.get('window').width / 2.6,
      footerButtonHeight: Dimensions.get('window').height / 7,
      widthDescription: Dimensions.get('window').width / 1.3,
      stringHeight: Dimensions.get('window').height / 25,
      arrowHeight: Dimensions.get('window').height / 8,
      hundred: Dimensions.get('window').height / 6.5,
      ten: Dimensions.get('window').height / 60,
      buttonBlue: '#0083a9',
      buttonGrey: '#D3D3D3',
      showModal: false,
      testloading: true
    }
    BackHandler.addEventListener('hardwareBackPress', function() {
     // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
     // Typically you would use the navigator here to go to the last state.
      // BackHandler.exitApp()
      // if (!this.onMainScreen()) {
      //   this.goBack()
      //   return true
      // }
      Actions.pop()
      return true
    })
  }

  async componentWillMount () {
    this.props.checkIfLoggedOn('listScene')
    this.props.getCartList()

    this.createDataSource(this.props.cart.list)

    let address = ADDRESS
    fetch(address, { method: 'HEAD' })
      .then(() => {
        this.props.setIsConnected(true)
      })
      .catch(() => {
        this.props.setIsConnected(false)
      })
  }

  componentWillReceiveProps (nextProps) {
    this.createDataSource(nextProps.cart.list)
  }

  createDataSource (list) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    this.dataSource = ds.cloneWithRows(list)
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        testloading: false
      })
    }, 3000)
    const dispatchConnected = isConnected => {
      // console.log(isConnected)
      let address = ADDRESS
      fetch(address, { method: 'HEAD' })
        .then(() => {
          this.props.setIsConnected(true)
        })
        .catch(() => {
          this.props.setIsConnected(false)
        })
    }
    NetInfo.isConnected.fetch()
      .then(() => {
        NetInfo.isConnected.addEventListener('change', dispatchConnected)
      })
  }

  onQtyChange = (id, text) => {
    this.props.qtyChanged(text, id)
  }

  onCheckOut = () => {
    this.props.checkOut()
  }

  onAccept = () => {
    this.props.deleteProduct(this.state.itemToDelete)
    this.setState({
      showModal: false
    })
  }

  onDecline = () => {
    this.setState({
      showModal: false
    })
  }

  getNewDimensions () {
    this.setState({
      headerButtonHeight: Dimensions.get('window').height / 5.5,
      headerButtonWidth: Dimensions.get('window').width / 2.6,
      footerButtonHeight: Dimensions.get('window').height / 7,
      widthDescription: Dimensions.get('window').width / 1.3,
      stringHeight: Dimensions.get('window').height / 25,
      arrowHeight: Dimensions.get('window').height / 8,
      hundred: Dimensions.get('window').height / 6.5,
      ten: Dimensions.get('window').height / 60
    })
    // console.log(this.state.ten)
  }

  renderRow(item) {
    return (
      <ListItem>
        <Body>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: this.state.buttonBlue, width: this.state.widthDescription}}>{item.description}</Text>
            <TouchableWithoutFeedback style={{width: 40, height: 40}} onPress={() => this.setState({
              showModal: !this.state.showModal,
              itemToDelete: item.code
            })}><View><Text style={{fontWeight: 'bold'}}>X</Text></View></TouchableWithoutFeedback>
          </View>
          <Text note>{item.stockcode}</Text>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'flex-start'}}>
            <Text style={{textAlignVertical: 'center', width: 25}}>Qty</Text>
            <View style={{width: 60, marginLeft: 0, paddingLeft: 0}}>
              <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(text) => this.setState({text})}
                value='hee'
              />
              <TextInput name={item.code} defaultValue={item.value.toString()}
                // onEndEditing={
                onChange={
                  (e) => {
                    if (e.nativeEvent.text.trim() === '') {
                      return
                    }
                    this.onQtyChange(item.code, e.nativeEvent.text)
                  }
                }
                keyboardType='numeric'
                editable
                autoFocus={false} />
            </View>
            <Text style={{textAlignVertical: 'center', width: 10, marginLeft: 1}}>x</Text>
            <Text style={{textAlignVertical: 'center', width: 10, paddingLeft: 1, marginLeft: 1}}>$</Text>
            <Text style={{textAlignVertical: 'center', width: 60, marginLeft: 1, marginRight: 5}}>{item.price}</Text>
            <Text style={{textAlignVertical: 'center', width: 10, paddingLeft: 1, marginLeft: 1}}>=</Text>
            <Text style={{textAlignVertical: 'center', marginLeft: 1}}>{item.total}</Text>
          </View>
        </Body>
      </ListItem>
    )
  }

  articleList() {
    // if (!this.props.conn.isConnected) {
    //   return (
    //     <Content style={{flex: 1, flexDirection: 'column'}}>
    //       <Icon style={{fontSize: this.state.hundred, marginLeft: this.state.hundred + 30, marginTop: this.state.hundred, color: 'gray'}} name='md-cloud-outline' />
    //       <Text style={{fontSize: this.state.ten, marginLeft: this.state.hundred + 25, paddingTop: this.state.ten, color: 'gray'}}>No Internet Connection</Text>
    //     </Content>
    //   )
    // }
    if (!this.props.cart.loading) {
      return (
        <View style={{flex: 1}}>
          <Content>
            <ListItem style={{flexDirection: 'row', justifyContent: 'center'}}>
              <View>
                <Text style={{color: 'red'}}>{this.props.cart.error}</Text>
                <Text style={{color: 'green', textAlign: 'center'}}>{this.props.cart.message}</Text>
                <Text style={{textAlignVertical: 'center', fontSize: 25}}>Scanned Product List</Text>
              </View>
            </ListItem>
            <ListView
              enableEmptySections
              dataSource={this.dataSource}
              renderRow={(item) =>
                <View>
                  <ListItem>
                    <Body>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{color: this.state.buttonBlue, width: this.state.widthDescription}}>{item.description}</Text>
                        <TouchableWithoutFeedback hitSlop={{top: 10, left: 10, bottom: 10, right: 10}} style={{width: 40, height: 40}} onPress={() => this.setState({
                          showModal: !this.state.showModal,
                          itemToDelete: item.code
                        })}><Text style={{fontWeight: 'bold'}}>X</Text></TouchableWithoutFeedback>
                      </View>
                      <Text note>{item.stockcode}</Text>
                      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'flex-start'}}>
                        <Text style={{textAlignVertical: 'center', width: 35}}>Qty</Text>
                        <View style={{overflow: 'hidden', padding: 0, backgroundColor: 'transparent', flex: 1, borderColor: 'grey', borderWidth: 1, height: 30, alignContent: 'center'}}>
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
                            keyboardType='numeric' editable style={{padding: 3, width: 100, color: '#000000', height: 30}} />
                        </View>
                        <Text style={{textAlignVertical: 'center', width: 10, marginLeft: 1}}>x</Text>
                        <Text style={{textAlignVertical: 'center', width: 10, paddingLeft: 1, marginLeft: 1}}>$</Text>
                        <Text style={{textAlignVertical: 'center', width: 60, marginLeft: 1, marginRight: 5}}>{item.price}</Text>
                        <Text style={{textAlignVertical: 'center', width: 10, paddingLeft: 1, marginLeft: 1}}>=</Text>
                        <Text style={{textAlignVertical: 'center', marginLeft: 1}}>{item.total}</Text>
                      </View>
                    </Body>
                  </ListItem>
                </View>
              }
            />
          </Content>
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
          <NoConnectionModalScene
            visible={!this.props.conn.isConnected} >
              No Internet Connection
          </NoConnectionModalScene>
        </View>
      )
    }
  }

  scanScene () {
    this.props.clearError()
    Actions.scanScene({type: 'reset'})
  }

  render () {
    // console.log(this.props)
    if (this.props.cart.loading) {
      return (
        <SpinnerList />
      )
    }
    if (this.state.testloading) {
      return (
        <SpinnerList />
      )
    }
//               disabled={!this.props.conn.isConnected || !this.props.cart.viewCart}

    return (
      <Container style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}} onLayout={this.getNewDimensions.bind(this)}>
        <Header style={{backgroundColor: '#0083a9', height: this.state.headerButtonHeight + 40, paddingTop: 20, paddingBottom: 10, elevation: 0}}>
          <Left style={{paddingLeft: 20}}>
            <Button onPress={Actions.homeScene} disabled={!this.props.conn.isConnected} style={{backgroundColor: 'black', height: this.state.headerButtonHeight, width: this.state.headerButtonWidth}}>
              <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Icon style={{fontSize: this.state.headerButtonHeight / 2.5, color: '#e6ffff'}} name='search' />
                <Text style={{fontSize: 15, textAlign: 'center', color: '#e6ffff'}}>Search the Website</Text>
              </View>
            </Button>
          </Left>
          <Right style={{paddingRight: 20}}>
            <Button onPress={this.scanScene.bind(this)} disabled={!this.props.conn.isConnected} style={{backgroundColor: 'black', height: this.state.headerButtonHeight, width: this.state.headerButtonWidth}}>
              <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Icon style={{fontSize: this.state.headerButtonHeight / 2.5, color: '#e6ffff'}} name='md-barcode' />
                <Text style={{fontSize: 15, textAlign: 'center', color: '#e6ffff'}}>Scan Barcode</Text>
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
              disabled={!this.props.conn.isConnected || !this.props.upToCart || this.props.cart.loading}
              style={{backgroundColor: !this.props.cart.upToCart ? this.state.buttonGrey : this.state.buttonBlue, height: this.state.footerButtonHeight, marginLeft: 10, marginRight: 5}}>
              <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Icon style={{fontSize: 35, color: '#e6ffff'}} name='ios-cloud-upload-outline' />
                <Text style={{textAlign: 'center', color: '#e6ffff'}}>Upload to Cart</Text>
              </View>
            </Button>
            <Button
              onPress={Actions.cartScene}
              disabled={!this.props.conn.isConnected}
              style={{backgroundColor: this.state.buttonBlue, marginLeft: 5, height: this.state.footerButtonHeight, marginRight: 5}}>
              <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Icon style={{fontSize: 35, color: '#e6ffff'}} name='ios-cart-outline' />
                <Text style={{textAlign: 'center', color: '#e6ffff'}}>View Cart</Text>
              </View>
            </Button>
            <Button
              onPress={this.bottomOptions.bind(this)}
              style={{backgroundColor: this.state.buttonBlue, marginLeft: 5, height: this.state.footerButtonHeight, marginRight: 10}}>
              <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Icon style={{fontSize: 35, color: '#e6ffff'}} name='ios-list-outline' />
                <Text style={{textAlign: 'center', color: '#e6ffff'}}>Other Actions</Text>
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
      'Logout',
      'Cancel'
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
          // console.log('logout')
          AsyncStorage.removeItem('orders')
          // Actions.loginScene()
          this.props.clearError()
          this.props.logOut()
        }
        if (BUTTONS[buttonIndex] === 'Cancel') {
          this.props.clearError()
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
  // console.log(state)
  return {
    cart: state.cart,
    conn: state.conn,
    upToCart: state.cart.upToCart,
  }
}

export default connect(mapStateToProps, {getCartList, qtyChanged, clearList, clearError, deleteProduct, setIsConnected, checkOut, checkIfLoggedOn, logOut})(ListScene)
