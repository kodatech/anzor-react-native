import React, { Component } from 'react'
import {
  StyleSheet,
  Dimensions,
  Vibration,
  TouchableOpacity,
  View,
  Text
} from 'react-native'
import Camera from 'react-native-camera'
export default class ScanScene extends Component {
  constructor (props) {
    super(props)
    console.log(props.stores.history)
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

  _handleBarCodeReadWithButton (e) {
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
      <Camera style={styles.preview} onBarCodeRead={this._handleBarCodeReadWithButton.bind(this)}>
        {this._renderCameraMarker()}
        <View style={this.state.focusStatus ? styles.outercirclegreen : styles.outercirclered}>
          <View style={styles.transparentcircle}>
            <TouchableOpacity style={this.state.focusStatus ? styles.circlegreen : styles.circlered} onPress={this._onPressCode.bind(this)} />
          </View>
        </View>
      </Camera>
    )
  }

  _onPressCode (e) {
    // this.props.onRead(e)
    console.log('Barcode Found! Type: ' + this.state.barCodeScannedType + '\nData: ' + this.state.barCodeScannedValue)
    this._setFocusStatus(false)
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

  render () {
    return (
      <View style={styles.mainContainer}>
        {this._renderCamera()}
        <View style={styles.infoView}>
          <Text style={styles.returnMessage}>Return to product List</Text>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
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
    alignItems: 'center',
    justifyContent: 'center'
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
