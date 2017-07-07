import React, { Component } from 'react'
import { WebView } from 'react-native'
import { Spinner } from 'native-base'
import {connect} from 'react-redux'


class CartScene extends Component {

  renderLoading() {
    return <Spinner color='#337ab7' style={{height: 400}} />
  }

  render () {
    // console.log(this.props)
    // console.log(this.props.loading)
    // if (this.props.loading) {
    //   return <Spinner style={{height: 400}} />
    // }
    return (
      <WebView
        source={{uri: 'http://www.anzor.co.nz/anzor_services/cart?uid=1'}}
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

export default connect(mapStateToProps, {})(CartScene)
