import { AsyncStorage } from 'react-native'

import {
  QTY_CHANGED,
  CART_LIST_SUCCESS,
  CLEAR_LIST
} from './types'

export const clearList = () => {
  AsyncStorage.clear()
  return ({
    type: CLEAR_LIST,
    loading: true,
    payload: []
  })
}

export const qtyChanged = (text, id) => {
  return async (dispatch) => {
    AsyncStorage.getItem('orders').then(storedList => {
      let value = id.toString(), order = {
          [value]: parseInt(text)
        }
      AsyncStorage.mergeItem('orders', JSON.stringify(order)).then(() => {
        dispatch({
          type: QTY_CHANGED,
          payload: text
        })
      })
    })
  }
}

export const getStoredProducts = () => {
  return (dispatch) => {
    AsyncStorage.getItem('orders').then((storedList) => {
      dispatch({
        type: CART_LIST_SUCCESS,
        payload: JSON.parse(storedList)
      })
    })
  }
}

// export const getCartList = () => {
//   return (dispatch) => {
//     dispatch({
//       type: CART_LIST_SUCCESS,
//       payload: [{
//         description: 'responseJson[0].description',
//         stockcode: 'responseJson[0].stockcode',
//         price: 'responseJson[0].sell_price_1',
//         code: 'key',
//         value: 'obj[key]',
//         total: 'parseFloat(obj[key] * responseJson[0].sell_price_1).toFixed(2)}'
//       }]
//     })
//   }
// }

export const getCartList = () => {
  return async (dispatch) => {
    AsyncStorage.getItem('orders').then(async (storedList) => {
      let obj = JSON.parse(storedList)
      const products = []
      for (let key in obj) {
        let url = `http://anzornz.kodait.com/anzor_services/product?barCode=${key}&uid=1`
        fetch(url)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson[0])
            products.push({
              description: responseJson[0].description,
              stockcode: responseJson[0].stockcode,
              price: responseJson[0].sell_price_1,
              code: key,
              value: obj[key],
              total: parseFloat(obj[key] * responseJson[0].sell_price_1).toFixed(2)
            })
            if (Object.keys(obj).length === products.length) {
              dispatch({
                type: CART_LIST_SUCCESS,
                payload: products
              })
            }
          })
          .catch((error) => {
            console.error(error + ' IN FETCH CATCH')
          })
      }
      // console.log(Object.keys(obj).length)
      // console.log(products.length)
    })
  }
}
