import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  AsyncStorage,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback
  // Keyboard
} from 'react-native'
import { Spinner } from 'native-base'
import {connect} from 'react-redux'
import {addNewProduct, qtyChangeFromProduct, checkIfLoggedOn, discardProduct} from '../actions'
import {Actions} from 'react-native-router-flux'

import SpinnerQty from './loaders/SpinnerQty'


class QtyScene extends Component {

  constructor (props) {
    super(props)
    this.state = {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width
    }
    // console.log(this.state.width / 1.29)
  }

  addNewProduct (text) {
    this.props.addNewProduct()
  }

  onQtyChange (text) {
    this.props.qtyChangeFromProduct(text)
  }

  isKanbanItem () {
    if (this.props.product && this.props.product[0].isKanban) {
      return ('Kanban Item')
    }
  }

  discardProduct () {
    // console.log(this.props.cart)
    this.props.discardProduct()
    Actions.scanScene({type: 'reset'})
  }

  renderButton () {
    if (this.props.loading) {
      return (
        <TouchableOpacity
          style={{paddingBottom: 0, height: 80, width: 200, backgroundColor: '#000000', alignItems: 'center'}}
          onPress={this.addNewProduct.bind(this)}>
          <Spinner color='#FFFFFF' style={{height: 400, justifyContent: 'center', flex: 1}} />
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity
        style={{paddingBottom: 0, height: 80, width: 200, backgroundColor: '#000000', alignItems: 'center'}}
        onPress={this.addNewProduct.bind(this)}>
        <Text style={{color: '#FFFFFF', fontSize: 25, textAlign: 'center', textAlignVertical: 'center', padding: 20}}>Add Quantity</Text>
      </TouchableOpacity>
    )
  }

  render () {
    // console.log(this.props.cart)
    if (this.props.cart.loading) {
      return (
        <SpinnerQty />
      )
    }
    if (this.props.product) {
      // console.log(this.props.product[0])
      return (
        <View style={{flex: 1, backgroundColor: '#0083a9'}}>
          <View style={{height: this.state.height / 1.6, flexDirection: 'column', alignContent: 'center', alignItems: 'center'}}>
            <TouchableWithoutFeedback style={{width: 40, height: 40}}
              onPress={this.discardProduct.bind(this)}>
              <View>
                <Text style={{color: '#FFFFFF', fontSize: 30, textAlign: 'right', paddingLeft: this.state.width / 1.29, fontWeight: 'bold'}}>X</Text>
              </View>
            </TouchableWithoutFeedback>
            <View>
              <Text style={{color: '#FFFFFF', fontSize: 25, textAlign: 'center'}}>Type in quantity for:</Text>
            </View>
            <View><Text style={{color: '#000000', fontSize: 25, textAlign: 'center', padding: 10}}>{this.props.product[0].description}</Text></View>
            <View style={{paddingBottom: 0, justifyContent: 'center', alignContent: 'center', flexDirection: 'row'}}>
              <TextInput
                style={{height: 80, borderColor: 'gray', borderWidth: 1, backgroundColor: '#FFFFFF', fontSize: 45, width: 200, textAlign: 'center'}}
                defaultValue={this.props.product[0].quantity.toString()}
                editable
                underlineColorAndroid='transparent'
                keyboardType='numeric'
                onChangeText={this.onQtyChange.bind(this)}
                autoFocus
                // this.addNewProduct(this.refs.textInput._lastNativeText)
              />
            </View>
            <Text style={{color: '#b3ff66', fontSize: 25, textAlign: 'center'}}>{this.isKanbanItem()}</Text>
            <View style={{marginBottom: 0, justifyContent: 'center', alignContent: 'center', flexDirection: 'row'}}>
              {this.renderButton()}
            </View>
          </View>
        </View>
      )
    }
  }
}

const mapStateToProps = state => {
  // console.log(state)
  return {
    cart: state.cart,
    conn: state.conn,
    product: state.cart.product,
    loading: state.cart.loading
  }
}

export default connect(mapStateToProps, {addNewProduct, qtyChangeFromProduct, checkIfLoggedOn, discardProduct})(QtyScene)
