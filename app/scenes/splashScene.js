import React, { Component } from 'react'
import { Container, Content, Spinner } from 'native-base'
export default class SplashScene extends Component {
  render () {
    return (
      <Container>
        <Content>
          <Spinner color='blue' />
        </Content>
      </Container>
    )
  }
}
