import React from 'react'
import { TouchableOpacity, Text, View, Modal, Dimensions } from 'react-native'
import { Card, Right, Left, Content, Icon } from 'native-base'

const NoConnectionModalScene = ({ children, visible }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={() => {}}>
      <View style={styles.continerStyle}>
        <View style={styles.cardSectionStyle}>
          <Icon style={styles.iconStyle} name='md-cloud-outline' />
          <Text style={styles.textStyle}>{children}</Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = {
  cardSectionStyle: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  textStyle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 40,
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  continerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    color: '#FFFFFF',
    fontSize: Dimensions.get('window').height / 6.5,
    // marginLeft: Dimensions.get('window').width / 10,
    marginTop: Dimensions.get('window').height / 6.5 - 20,
    textAlign: 'center'
  }
}

export { NoConnectionModalScene }
