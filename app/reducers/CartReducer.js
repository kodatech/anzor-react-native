import { AsyncStorage } from 'react-native'

import {
  QTY_CHANGED,
  QTY_CHANGED_FAIL,
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
  CART_NO_CONNECTED
} from '../actions/types'

const INITIAL_STATE = {
  list: [],
  qty: '',
  loading: true,
  totalOrder: 0,
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  // console.log(action)
  switch (action.type) {
    case QTY_CHANGED:
      return { ...state, qty: action.payload, list: action.list, loading: false, totalOrder: action.totalOrder, error: '' }
    case QTY_CHANGED_FAIL:
      return state
    case CART_LIST_SUCCESS:
      return { ...state, list: action.payload, loading: false, totalOrder: action.totalOrder }
    case CART_LIST_FAIL:
      return { ...state, list: action.payload, loading: false, error: '', totalOrder: 0 }
    case CLEAR_LIST:
      return { ...state, list: action.payload, loading: false, totalOrder: action.totalOrder, message: '', arrow: '' }
    case DELETE_PRODUCT:
      return { ...state, loading: true }
    case DELETE_PRODUCT_SUCCESS:
      return { ...state, list: action.payload, loading: false, totalOrder: action.totalOrder, error: '' }
    case DELETE_PRODUCT_FAIL:
      return { ...state, list: action.payload, loading: false, error: '' }
    case CHECK_OUT:
      return { ...state, loading: true, error: '' }
    case CHECK_OUT_SUCCESS:
      return { ...state,
        list: action.payload,
        totalOrder: action.totalOrder,
        loading: false,
        message: 'Great! Your products have been uploaded to your cart, press here to view ',
        arrow: '↓'}
    case CHECK_OUT_FAIL:
      return state
    case ADD_NEW_PRODUCT:
      return { ...state, loading: true }
    case STORE_PRODUCT_SUCCESS:
      return { ...state, list: action.payload, loading: false, totalOrder: action.totalOrder, error: '', message: '', arrow: '' }
    case STORE_PRODUCT_FAIL:
      return { ...state, error: 'This is not a valid product' }
    case CART_NO_CONNECTED:
      return { isConnected: action.payload }
    default:
      return state
  }
}
