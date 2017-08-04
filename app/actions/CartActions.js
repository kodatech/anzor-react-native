import { AsyncStorage } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { URI } from './configuration'
import {
  QTY_CHANGED_SUCCESS,
  QTY_CHANGED_FAIL,
  GET_CART_LIST,
  CART_LIST_SUCCESS,
  CLEAR_LIST,
  CART_LIST_FAIL,
  DELETE_PRODUCT,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  CHECK_OUT,
  CHECK_OUT_SUCCESS,
  CHECK_OUT_FAIL,
  CHANGE_VIEW_CART_STATUS,
  ADD_NEW_PRODUCT,
  STORE_PRODUCT_SUCCESS,
  STORE_PRODUCT_FAIL,
  CART_NO_CONNECTED,
  LOGGED_ON_FAIL,
  GET_PRODUCT_FOR_QTY,
  QTY_CHANGED_FROM_PRODUCT
} from './types'

export const clearList = () => {
  AsyncStorage.removeItem('orders')
  return ({
    type: CLEAR_LIST,
    loading: true,
    payload: [],
    error: '',
    message: '',
    arrow: '',
    upToCart: false,
    totalOrder: 0
  })
}

export const qtyChangeFromProduct = (text) => {
  return (dispatch, getState) => {
    let state = getState()
    // console.log(state)
    let product = state.cart.product[0]
    product.quantity = text
    product.totalline = parseFloat(parseFloat(product.sell_price_1) * parseInt(text)).toFixed(4)
    return ({
      type: QTY_CHANGED_FROM_PRODUCT,
      payload: product
    })
  }
}

export const qtyChanged = (text, id) => {
  return async (dispatch, getState) => {
    let state = getState()
    // console.log(state.auth.uid)
    if (text.trim() === '') {
      return ({
        type: QTY_CHANGED_FAIL,
        payload: 1,
        error: 'Please, enter quantity'
      })
    }
    AsyncStorage.getItem('orders').then(storedList => {
      let obj = JSON.parse(storedList)
      let value = id.toString(), order = {
          [value]: {'quantity': parseInt(text),
            'totalline': parseFloat(parseFloat((obj[id].totalline) / parseInt(obj[id].quantity)) * parseInt(text)).toFixed(4)}
        }
      AsyncStorage.mergeItem('orders', JSON.stringify(order))
      .then(() => {
        dispatch({
          type: QTY_CHANGED_SUCCESS,
          payload: text,
          error: ''
        })
        AsyncStorage.getItem('orders')
        .then(newList => {
          getProductsFromStorage(dispatch, newList, state)
        })
      })

    })

  }
}

export const getCartList = () => {
  return (dispatch, getState) => {
    dispatch({type: GET_CART_LIST})
    let state = getState()
    AsyncStorage.getItem('orders').then(storedList => {
      getProductsFromStorage(dispatch, storedList, state)
    })
  }
}

export const deleteProduct = (id) => {
  return async (dispatch, getState) => {
    dispatch({type: DELETE_PRODUCT})
    let state = getState()
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
          upToCart: false
        })
      }
      AsyncStorage.removeItem('orders')
      AsyncStorage.setItem('orders')
      const products = []
      let totalOrder = 0
      for (let key in obj) {
        if (obj[key]) {
          let url = `${URI}product?barCode=${key}&uid=${state.auth.uid}`
          fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
              if (typeof (responseJson) === 'object') {
                if (id !== key) {
                  let value = key.toString(), order = {
                      [value]: obj[key]
                    }
                  AsyncStorage.mergeItem('orders', JSON.stringify(order))
                  products.push({
                    description: responseJson[0].description,
                    stockcode: responseJson[0].stockcode,
                    price: parseFloat(responseJson[0].sell_price_1).toFixed(4),
                    code: key,
                    value: obj[key].quantity,
                    // total: parseFloat(obj[key] * responseJson[0].sell_price_1).toFixed(3)
                    total: obj[key].totalline
                  })
                  totalOrder = parseFloat(parseFloat(totalOrder) + parseFloat(obj[key].totalline)).toFixed(2)
                  if (Object.keys(obj).length === (products.length + 1)) {
                    products.sort(function (a, b) {
                      if (a.description > b.description) {
                        return 1
                      }
                      if (a.description < b.description) {
                        return -1
                      }
                      // a must be equal to b
                      return 0
                    })
                    dispatch({
                      type: DELETE_PRODUCT_SUCCESS,
                      payload: products,
                      totalOrder: totalOrder,
                      loading: true,
                      upToCart: true
                    })
                  }
                }
              } else {
                console.log('1', key)
                delete obj[key]
              }
            })
            .catch((error) => {
              if (error) {
                console.log('2', key)
                delete obj[key]
              }
            })
        }
      }
    })
  }
}

export const checkOut = () => {
  return async (dispatch, getState) => {
    dispatch({type: CHECK_OUT})
    AsyncStorage.getItem('user').then(user => {
      // console.log(user)
      if (user) {
        AsyncStorage.getItem('email').then(email => {
          AsyncStorage.getItem('pass').then(pass => {
            // loginUser(email, pass)
            email = email.substr(1)
            email = email.substr(0, email.length - 1)
            pass = pass.substr(1)
            pass = pass.substr(0, pass.length - 1)

            let Crypto = require('crypto-js')

            // let data = '12345678'
            let key = '59b6ab46d379b89d794c87b74a511fbd59b6ab46d379b89d794c87b74a511fbd'
            let iv = '0aaff094b6dc29742cc98a4bac8bc8f9'
            pass = Crypto.AES.encrypt(Crypto.enc.Utf8.parse(pass), Crypto.enc.Hex.parse(key), { iv: Crypto.enc.Hex.parse(iv) })

            let url = `${URI}login?name=${email}&pass=${pass}`
            // console.log(url)
            fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
              // console.log('RJ 2', responseJson)
              if (responseJson) {
                // console.log(responseJson)
                let state = getState()
                let list = state.cart.list
                // console.log(list)
                let url = URI + 'checkout?'
                // console.log(list)
                for (let key in list) {
                  if (key) {
                    // console.log(key)
                    // console.log(list[key].value)
                    let skuQty = [list[key].value]
                    let sky = [list[key].stockcode]
                    // console.log(skuQty)
                    // console.log(sky)
                    url += `skuQty[${key}]=${skuQty[0]}&sku[${key}]=${list[key].stockcode}&`
                  }
                }
                url += `uid=${state.auth.uid}`
                // console.log(url)
                // http://anzorapp.stage.kodait.com/anzor_services/checkout?skuQty[0]=5&sku[0]=WUI12SX&skuQty[1]=3&sku[1]=WFI4103216&skuQty[2]=1&sku[2]=RVTAS4-10&skuQty[3]=1000&sku[3]=RVTAS4-03B&skuQty[4]=1&sku[4]=RVTSTST4-03&skuQty[5]=1&sku[5]=WCG408&skuQty[6]=1&sku[6]=WCGB408&skuQty[7]=1&sku[7]=EFSSDHWFGG08012&skuQty[8]=1&sku[8]=NTHM410&skuQty[9]=2&sku[9]=SDM416&skuQty[10]=1&sku[10]=RCIM028&skuQty[11]=1&sku[11]=WTIM404&skuQty[12]=2&sku[12]=SMCKM404012H&skuQty[13]=1&sku[13]=SMPM404012H&skuQty[14]=1&sku[14]=WFM4041210&skuQty[15]=1&sku[15]=SSHBM404016&skuQty[16]=1&sku[16]=SMCKM404020H&skuQty[17]=1&sku[17]=SMPM404020H&skuQty[18]=1&sku[18]=SMPM404025Z&skuQty[19]=1&sku[19]=SMCKM404040H&skuQty[20]=1&sku[20]=SMPM404006H&skuQty[21]=2&sku[21]=WFM4040909&skuQty[22]=1&sku[22]=SMCKM405012H&skuQty[23]=1&sku[23]=SSHBM405016&skuQty[24]=1&sku[24]=SSHCM405016&skuQty[25]=1&sku[25]=SMPM405016H&skuQty[26]=1&sku[26]=SMCKM405020H&skuQty[27]=2&sku[27]=WTEM406&skuQty[28]=1&sku[28]=NTHM406&skuQty[29]=1&sku[29]=NTBPM406K&skuQty[30]=1&sku[30]=SSHBM406012&skuQty[31]=1&sku[31]=WFM4061216&skuQty[32]=1&sku[32]=SSHBM406016&skuQty[33]=1&sku[33]=SSHCKM406020&skuQty[34]=2&sku[34]=SSHCKM406025&skuQty[35]=2&sku[35]=SSHBM406030&skuQty[36]=1&sku[36]=SSHCKM406035&skuQty[37]=2&sku[37]=BJCM406035&skuQty[38]=1&sku[38]=SSHBM606035&skuQty[39]=1&sku[39]=SSHCKM406060&skuQty[40]=1&sku[40]=SSHCKM606070&skuQty[41]=1&sku[41]=SSHCKM606090&skuQty[42]=2&sku[42]=NSSHRM08&skuQty[43]=1&sku[43]=NTHM408&skuQty[44]=1&sku[44]=SSHBM408012&skuQty[45]=1&sku[45]=WFM4081612&skuQty[46]=3&sku[46]=SSHBM408020&skuQty[47]=50&sku[47]=SSHBM408040&skuQty[48]=1&sku[48]=SSHBM408060&skuQty[49]=1&sku[49]=BHM408070&uid=7067
                // http://anzorbeta.dev.kodait.com/anzor_services/checkout?skuQty[0]=1&skuQty[1]=5&sku[0]=ZBBPFA&sku[1]=CHCL605&uid=1
                // fetch(URI + `checkout?skuQty[0]=${skuQty[0]}&sku[0]=${sku[0]}&uid=1`)
                fetch(url)
                  .then(response => response.json())
                  .then((responseJson) => {
                    if (responseJson) {
                      // console.log(responseJson)
                      AsyncStorage.removeItem('orders')
                      dispatch({
                        type: CHECK_OUT_SUCCESS,
                        payload: [],
                        totalOrder: 0
                      })
                    }
                  })
                  .catch((error) => {
                    console.log('error', error)
                    dispatch({
                      type: CHECK_OUT_FAIL,
                      error: error
                    })
                  })
              } else {
                dispatch({
                  type: LOGGED_ON_FAIL,
                })
                Actions.loginScene()
              }
            })
          })
        })
      }
    })
  }
}

export const changeViewCartStatus = () => {
  return ({
    type: CHANGE_VIEW_CART_STATUS,
    payload: false
  })
}

const storeScannedProducts = (barCodeScannedValue, stores, responseJson) => {
  if (barCodeScannedValue !== false) {
    // Stored orders exists
    if (stores != null) {
      let ordersAux = JSON.parse(stores)
      // barcode is already stored. Need to add quantity
      if (ordersAux[barCodeScannedValue] !== undefined) {
        let value = barCodeScannedValue.toString(), order = {
            [value]: {'quantity': parseInt(responseJson[0].quantity) + parseInt(ordersAux[barCodeScannedValue].quantity),
              'totalline': parseFloat(parseFloat(responseJson[0].totalline) + parseFloat(ordersAux[barCodeScannedValue].totalline)).toFixed(4)}
          }
        AsyncStorage.mergeItem('orders', JSON.stringify(order))
      } else {
        let value = barCodeScannedValue.toString(), order = {
            [value]: {'quantity': responseJson[0].quantity,
              'totalline': responseJson[0].totalline,
              'description': responseJson[0].description,
              'stockcode': responseJson[0].stockcode,
              'code': responseJson[0].barcode,
              'price': responseJson[0].sell_price_1}
          }
        AsyncStorage.mergeItem('orders', JSON.stringify(order))
      }
    } else {
      // First product stored in order
      let value = barCodeScannedValue.toString(), order = {
          [value]: {'quantity': responseJson[0].quantity,
            'totalline': responseJson[0].totalline,
            'description': responseJson[0].description,
            'stockcode': responseJson[0].stockcode,
            'code': responseJson[0].barcode,
            'price': responseJson[0].sell_price_1
          }
        }
      AsyncStorage.setItem('orders', JSON.stringify(order))
    }
  } else {
    console.log('Select a bar code please!')
  }
}

const getProductsFromStorage = (dispatch, storedList, state) => {
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
    if (obj[key]) {
      products.push({
        description: obj[key].description,
        stockcode: obj[key].stockcode,
        price: parseFloat(obj[key].price).toFixed(4),
        code: key,
        value: obj[key].quantity,
        total: obj[key].totalline
      })
      totalOrder = parseFloat(parseFloat(totalOrder) + parseFloat(obj[key].totalline)).toFixed(2)
      if (Object.keys(obj).length === products.length) {
        products.sort(function (a, b) {
          if (a.description > b.description) {
            return 1
          }
          if (a.description < b.description) {
            return -1
          }
          // a must be equal to b
          return 0
        })
        dispatch({
          type: CART_LIST_SUCCESS,
          payload: products,
          totalOrder: totalOrder,
          loading: false,
          upToCart: true
        })
      }
    } else {
      console.log('1', key)
      delete obj[key]
    }
  }
}

export const addQtyNewProduct = (barCodeScannedValue) => {
  return async (dispatch, getState) => {
    dispatch({type: ADD_NEW_PRODUCT})
    let state = getState()
    let url = `${URI}product?barCode=${barCodeScannedValue}&uid=${state.auth.uid}`
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        if (typeof (responseJson) === 'object') {
          if (responseJson[0].quantity > 1) {
            responseJson[0].isKanban = true
          } else {
            responseJson[0].isKanban = false
          }
          // console.log(responseJson[0])
          dispatch({
            type: GET_PRODUCT_FOR_QTY,
            payload: responseJson,
          })
        } else {
          dispatch({
            type: STORE_PRODUCT_FAIL
          })
        }
      })
      .catch((error) => {
        console.log(error)
        dispatch({
          type: STORE_PRODUCT_FAIL
        })
      })
  }
}

export const addNewProduct = () => {
  return async (dispatch, getState) => {
    let state = getState()
    // console.log(state)
    dispatch({type: ADD_NEW_PRODUCT})
    barCodeScannedValue = state.cart.product[0].barcode
    let responseJson = state.cart.product
    if (typeof (responseJson) === 'object' && responseJson[0].quantity) {
      dispatch({
        type: GET_PRODUCT_FOR_QTY,
        payload: responseJson,
      })
      AsyncStorage.getItem('orders').then(stores => {
        storeScannedProducts(barCodeScannedValue, stores, responseJson)
      })
      .then(() => {
        AsyncStorage.getItem('orders').then(async (storedList) => {
          getProductsFromStorage(dispatch, storedList, state)
          Actions.listScene()
        })
      })
    } else {
      dispatch({
        type: STORE_PRODUCT_FAIL
      })
    }
  }
}
