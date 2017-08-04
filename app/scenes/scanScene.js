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
import {addQtyNewProduct, checkIfLoggedOn} from '../actions'
import {Actions} from 'react-native-router-flux'
import {Button} from 'native-base'
import Camera from 'react-native-camera'
// import SpinnerCamera from './loaders/SpinnerCamera'


const timer = require('react-native-timer')

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
      linered: '#FF0000',
      linegreen: '#00FF00',
      heightBetweenAngles: Dimensions.get('window').height / 4.5,
      widthBetweenAngles: Dimensions.get('window').width / 2.5,
      angleSize: Dimensions.get('window').height / 15,
      testloading: true
    }

    // this._handleBarCodeRead = this._handleBarCodeRead.bind(this)
  }

  componentDidMount () {
    this.props.checkIfLoggedOn('scanScene')
    // setTimeout(() => {
    //   this.setState({
    //     testloading: false
    //   })
    // }, 1000)
  }

  componentWillUnmount () {
    // this._handleBarCodeReadWithButton.bind(this)
    timer.clearTimeout(this)
  }

  _setBarCodeScanned (e) {
    this.setState({
      barCodeScannedValue: e.data,
      barCodeScannedType: e.type,
    })
    // this.setState({ barCodeScannedType: e.type })
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
      angleSize: Dimensions.get('window').height / 15
    })
    // console.log(Dimensions.get('window').height / 10)
  }

  async _handleBarCodeReadWithButton (e) {
    /* DO NOT DELETE THIS BELOW */
    /* await this.refs.camera.capture().then((obj) => {
      console.log(obj.path)
    }) */
    // console.log(this.refs)
    // let clearId = setTimeout(() => {
    //   this._reset()
    // }, 5000)
    Vibration.vibrate()
    this.setState({ focusStatus: true }, () => timer.setTimeout(
      this, '_reset', () => this.setState({
        focusStatus: false,
        barCodeScannedValue: null,
        barCodeScannedType: null
      }), 3000
    ))
    this._setScanning(true)
    this._setBarCodeScanned(e)
  }

  _reset () {
    this.setState({
      barCodeScannedValue: null,
      barCodeScannedType: null,
    })
  }

  // _handleBarCodeRead (e) {
  //   if (!this.state.scanning) {
  //     Vibration.vibrate()
  //     this._setFocusStatus(true)
  //     this._setScanning(true)
  //   }
  // }

  _setFocusStatus (value) {
    this.setState({ focusStatus: value })
  }

  _renderCamera () {
    return (
      <Camera style={styles.preview} onBarCodeRead={this._handleBarCodeReadWithButton.bind(this)} captureAudio={false} ref='camera'>
        {this._renderCameraMarker()}
        <View style={{paddingBottom: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor: 'transparent', marginBottom: 20}}>
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

  _onPressCode (e) {
    if (this.state.barCodeScannedValue) {
      this.props.addQtyNewProduct(this.state.barCodeScannedValue)
      this._setFocusStatus(false)
      this._reset()
      Actions.qtyScene()
    } else {
      this.props.addQtyNewProduct('')
      this._setFocusStatus(false)
      Actions.listScene()
    }
  }

  _renderCameraMarker () {
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
            borderWidth: 2}} />
          <View style={{
            borderLeftColor: 'transparent',
            borderTopColor: this.state.focusStatus ? this.state.rectangleGreenBorderColor : this.state.rectangleBlueBorderColor,
            borderBottomColor: 'transparent',
            borderRightColor: this.state.focusStatus ? this.state.rectangleGreenBorderColor : this.state.rectangleBlueBorderColor,
            width: this.state.angleSize,
            height: this.state.angleSize,
            borderWidth: 2,
            marginLeft: this.state.widthBetweenAngles}} />
        </View>
        <View style={{
          position: 'absolute',
          height: 1,
          width: 200,
          borderWidth: 1,
          borderColor: this.state.focusStatus ? this.state.linegreen : this.state.linered,
          backgroundColor: 'transparent'}} />
        <View style={{height: this.state.heightBetweenAngles}} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{
            borderLeftColor: this.state.focusStatus ? this.state.rectangleGreenBorderColor : this.state.rectangleBlueBorderColor,
            borderTopColor: 'transparent',
            borderBottomColor: this.state.focusStatus ? this.state.rectangleGreenBorderColor : this.state.rectangleBlueBorderColor,
            borderRightColor: 'transparent',
            width: this.state.angleSize,
            height: this.state.angleSize,
            borderWidth: 2}} />
          <View style={{
            borderLeftColor: 'transparent',
            borderTopColor: 'transparent',
            borderBottomColor: this.state.focusStatus ? this.state.rectangleGreenBorderColor : this.state.rectangleBlueBorderColor,
            borderRightColor: this.state.focusStatus ? this.state.rectangleGreenBorderColor : this.state.rectangleBlueBorderColor,
            width: this.state.angleSize,
            height: this.state.angleSize,
            borderWidth: 2,
            marginLeft: this.state.widthBetweenAngles}} />
        </View>
      </View>
    )
  }

  render () {
    // if (this.state.testloading) {
    //   return (
    //     <SpinnerCamera />
    //   )
    // }
    return (
      <View style={{height: this.state.screenHeight, backgroundColor: 'transparent'}} onLayout={this.getNewDimensions.bind(this)}>
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
    alignItems: 'center'
  },
  preview: {
    flex: 1,
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
    borderWidth: 1,
    borderColor: '#FF0000',
    backgroundColor: 'transparent'
  },
  linegreen: {
    position: 'absolute',
    height: 1,
    width: 200,
    borderWidth: 1,
    borderColor: '#00FF00',
    backgroundColor: 'transparent'
  },
  outercirclered: {
    marginBottom: 5,
    borderRadius: 100 / 2,
    width: 90,
    height: 90,
    margin: 5,
    borderWidth: 3,
    // borderColor: '#FF0000',
    // borderColor: '#FFFFFF',
    borderColor: '#0083a9',
    backgroundColor: 'black'
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
    // backgroundColor: '#FFFFFF'
    backgroundColor: '#0083a9'
  },
  outercirclegreen: {
    marginBottom: 5,
    borderRadius: 100 / 2,
    width: 90,
    height: 90,
    margin: 5,
    borderWidth: 3,
    borderColor: '#00FF00',
    // backgroundColor: 'transparent'
    backgroundColor: 'black'
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

export default connect(mapStateToProps, {addQtyNewProduct, checkIfLoggedOn})(ScanScene)
