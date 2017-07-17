import React from 'react'
import { TouchableOpacity, Text, View, Modal } from 'react-native'
import { Card, Right, Left } from 'native-base'

const ConfirmModalScene = ({ children, visible, onAccept, onDecline }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={() => {}}>
      <View style={styles.continerStyle}>
        <View style={styles.cardSectionStyle}>
          <Text style={styles.textStyle}>{children}</Text>
        </View>
        <View style={styles.cardSectionStyle}>
          <TouchableOpacity style={{marginLeft: 20, backgroundColor: '#0083a9', width: 50, height: 30}} onPress={onAccept}><Text style={{justifyContent: 'center', color: 'white', textAlign: 'center'}}>Yes</Text></TouchableOpacity>
          <TouchableOpacity style={{marginLeft: 80, backgroundColor: '#0083a9', width: 50, height: 30}} onPress={onDecline}><Text style={{justifyContent: 'center', color: 'white', textAlign: 'center'}}>No</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = {
  cardSectionStyle: {
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  textStyle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 40
  },
  continerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'relative',
    flex: 1,
    justifyContent: 'center'
  }
}

export { ConfirmModalScene }
