import { AsyncStorage } from 'react-native'

import {
  QTY_CHANGED,
  QTY_CHANGED_FAIL,
  CART_LIST_SUCCESS,
  CLEAR_LIST,
  CART_LIST_FAIL,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  CART_NO_CONNECTED
} from './types'

export const clearList = () => {
  AsyncStorage.removeItem('orders')
  return ({
    type: CLEAR_LIST,
    loading: true,
    payload: [],
    totalOrder: 0
  })
}

export const qtyChanged = (text, id) => {
  return async (dispatch, getState) => {
    console.log('text', text)
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
                dispatch({
                  loading: false,
                  isConnected: false,
                  error: error
                })
                // console.error(error + ' IN FETCH CATCH QTY_CHANGED')
              })
              .then(() => {
                console.log('after catch')
              })
          }
        })
      })

    })

  }
}

export const getCartList = () => {
  return async (dispatch, getState) => {
    AsyncStorage.getItem('orders').then(async (storedList) => {
      let obj = JSON.parse(storedList)
      if (obj === null) {
        dispatch({
          type: CART_LIST_FAIL,
          payload: []
        })
      }
      let state = getState()
      console.log(state.connectionState)
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
            // console.error(' IN FETCH CATCH CART_LIST_SUCCESS', error)
            // if (error) {
            //   return ({isConnected: false})
            // }
            // dispatch({
            //   type: CART_NO_CONNECTED,
            //   isConnected: false
            // })
          })
      }
      // console.log(Object.keys(obj).length)
      // console.log(products.length)
    })
  }
}

export const deleteProduct = (id) => {
  return async (dispatch) => {
    AsyncStorage.getItem('orders').then(async (storedList) => {
      let obj = JSON.parse(storedList)
      if (obj === null) {
        dispatch({
          type: DELETE_PRODUCT_FAIL,
          payload: []
        })
      }
      if (Object.keys(obj).length === 1) {
        AsyncStorage.removeItem('orders')
        dispatch({
          type: DELETE_PRODUCT_SUCCESS,
          payload: [],
          totalOrder: 0,
          loading: true
        })
      }
      const products = []
      let totalOrder = 0
      AsyncStorage.removeItem('orders')
      AsyncStorage.setItem('orders')
      for (let key in obj) {
        let url = `http://anzornz.kodait.com/anzor_services/product?barCode=${key}&uid=1`
        fetch(url)
          .then((response) => response.json())
          .then((responseJson) => {
            if (id !== key) {
              let value = key.toString(), order = {
                  [value]: obj[key]
                }
              AsyncStorage.mergeItem('orders', JSON.stringify(order))
              products.push({
                description: responseJson[0].description,
                stockcode: responseJson[0].stockcode,
                price: parseFloat(responseJson[0].sell_price_1).toFixed(3),
                code: key,
                value: obj[key],
                total: parseFloat(obj[key] * responseJson[0].sell_price_1).toFixed(3)
              })
              totalOrder = parseFloat(parseFloat(totalOrder) + parseFloat(obj[key] * responseJson[0].sell_price_1)).toFixed(3)
              if (Object.keys(obj).length === (products.length + 1)) {
                dispatch({
                  type: DELETE_PRODUCT_SUCCESS,
                  payload: products,
                  totalOrder: totalOrder,
                  loading: true
                })
              }
            }
          })
          .catch((error) => {
            console.error(error + ' IN FETCH CATCH CART_LIST_SUCCESS')
            // dispatch({
            //   loading: false,
            //   isConnected: false,
            //   error: error
            // })
          })
      }
      // console.log(Object.keys(obj).length)
      // console.log(products.length)
    })
  }
}
