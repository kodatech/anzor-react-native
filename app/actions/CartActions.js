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
  ADD_NEW_PRODUCT,
  STORE_PRODUCT_SUCCESS,
  STORE_PRODUCT_FAIL,
  CART_NO_CONNECTED,
  LOGGED_ON_FAIL
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
    let state = getState()
    // console.log(state.auth.uid)
    if (text.trim() === '') {
      return ({
        type: QTY_CHANGED_FAIL,
        payload: 0
      })
    }
    AsyncStorage.getItem('orders').then(storedList => {
      let obj = JSON.parse(storedList)
      // console.log(obj[id])
      let value = id.toString(), order = {
          // [value]: parseInt(text)
          [value]: {'quantity': parseInt(text),
            'totalline': parseFloat(parseFloat((obj[id].totalline) / parseInt(obj[id].quantity)) * parseInt(text)).toFixed(4)}
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
            if (obj[key]) {
              let url = `${URI}product?barCode=${key}&uid=${state.auth.uid}`
              fetch(url)
                .then((response) => response.json())
                .then((responseJson) => {
                  if (typeof (responseJson) === 'object') {
                    products.push({
                      description: responseJson[0].description,
                      stockcode: responseJson[0].stockcode,
                      price: parseFloat(responseJson[0].sell_price_1).toFixed(4),
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
                        type: QTY_CHANGED_SUCCESS,
                        payload: text,
                        list: products,
                        totalOrder: totalOrder
                      })
                    }
                  } else {
                    console.log('1', key)
                    delete obj[key]
                  }
                })
                .catch((error) => {
                  console.log('2', error)
                  delete obj[key]
                })
            }
          }
        })
      })

    })

  }
}

export const getCartList = () => {
  return async (dispatch, getState) => {
    dispatch({type: GET_CART_LIST})
    let state = getState()
    AsyncStorage.getItem('orders').then(async (storedList) => {
      let obj = JSON.parse(storedList)
      if (obj === null) {
        dispatch({
          type: CART_LIST_FAIL,
          payload: [],
          upToCart: false
        })
      }
      const products = []
      let totalOrder = 0

      for (let key in obj) {
        if (obj[key]) {
          // let url = `${URI}product?barCode=${key}&uid=${state.auth.uid}`
          // fetch(url)
          //   .then((response) => response.json())
          //   .then((responseJson) => {
              // if (typeof (responseJson) === 'object') {
              //   console.log('RS', responseJson)
          products.push({
            description: obj[key].description,
            stockcode: obj[key].stockcode,
            price: parseFloat(obj[key].price).toFixed(4),
            code: key,
            value: obj[key].quantity,
            // total: parseFloat(obj[key] * responseJson[0].sell_price_1).toFixed(3)
            total: obj[key].totalline
          })
          totalOrder = parseFloat(parseFloat(totalOrder) + parseFloat(obj[key].totalline)).toFixed(2)
          if (Object.keys(obj).length === products.length) {
            // console.log(obj)
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
            // })
            // .catch((error) => {
            //   // console.error(' IN FETCH CATCH CART_LIST_SUCCESS', error)
            //   console.log('2', error)
            //   delete obj[key]
            // })
        // }
      }
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
              // console.error(error + ' IN FETCH CATCH CART_LIST_SUCCESS')
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
            let url = `${URI}login?name=${email}&pass=${pass}`
            // console.log(url)
            fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
              // console.log('RJ 2', responseJson)
              if (responseJson) {
                let state = getState()
                let list = state.cart.list
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
                      type: CHECK_OUT_FAIL
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

const getProductsForStorage = (dispatch, storedList, state) => {
  // console.log(storedList)
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
      let url = `${URI}product?barCode=${key}&uid=${state.auth.uid}`
      fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
          if (typeof (responseJson) === 'object') {
            // console.log('RS', responseJson)
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
                type: STORE_PRODUCT_SUCCESS,
                payload: products,
                totalOrder: totalOrder,
                upToCart: true
              })
            }
          } else {
            console.log('1', key)
            delete obj[key]
          }
        })
        .catch((error) => {
          // console.error(' IN FETCH CATCH CART_LIST_SUCCESS', error)
          if (error) {
            console.log('2', key)
            delete obj[key]
          }
        })
    }
  }
}

export const addNewProduct = (barCodeScannedValue) => {
  return async (dispatch, getState) => {
    dispatch({type: ADD_NEW_PRODUCT})
    let state = getState()

    let url = `${URI}product?barCode=${barCodeScannedValue}&uid=${state.auth.uid}`
    // console.log(url)
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson)
        if (typeof (responseJson) === 'object') {
          AsyncStorage.getItem('orders').then(stores => {
            storeScannedProducts(barCodeScannedValue, stores, responseJson)
          })
          .then(() => {
            AsyncStorage.getItem('orders').then(async (storedList) => {
              getProductsForStorage(dispatch, storedList, state)
            })
          })
        } else {
          dispatch({
            type: STORE_PRODUCT_FAIL
          })
        }
      })
  }
}
