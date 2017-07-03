import React, { Component } from 'react'
import { WebView } from 'react-native'
import { Spinner } from 'native-base'
import {connect} from 'react-redux'

import {loadHome} from '../../actions'
class HomeScene extends Component {

  renderLoading() {
    return <Spinner style={{height: 400}} />
  }

  render () {
    // console.log(this.props)
    // console.log(this.props.loading)
    // if (this.props.loading) {
    //   return <Spinner style={{height: 400}} />
    // }
    return (
      <WebView
        source={{uri: 'http://www.anzor.co.nz/'}}
        renderLoading={this.renderLoading}
        startInLoadingState
      />
    )
  }
}

const mapStateToProps = state => {
  // console.log(state)
  return {loading: true}
}

export default connect(mapStateToProps, {loadHome})(HomeScene)
