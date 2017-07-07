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
import {Actions} from 'react-native-router-flux'
import {Button} from 'native-base'
import Camera from 'react-native-camera'
export default class ScanScene extends Component {
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
      rectangleBlueBorderColor: '#337ab7',
      rectangleGreenBorderColor: '#00FF00',
      heightBetweenAngles: Dimensions.get('window').height / 4.5,
      widthBetweenAngles: Dimensions.get('window').width / 2.5,
      angleSize: Dimensions.get('window').height / 10
    }

    this._handleBarCodeRead = this._handleBarCodeRead.bind(this)
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
          <Button onPress={Actions.listScene} style={{backgroundColor: '#337ab7', width: this.state.buttonWidth}}>
            <Text style={styles.returnMessage}>RETURN TO PRODUCT LIST</Text>
          </Button>
        </View>
      </Camera>
    )
  }

  async _onPressCode (e) {
    // AsyncStorage.clear()
    await AsyncStorage.getItem('orders').then(stores => {
      // console.log(stores)
      if (this.state.barCodeScannedValue !== false) {
        if (stores != null) {
          let ordersAux = JSON.parse(stores)
          if (ordersAux[this.state.barCodeScannedValue] !== undefined) {
            // console.log(ordersAux[this.state.barCodeScannedValue])
            // console.log(ordersAux[this.state.barCodeScannedValue]['qty'])
            let value = this.state.barCodeScannedValue.toString(), order = {
                [value]: ordersAux[this.state.barCodeScannedValue] + 1
              }
            AsyncStorage.mergeItem('orders', JSON.stringify(order))
          } else {
            let value = this.state.barCodeScannedValue.toString(), order = {
                [value]: 1
              }
            AsyncStorage.mergeItem('orders', JSON.stringify(order))
          }
        } else {
          let value = this.state.barCodeScannedValue.toString(), order = {
              [value]: 1
            }
          AsyncStorage.setItem('orders', JSON.stringify(order))
        }
      } else {
        console.log('Select a bar code please!')
      }
    })

    this._setFocusStatus(false)
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
