import { AsyncStorage } from 'react-native'

import {
  QTY_CHANGED,
  QTY_CHANGED_FAIL,
  CART_LIST_SUCCESS,
  CLEAR_LIST,
  CART_LIST_FAIL
} from './types'

export const deleteListItem = (id) => {

}

export const clearList = () => {
  AsyncStorage.clear()
  return ({
    type: CLEAR_LIST,
    loading: true,
    payload: [],
    totalOrder: 0
  })
}

export const qtyChanged = (text, id) => {
  return async (dispatch) => {
    if (text.trim() === '') {
      return ({
        type: QTY_CHANGED_FAIL,
        payload: 0
      })
    }
    AsyncStorage.getItem('orders').then(storedList => {
      let value = id.toString(), order = {
          [value]: parseInt(text)
        }
      AsyncStorage.mergeItem('orders', JSON.stringify(order))
      .then(() => {
        AsyncStorage.getItem('orders')
        .then(newList => {
          let obj = JSON.parse(newList)
          if (obj === null) {
            dispatch({
              type: CART_LIST_FAIL,
              payload: []
            })
          }
          const products = []
          // console.log(obj)
          let totalOrder = 0
          for (let key in obj) {
            let url = `http://anzornz.kodait.com/anzor_services/product?barCode=${key}&uid=1`
            fetch(url)
              .then((response) => response.json())
              .then((responseJson) => {
                products.push({
                  description: responseJson[0].description,
                  stockcode: responseJson[0].stockcode,
                  price: parseFloat(responseJson[0].sell_price_1).toFixed(3),
                  code: key,
                  value: obj[key],
                  total: parseFloat(obj[key] * responseJson[0].sell_price_1).toFixed(3)
                })
                totalOrder = parseFloat(parseFloat(totalOrder) + parseFloat(obj[key] * responseJson[0].sell_price_1)).toFixed(3)
                // console.log(products)
                if (Object.keys(obj).length === products.length) {
                  dispatch({
                    type: QTY_CHANGED,
                    payload: text,
                    list: products,
                    loading: true,
                    totalOrder: totalOrder
                  })
                }
              })
              .catch((error) => {
                console.error(error + ' IN FETCH CATCH')
              })
          }
        })
      })

    })

  }
}

export const getCartList = () => {
  return async (dispatch) => {
    AsyncStorage.getItem('orders').then(async (storedList) => {
      let obj = JSON.parse(storedList)
      if (obj === null) {
        dispatch({
          type: CART_LIST_FAIL,
          payload: []
        })
      }
      const products = []
      let totalOrder = 0
      for (let key in obj) {
        let url = `http://anzornz.kodait.com/anzor_services/product?barCode=${key}&uid=1`
        fetch(url)
          .then((response) => response.json())
          .then((responseJson) => {
            // console.log(responseJson[0])
            products.push({
              description: responseJson[0].description,
              stockcode: responseJson[0].stockcode,
              price: parseFloat(responseJson[0].sell_price_1).toFixed(3),
              code: key,
              value: obj[key],
              total: parseFloat(obj[key] * responseJson[0].sell_price_1).toFixed(3)
            })
            totalOrder = parseFloat(parseFloat(totalOrder) + parseFloat(obj[key] * responseJson[0].sell_price_1)).toFixed(3)
            if (Object.keys(obj).length === products.length) {
              dispatch({
                type: CART_LIST_SUCCESS,
                payload: products,
                totalOrder: totalOrder,
                loading: true
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
