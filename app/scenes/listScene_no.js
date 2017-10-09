import React, { Component } from 'react'
import {Actions} from 'react-native-router-flux'
import {Container, Content, Header, Button, Text, Left, Right, Footer, FooterTab, List, Body, ActionSheet, Spinner, Input, Icon, ListItem} from 'native-base'
import {WebView, Dimensions, StyleSheet, AsyncStorage, View, NetInfo, TouchableWithoutFeedback, ListView, TextInput, BackHandler} from 'react-native'
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

  async componentWillMount () {
    // this.props.checkIfLoggedOn('listScene')
    // this.props.getCartList()

    // this.createDataSource(this.props.cart.list)

    // let address = ADDRESS
    // fetch(address, { method: 'HEAD' })
    //   .then(() => {
    //     this.props.setIsConnected(true)
    //   })
    //   .catch(() => {
    //     this.props.setIsConnected(false)
    //   })
  }


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

  }

  render () {
    return (
      <Button onPress={Actions.homeScene} style={{backgroundColor: 'black', height: this.state.headerButtonHeight, width: this.state.headerButtonWidth}}>
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Icon style={{fontSize: this.state.headerButtonHeight / 2.5, color: '#e6ffff'}} name='search' />
          <Text style={{fontSize: 15, textAlign: 'center', color: '#e6ffff'}}>Search the Website</Text>
        </View>
      </Button>
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
