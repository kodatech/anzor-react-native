import React, { Component } from 'react'
import { WebView, Text, View, TouchableOpacity, StyleSheet, BackHandler } from 'react-native'
import {Actions} from 'react-native-router-flux'
import { Spinner, Icon } from 'native-base'
import {connect} from 'react-redux'
import {checkIfLoggedOn, changeViewCartStatus} from '../../actions'
import { URI } from '../../actions/configuration'
// console.log(URI)
import SpinnerList from '../loaders/SpinnerList'


const WEBVIEW_REF = 'WEBVIEW_REF'

class CartScene extends Component {

  constructor(props) {
    super(props)
    this.state = { canGoBack: false }
    BackHandler.addEventListener('hardwareBackPress', function() {
     // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
     // Typically you would use the navigator here to go to the last state.
      // BackHandler.exitApp()
      // if (!this.onMainScreen()) {
      //   this.goBack()
      //   return true
      // }
      return true
    })
  }

  componentWillMount() {
    this.props.checkIfLoggedOn('cartScene')
    this.props.changeViewCartStatus()
  }

  renderLoading() {
    // return <Spinner color='#0083a9' style={{height: 400}} />
    return <SpinnerList />
  }

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack
    })
  }

  onBack() {
    this.refs[WEBVIEW_REF].goBack()
  }

  onReturn() {
    Actions.listScene()
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.topbar}>
          <TouchableOpacity
            disabled={!this.state.canGoBack}
            onPress={this.onBack.bind(this)}
            >
            <Text style={this.state.canGoBack ? styles.topbarText : styles.topbarTextDisabled}>Go Back</Text>
          </TouchableOpacity>
        </View>
        <WebView
          ref={WEBVIEW_REF}
          style={{flex: 1}}
          source={{uri: `${URI}cart?uid=${this.props.auth.uid}`}}
          renderLoading={this.renderLoading}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          startInLoadingState
        />
        <View style={styles.bottombar}>
          <TouchableOpacity
            // disabled={!this.state.canGoBack}
            onPress={this.onReturn.bind(this)}
            >
            <View style={{flexDirection: 'row'}}>
              <Icon style={{fontSize: 30, paddingRight: 30, color: '#FFFFFF'}} name='md-barcode' />
              <Text style={{color: '#FFFFFF', textAlignVertical: 'center', fontSize: 20}}>Return to Scanner</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  topbar: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottombar: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0083a9'
  },
  topbarTextDisabled: {
    color: 'gray'
  }
})

const mapStateToProps = state => {
  // console.log(state)
  return {
    auth: state.auth,
    loading: true
  }
}

export default connect(mapStateToProps, {checkIfLoggedOn, changeViewCartStatus})(CartScene)
