import React, { Component } from 'react'
import {Actions} from 'react-native-router-flux'
import {Container, Content, Header, Button, Text, Left, Right, Footer, FooterTab, List, ListItem, Body, ActionSheet, Spinner, Input, Icon} from 'native-base'
import {Dimensions, StyleSheet, AsyncStorage, View, NetInfo, Networking} from 'react-native'

import {connect} from 'react-redux'

import {getCartList, qtyChanged, clearList, setIsConnected} from '../actions'

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
    // AsyncStorage.clear()
    super()
    // const ds = new List.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      headerButtonHeight: Dimensions.get('window').height / 4.4,
      headerButtonWidth: Dimensions.get('window').width / 2.3,
      footerButtonHeight: Dimensions.get('window').height / 7,
    }
  }

  async componentWillMount () {
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

    // let obj = await this.props
    // if (obj.camera) {
    //   // obj.camera.releaseCamera()
    //   // delete obj.camera
    //   // console.log(obj.camera)
    //   // obj.camera.destroy()
    // }
  }

  async componentDidMount() {
    const dispatchConnected = isConnected => {
      // this.props.setIsConnected(isConnected)
      let address = 'http://www.anzor.co.nz/'
      fetch(address, { method: 'HEAD' })
        .then(() => {
          // clearTimeout(tm)
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
    // console.log(id)
    // console.log(text)
    this.props.cart.loading = true
    this.props.qtyChanged(text, id)
  }

  getNewDimensions () {
    this.setState({
      headerButtonHeight: Dimensions.get('window').height / 4.4,
      headerButtonWidth: Dimensions.get('window').width / 2.3,
      footerButtonHeight: Dimensions.get('window').height / 7
    })
  }

  articleList() {
    // console.log(this.props.cart)
    if (!this.props.connectionState.isConnected) {
      return (
        <Content style={{flex: 1, flexDirection: 'column'}}>
          <Icon style={{fontSize: 100, marginLeft: 130, marginTop: 100, color: 'gray'}} name='md-cloud-outline' />
          <Text style={{fontSize: 10, marginLeft: 125, paddingTop: 10, color: 'gray'}}>No Internet Connection</Text>
        </Content>
      )
    }
    if (this.props.cart.loading) {
      return (
        <Spinner style={{height: 400}} />
      )
    }
    if (this.props.connectionState.isConnected) {
      console.log(this.props)
      return(
        <Content style={{marginLeft: 2}}>
          <List dataArray={this.props.cart.list}
            renderRow={(item) =>
              <ListItem>
                <Body>
                  <Text>{item.description}</Text>
                  <Text note>{item.code}</Text>
                  <Text note>{item.stockcode}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{textAlignVertical: 'center'}}>Qty</Text>
                    <Input name={item.code} style={{paddingLeft: 1, width: 20}} placeholder={item.value.toString()}
                      onEndEditing={
                        (e) => {
                          this.onQtyChange(item.code, e.nativeEvent.text)
                        }
                      }
                      maxLength={4} keyboardType='numeric' editable />
                    <Text style={{textAlignVertical: 'center'}}>x</Text>
                    <Text style={{textAlignVertical: 'center'}}>$</Text>
                    <Text style={{textAlignVertical: 'center'}}>{item.price}</Text>
                    <Text style={{textAlignVertical: 'center'}}>=</Text>
                    <Text style={{textAlignVertical: 'center'}}>{item.total}</Text>
                  </View>
                </Body>
              </ListItem>
          }>
          </List>
          <ListItem>
            <Text style={{textAlignVertical: 'center'}}>{this.props.cart.list.length}</Text>
            <Text style={{textAlignVertical: 'center'}}> items</Text>
            <Text style={{textAlignVertical: 'center'}}>Total: </Text>
            <Text style={{textAlignVertical: 'center'}}>{this.props.cart.totalOrder}</Text>
          </ListItem>
        </Content>
      )
    }
  }

  render () {
    // console.log(this.props)

    // if (!this.state.loading) {
    if (this.props.cart.loading) {
      return <Spinner style={{height: 400}} />
    }
    // console.log(this.props.cartList)
    return (
      <Container style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}} onLayout={this.getNewDimensions.bind(this)}>
        <Header style={{backgroundColor: 'white', height: this.state.headerButtonHeight + 5, paddingTop: 15, elevation: 0}}>
          <Left>
            <Button onPress={Actions.homeScene} disabled={!this.props.connectionState.isConnected} style={{backgroundColor: 'black', height: this.state.headerButtonHeight, width: this.state.headerButtonWidth}}>
              <Text style={{flex: 1, fontSize: 20, textAlign: 'center'}}>Search the Website</Text>
            </Button>
          </Left>
          <Right>
            <Button onPress={Actions.scanScene} disabled={!this.props.connectionState.isConnected} style={{backgroundColor: 'black', height: this.state.headerButtonHeight, width: this.state.headerButtonWidth}}>
              <Text style={{flex: 1, fontSize: 20, textAlign: 'center'}}>Scan Barcode</Text>
            </Button>
          </Right>
        </Header>
          {this.articleList()}
        <Footer style={{backgroundColor: 'white', height: this.state.footerButtonHeight + 10, elevation: 0}}>
          <FooterTab style={{backgroundColor: 'white'}}>
            <Button style={{backgroundColor: 'black', height: this.state.footerButtonHeight, marginLeft: 10, marginRight: 5}}>
              <Text style={{textAlign: 'center', color: 'white'}}>Upload Scanned Items to Cart</Text>
            </Button>
            <Button style={{backgroundColor: 'black', marginLeft: 5, height: this.state.footerButtonHeight, marginRight: 5}}>
              <Text style={{textAlign: 'center', color: 'white'}}>View</Text>
              <Text style={{textAlign: 'center', color: 'white'}}>Cart</Text>
            </Button>
            <Button onPress={this.bottomOptions.bind(this)} style={{backgroundColor: 'black', marginLeft: 5, height: this.state.footerButtonHeight, marginRight: 10}}>
              <Text style={{textAlign: 'center', color: 'white'}}>Other Actions</Text>
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
    cart: state.cartList,
    connectionState: state.connectionState
  }
}

export default connect(mapStateToProps, {getCartList, qtyChanged, clearList, setIsConnected})(ListScene)
