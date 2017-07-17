import React, { Component } from 'react'
import {
  StyleSheet,
  Vibration,
  TouchableOpacity,
  View,
  Text,
  AsyncStorage,
  Dimensions
} from 'react-native'
import {connect} from 'react-redux'
import {addNewProduct, checkIfLoggedOn} from '../actions'
import {Actions} from 'react-native-router-flux'
import {Button} from 'native-base'
import Camera from 'react-native-camera'
class ScanScene extends Component {
  constructor (props) {
    super(props)
    // console.log(Dimensions.get('window').height / 10)
    // console.log(Dimensions.get('window').width / 2.5)
    this.state = {
      scanning: false,
      barCodeScannedValue: false,
      barCodeScannedType: false,
      focusStatus: false,
      buttonWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      rectangleHeight: Dimensions.get('window').height / 2.5,
      rectangleWidth: Dimensions.get('window').width / 1.4,
      rectangleBlueBorderColor: '#0083a9',
      rectangleGreenBorderColor: '#00FF00',
      heightBetweenAngles: Dimensions.get('window').height / 4.5,
      widthBetweenAngles: Dimensions.get('window').width / 2.5,
      angleSize: Dimensions.get('window').height / 10
    }

    this._handleBarCodeRead = this._handleBarCodeRead.bind(this)
  }

  async componentDidMount () {
    this.props.checkIfLoggedOn('scanScene')
  }

  _setBarCodeScanned (e) {
    this.setState({ barCodeScannedValue: e.data })
    this.setState({ barCodeScannedType: e.type })
  }

  _setScanning (value) {
    this.setState({ scanning: value })
  }

  getNewDimensions () {
    this.setState({
      buttonWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      rectangleHeight: Dimensions.get('window').height / 2.5,
      rectangleWidth: Dimensions.get('window').width / 1.4,
      heightBetweenAngles: Dimensions.get('window').height / 4.5,
      widthBetweenAngles: Dimensions.get('window').width / 2.5,
      angleSize: Dimensions.get('window').height / 10
    })
    // console.log(Dimensions.get('window').height / 10)
  }

  async _handleBarCodeReadWithButton (e) {
    /* DO NOT DELETE THIS BELOW */
    /* await this.refs.camera.capture().then((obj) => {
      console.log(obj.path)
    }) */
    // console.log(this.refs)
    Vibration.vibrate()
    this.setState({ focusStatus: true })
    this._setScanning(true)
    this._setBarCodeScanned(e)
  }

  _handleBarCodeRead (e) {
    if (!this.state.scanning) {
      Vibration.vibrate()
      this._setFocusStatus(true)
      this._setScanning(true)
      // this.props.onRead(e)
      /* if (this.props.reactivate) {
        setTimeout(() => (this._setScanning(false)), this.props.reactivateTimeout);
      } */
    }
  }

  _setFocusStatus (value) {
    this.setState({ focusStatus: value })
  }

  _renderCamera () {
    return (
      <Camera style={styles.preview} onBarCodeRead={this._handleBarCodeReadWithButton.bind(this)} captureAudio={false} ref='camera'>
        {this._renderCameraMarker()}
        <View style={{paddingBottom: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor: 'black', marginBottom: 20}}>
          <View style={this.state.focusStatus ? styles.outercirclegreen : styles.outercirclered}>
            <View style={styles.transparentcircle}>
              <TouchableOpacity style={this.state.focusStatus ? styles.circlegreen : styles.circlered} onPress={this._onPressCode.bind(this)} />
            </View>
          </View>
          <Button onPress={Actions.listScene} style={{backgroundColor: '#0083a9', width: this.state.buttonWidth}}>
            <Text style={styles.returnMessage}>RETURN TO PRODUCT LIST</Text>
          </Button>
        </View>
      </Camera>
    )
  }

  async _onPressCode (e) {
    this.props.addNewProduct(this.state.barCodeScannedValue)
    // await AsyncStorage.getItem('orders').then(stores => {
    //   if (this.state.barCodeScannedValue !== false) {
    //     if (stores != null) {
    //       let ordersAux = JSON.parse(stores)
    //       if (ordersAux[this.state.barCodeScannedValue] !== undefined) {
    //         let value = this.state.barCodeScannedValue.toString(), order = {
    //             [value]: ordersAux[this.state.barCodeScannedValue] + 1
    //           }
    //         AsyncStorage.mergeItem('orders', JSON.stringify(order))
    //       } else {
    //         let value = this.state.barCodeScannedValue.toString(), order = {
    //             [value]: 1
    //           }
    //         AsyncStorage.mergeItem('orders', JSON.stringify(order))
    //       }
    //     } else {
    //       let value = this.state.barCodeScannedValue.toString(), order = {
    //           [value]: 1
    //         }
    //       AsyncStorage.setItem('orders', JSON.stringify(order))
    //     }
    //   } else {
    //     console.log('Select a bar code please!')
    //   }
    // })

    this._setFocusStatus(false)
    /*test = [9420019475858, 9420019475865, 9420019433551, 9420019469048, 9420019469031, 9420019450497, 9420019446056, 9420019425587, 9420019499991, 9420019433117, 9420019439683, 9420019438952, 9420019469024, 9420019466962, 9420019436941, 9420019454532, 9420019454525, 9420019469017, 9420019405176, 9420019469055, 9420019469062, 9420019447848, 9420019413881, 9420019413874, 9420019469307, 9420019405169, 9420019469291, 9420019449033, 9420019469086, 9420019405039, 9420019469079, 9420019439164, 9420019468553, 9420019405022, 9420019413928, 9420019486541, 9420019479757, 9420019471812, 9420019416455, 9420006800335, 9420019466320, 9420019466276, 9420019431571, 9420006800236, 9420006800229, 9420006800212, 9420006800205, 9420006800199, 9420006800182, 9420006800175, 9420006800168, 9420006800151, 9420006800137, 9420019461264, 9420006800106, 9420019451951, 9420019457281, 9420019433315, 9420019451265, 9420019451555, 9420019451340, 9420019451548, 9420019457251, 9420019451258, 9420019451531, 9420019451395, 9420019451524, 9420019451333, 9420019451517, 9420019457243, 9420019451241, 9420019451500, 9420019451388, 9420019451494, 9420019451326, 9420019451487, 9420019457274, 9420019451296, 9420019451470, 9420019451371, 9420019451463, 9420019457267, 9420019451289, 9420019451456, 9420019451364, 9420019451449, 9420019451319, 9420019451432, 9420019457236, 9420019451272, 9420019451425, 9420019451357, 9420019451418, 9420019451302, 9420019451401, 9420019451852, 9420019456581, 9420006800014, 9420019484126]
    for (let i = 0; i < test.length; i++) {
      console.log(test[i])
      let value = test[i].toString(), order = {
          [value]: 1
        }
      AsyncStorage.mergeItem('orders', JSON.stringify(order))
    } */

    Actions.listScene()
  }

  _renderCameraMarker () {
    // if (this.props.showMarker) {
    return (
      <View style={styles.rectangleContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{
            borderLeftColor: this.state.focusStatus ? this.state.rectangleGreenBorderColor : this.state.rectangleBlueBorderColor,
            borderTopColor: this.state.focusStatus ? this.state.rectangleGreenBorderColor : this.state.rectangleBlueBorderColor,
            borderBottomColor: 'transparent',
            borderRightColor: 'transparent',
            width: this.state.angleSize,
            height: this.state.angleSize,
            borderWidth: 8}} />
          <View style={{
            borderLeftColor: 'transparent',
            borderTopColor: this.state.focusStatus ? this.state.rectangleGreenBorderColor : this.state.rectangleBlueBorderColor,
            borderBottomColor: 'transparent',
            borderRightColor: this.state.focusStatus ? this.state.rectangleGreenBorderColor : this.state.rectangleBlueBorderColor,
            width: this.state.angleSize,
            height: this.state.angleSize,
            borderWidth: 8,
            marginLeft: this.state.widthBetweenAngles}} />
        </View>
        <View style={styles.linered} />
        <View style={{height: this.state.heightBetweenAngles}} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{
            borderLeftColor: this.state.focusStatus ? this.state.rectangleGreenBorderColor : this.state.rectangleBlueBorderColor,
            borderTopColor: 'transparent',
            borderBottomColor: this.state.focusStatus ? this.state.rectangleGreenBorderColor : this.state.rectangleBlueBorderColor,
            borderRightColor: 'transparent',
            width: this.state.angleSize,
            height: this.state.angleSize,
            borderWidth: 8}} />
          <View style={{
            borderLeftColor: 'transparent',
            borderTopColor: 'transparent',
            borderBottomColor: this.state.focusStatus ? this.state.rectangleGreenBorderColor : this.state.rectangleBlueBorderColor,
            borderRightColor: this.state.focusStatus ? this.state.rectangleGreenBorderColor : this.state.rectangleBlueBorderColor,
            width: this.state.angleSize,
            height: this.state.angleSize,
            borderWidth: 8,
            marginLeft: this.state.widthBetweenAngles}} />
        </View>
      </View>
    )
    // <View style={{
    //   height: this.state.rectangleHeight,
    //   width: this.state.rectangleWidth,
    //   borderWidth: 6,
    //   borderColor: this.state.focusStatus ? this.state.rectangleGreenBorderColor : this.state.rectangleBlueBorderColor,
    //   backgroundColor: 'transparent'}} />

    // } <View style={this.state.focusStatus ? styles.rectanglegreen : styles.rectanglered} />
    // return null;
  }

  returnToProductList() {
    // console.log(this.refs) {camera: this.refs.camera}
    Actions.listScene()
  }

  render () {
    return (
      <View style={{height: this.state.screenHeight, backgroundColor: 'black'}} onLayout={this.getNewDimensions.bind(this)}>
        <View style={styles.mainContainer}>
          {this._renderCamera()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'space-between',
    alignItems: 'center'
  },
  preview: {
    flex: 1,
    // justifyContent: 'flex-end',
  },
  infoView: {
    // flex: 1,
    // height: 50
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  returnMessage: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    textAlign: 'center',
    color: 'white'
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  linered: {
    position: 'absolute',
    height: 1,
    width: 200,
    borderWidth: 6,
    borderColor: '#FF0000',
    backgroundColor: 'transparent'
  },
  /* rectanglered: {
    height: Dimensions.get('window').height / 2.5,
    width: Dimensions.get('window').width / 1.4,
    borderWidth: 4,
    borderColor: '#FF0000',
    backgroundColor: 'transparent'
  },
  rectanglegreen: {
    height: 250,
    width: 250,
    borderWidth: 4,
    borderColor: '#00FF00',
    backgroundColor: 'transparent'
  }, */
  outercirclered: {
    marginBottom: 5,
    borderRadius: 100 / 2,
    width: 90,
    height: 90,
    margin: 5,
    borderWidth: 3,
    // borderColor: '#FF0000',
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent'
  },
  transparentcircle: {
    marginBottom: 60,
    borderRadius: 100 / 2,
    width: 80,
    height: 80,
    margin: 2,
    backgroundColor: 'transparent'
  },
  circlered: {
    borderRadius: 100 / 2,
    width: 80,
    height: 80,
    marginBottom: 60,
    // backgroundColor: '#FF0000'
    backgroundColor: '#FFFFFF'
  },
  outercirclegreen: {
    marginBottom: 5,
    borderRadius: 100 / 2,
    width: 90,
    height: 90,
    margin: 5,
    borderWidth: 3,
    borderColor: '#00FF00',
    backgroundColor: 'transparent'
  },
  circlegreen: {
    marginBottom: 60,
    width: 80,
    height: 80,
    borderRadius: 100 / 2,
    backgroundColor: '#00FF00'
  }

})

const mapStateToProps = state => {
  // console.log(state)
  return {
    cart: state.cart,
    conn: state.conn
  }
}

export default connect(mapStateToProps, {addNewProduct, checkIfLoggedOn})(ScanScene)
