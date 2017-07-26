import React, {Component} from 'react'
import {WebView, Text, View, TouchableOpacity, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Spinner, Icon} from 'native-base'
import {connect} from 'react-redux'

import Spinnerb from '../loaders/Spinnerb'
import { ADDRESS } from '../../actions/configuration'

const WEBVIEW_REF = 'WEBVIEW_REF'

class SignUpScene extends Component {

  constructor(props) {
    super(props)
    this.state = { canGoBack: false }
  }

  renderLoading() {
    return <Spinnerb />
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
    Actions.loginScene()
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
          // source={{uri: ADDRESS}}
          source={{uri: 'http://www.anzor.co.nz/request_web_login'}}
          renderLoading={this.renderLoading}
          // onShouldStartLoadWithRequest={this.openExternalLink}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          startInLoadingState

          // userAgent='Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543a Safari/419.3'
          // javaScriptEnabled
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
  return {loading: true}
}

export default connect(mapStateToProps, {})(SignUpScene)
