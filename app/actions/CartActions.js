import { AsyncStorage } from 'react-native'

import {
  QTY_CHANGED,
  CART_LIST_SUCCESS
} from './types'

export const qtyChanged = (text, id) => {
  return async (dispatch) => {
    AsyncStorage.getItem('orders').then(storedList => {
      let value = id.toString(), order = {
          [value]: parseInt(text)
        }
      AsyncStorage.mergeItem('orders', JSON.stringify(order))
      dispatch({
        type: QTY_CHANGED,
        payload: text
      })
    })
  }
}

export const getCartList = () => {
  return (dispatch) => {
    AsyncStorage.getItem('orders').then((storedList) => {
      let obj = JSON.parse(storedList)
      const products = []
      for (let key in obj) {
        products.push({
          code: key,
          value: obj[key]
        })
      }
      dispatch({
        type: CART_LIST_SUCCESS,
        payload: products})
    })
  }
}
