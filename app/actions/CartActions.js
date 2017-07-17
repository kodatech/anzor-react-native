import { AsyncStorage } from 'react-native'

import {
  QTY_CHANGED,
  QTY_CHANGED_FAIL,
  CART_LIST_SUCCESS,
  CLEAR_LIST,
  CART_LIST_FAIL,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  CHECK_OUT_SUCCESS,
  CHECK_OUT_FAIL,
  STORE_PRODUCT_SUCCESS,
  STORE_PRODUCT_FAIL,
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

// export const qtyChanged = (text, id) => {
//   return async (dispatch, getState) => {
//     // console.log('text', text)
//
//     if (text.trim() === '') {
//       return ({
//         type: QTY_CHANGED_FAIL,
//         payload: 0
//       })
//     }
//     AsyncStorage.getItem('orders')
//     .then(storedList => {
//       let value = id.toString(), order = {
//           [value]: parseInt(text)
//         }
//       AsyncStorage.mergeItem('orders', JSON.stringify(order))
//       .then(() => {
//         AsyncStorage.getItem('orders')
//         .then(newList => {
//           let obj = JSON.parse(newList)
//           if (obj === null) {
//             dispatch({
//               type: CART_LIST_FAIL,
//               payload: []
//             })
//           }
//           // console.log(obj)
//           // const products = []
//           // console.log(obj)
//           state = getState()
//           let products = state.cart.list
//           // console.log(products)
//           for (let i = 0; i < products.length; i++) {
//             if (products[i].code === id) {
//               console.log(id)
//               console.log(products[i].code)
//               products[i].value = parseFloat(text)
//               products[i].total = parseFloat(text * products[i].price).toFixed(3)
//               products.sort(function (a, b) {
//                 if (a.description > b.description) {
//                   return 1
//                 }
//                 if (a.description < b.description) {
//                   return -1
//                 }
//                 // a must be equal to b
//                 return 0
//               })
//               console.log(products)
//               dispatch({
//                 type: QTY_CHANGED,
//                 payload: text,
//                 list: products,
//                 loading: true,
//                 totalOrder: 0
//               })
//             }
//           }
//         })
//       })
//     })
//   }
// }

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
            let url = `http://anzornz.kodait.com/anzor_services/product?barCode=${key}&uid=${state.auth.uid}`
            fetch(url)
              .then((response) => response.json())
              .then((responseJson) => {
                if (typeof (responseJson) === 'object') {
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
                      type: QTY_CHANGED,
                      payload: text,
                      list: products,
                      loading: true,
                      totalOrder: totalOrder
                    })
                  }
                } else {
                  console.log('1', key)
                  delete obj[key]
                }
              })
              .catch((error) => {
                console.log('2', key)
                delete obj[key]
                // console.error(error + ' IN FETCH CATCH QTY_CHANGED')
              })
          }
        })
      })

    })

  }
}

export const getCartList = () => {
  return async (dispatch, getState) => {
    let state = getState()
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
        let url = `http://anzornz.kodait.com/anzor_services/product?barCode=${key}&uid=${state.auth.uid}`
        // let url = `http://anzorbeta.dev.kodait.com/anzor_services/product?barCode=${key}&uid=1`
        fetch(url)
          .then((response) => response.json())
          .then((responseJson) => {
            if (typeof (responseJson) === 'object') {
              // console.log('RS', responseJson)
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
                  loading: true
                })
              }
            } else {
              console.log('1', key)
              delete obj[key]
            }
          })
          .catch((error) => {
            // console.error(' IN FETCH CATCH CART_LIST_SUCCESS', error)
            console.log('2', key)
            delete obj[key]
          })
      }
    })
  }
}

export const deleteProduct = (id) => {
  return async (dispatch, getState) => {
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
          loading: true
        })
      }
      const products = []
      let totalOrder = 0
      AsyncStorage.removeItem('orders')
      AsyncStorage.setItem('orders')
      for (let key in obj) {
        let url = `http://anzornz.kodait.com/anzor_services/product?barCode=${key}&uid=${state.auth.uid}`
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
                  price: parseFloat(responseJson[0].sell_price_1).toFixed(3),
                  code: key,
                  value: obj[key],
                  total: parseFloat(obj[key] * responseJson[0].sell_price_1).toFixed(3)
                })
                totalOrder = parseFloat(parseFloat(totalOrder) + parseFloat(obj[key] * responseJson[0].sell_price_1)).toFixed(3)
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
                    loading: true
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
            console.log('2', key)
            delete obj[key]
          })
      }
    })
  }
}

export const checkOut = () => {
  return async (dispatch, getState) => {
    // let skuQty = [15]
    // let sku = ['SDM416']
    // let obj = {}
    let state = getState()
    let list = state.cart.list
    // console.log(list)
    let url = 'http://anzornz.kodait.com/anzor_services/checkout?'
    // let url = 'http://anzorbeta.dev.kodait.com/anzor_services/checkout?'
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
    // for (let key in obj) {
      // http://anzorbeta.dev.kodait.com/anzor_services/checkout?skuQty[0]=1&skuQty[1]=5&sku[0]=ZBBPFA&sku[1]=CHCL605&uid=1
      // fetch(`http://anzornz.kodait.com/anzor_services/checkout?skuQty[0]=${skuQty[0]}&sku[0]=${sku[0]}&uid=1`)
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
    // }
  }
}

export const addNewProduct = (barCodeScannedValue) => {
  return async (dispatch, getState) => {
    let state = getState()
    let url = `http://anzornz.kodait.com/anzor_services/product?barCode=${barCodeScannedValue}&uid=${state.auth.uid}`
    // let url = `http://anzorbeta.dev.kodait.com/anzor_services/product?barCode=${key}&uid=1`
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        if (typeof (responseJson) === 'object') {
          AsyncStorage.getItem('orders').then(stores => {
            if (barCodeScannedValue !== false) {
              if (stores != null) {
                let ordersAux = JSON.parse(stores)
                if (ordersAux[barCodeScannedValue] !== undefined) {
                  let value = barCodeScannedValue.toString(), order = {
                      [value]: ordersAux[barCodeScannedValue] + 1
                    }
                  AsyncStorage.mergeItem('orders', JSON.stringify(order))
                } else {
                  let value = barCodeScannedValue.toString(), order = {
                      [value]: 1
                    }
                  AsyncStorage.mergeItem('orders', JSON.stringify(order))
                }
              } else {
                let value = barCodeScannedValue.toString(), order = {
                    [value]: 1
                  }
                AsyncStorage.setItem('orders', JSON.stringify(order))
              }
            } else {
              console.log('Select a bar code please!')
            }
          })
          .then(() => {
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
                let url = `http://anzornz.kodait.com/anzor_services/product?barCode=${key}&uid=${state.auth.uid}`
                // let url = `http://anzorbeta.dev.kodait.com/anzor_services/product?barCode=${key}&uid=1`
                fetch(url)
                  .then((response) => response.json())
                  .then((responseJson) => {
                    if (typeof (responseJson) === 'object') {
                      // console.log('RS', responseJson)
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
                          loading: true
                        })
                      }
                    } else {
                      console.log('1', key)
                      delete obj[key]
                    }
                  })
                  .catch((error) => {
                    // console.error(' IN FETCH CATCH CART_LIST_SUCCESS', error)
                    console.log('2', key)
                    delete obj[key]
                  })
              }
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
