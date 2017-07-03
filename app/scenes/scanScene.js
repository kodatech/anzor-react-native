import React, { Component } from 'react'
import {
  StyleSheet,
  Vibration,
  TouchableOpacity,
  View,
  Text,
  AsyncStorage
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Button} from 'native-base'
import Camera from 'react-native-camera'
export default class ScanScene extends Component {
  constructor (props) {
    super(props)
    // console.log(props.stores.history)
    this.state = {
      scanning: false,
      barCodeScannedValue: false,
      barCodeScannedType: false,
      focusStatus: false
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
        <View style={this.state.focusStatus ? styles.outercirclegreen : styles.outercirclered}>
          <View style={styles.transparentcircle}>
            <TouchableOpacity style={this.state.focusStatus ? styles.circlegreen : styles.circlered} onPress={this._onPressCode.bind(this)} />
          </View>
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
        <View style={styles.linered} />
        <View style={this.state.focusStatus ? styles.rectanglegreen : styles.rectanglered} />
      </View>
    )
    // }
    // return null;
  }

  returnToProductList() {
    // console.log(this.refs) {camera: this.refs.camera}
    Actions.listScene()
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        {this._renderCamera()}
        <Button onPress={Actions.listScene} style={{backgroundColor: 'transparent'}}>
          <Text style={styles.returnMessage}>Return to product List</Text>
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  infoView: {
    flex: 1,
    height: 50
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
    justifyContent: 'center',
    textAlign: 'center'
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
    width: 250,
    borderWidth: 2,
    borderColor: '#FF0000',
    backgroundColor: 'transparent'
  },
  rectanglered: {
    height: 250,
    width: 250,
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
  },
  outercirclered: {
    marginBottom: 60,
    borderRadius: 100 / 2,
    width: 90,
    height: 90,
    margin: 5,
    borderWidth: 3,
    borderColor: '#FF0000',
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
    backgroundColor: '#FF0000'
  },
  outercirclegreen: {
    marginBottom: 60,
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
