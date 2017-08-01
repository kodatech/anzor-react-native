import { AsyncStorage } from 'react-native'

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
  GET_PRODUCT_FOR_QTY,
  QTY_CHANGED_FROM_PRODUCT
} from '../actions/types'

const INITIAL_STATE = {
  list: [],
  qty: '',
  loading: true,
  totalOrder: 0,
  error: '',
  upToCart: false,
  product: false,
  qtyFromProduct: '1'
}

export default (state = INITIAL_STATE, action) => {
  // console.log(action)
  switch (action.type) {
    case QTY_CHANGED_FROM_PRODUCT:
      return { ...state, product: action.payload }
    case QTY_CHANGED_SUCCESS:
      return { ...state, qty: action.payload, error: '' }
    case QTY_CHANGED_FAIL:
      return state
    case GET_CART_LIST:
      return { ...state, loading: true, error: '' }
    case CART_LIST_SUCCESS:
      return { ...state, list: action.payload, loading: action.loading, totalOrder: action.totalOrder, error: '', message: '', arrow: '', upToCart: action.upToCart }
    case CART_LIST_FAIL:
      return { ...state, list: action.payload, loading: false, error: '', totalOrder: 0, upToCart: action.upToCart }
    case CLEAR_LIST:
      return { ...state, list: action.payload, loading: false, totalOrder: action.totalOrder, message: '', arrow: '', upToCart: false }
    case DELETE_PRODUCT:
      return { ...state, loading: true }
    case DELETE_PRODUCT_SUCCESS:
      return { ...state, list: action.payload, loading: false, totalOrder: action.totalOrder, error: '', upToCart: action.upToCart }
    case DELETE_PRODUCT_FAIL:
      return { ...state, list: action.payload, loading: false, error: '' }
    case CHECK_OUT:
      return { ...state, loading: true, error: '' }
    case CHECK_OUT_SUCCESS:
      return { ...state,
        list: action.payload,
        totalOrder: action.totalOrder,
        loading: false,
        // message: 'Great! Your products have been uploaded to your cart. ',
        // arrow: '↓'
      }
    case CHECK_OUT_FAIL:
      return { ...state, loading: false, error: 'Check out fail!' }
    case ADD_NEW_PRODUCT:
      return { ...state, loading: true }
    case GET_PRODUCT_FOR_QTY:
      return { ...state, product: action.payload, loading: false }
    case STORE_PRODUCT_SUCCESS:
      return { ...state, list: action.payload, loading: false, totalOrder: action.totalOrder, error: '', message: '', arrow: '', upToCart: action.upToCart }
    case STORE_PRODUCT_FAIL:
      return { ...state, error: 'This is not a valid product', loading: false }
    case CART_NO_CONNECTED:
      return { isConnected: action.payload }
    default:
      return state
  }
}
