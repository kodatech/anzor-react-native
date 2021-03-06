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
  CHANGE_VIEW_CART_STATUS,
  ADD_NEW_PRODUCT,
  STORE_PRODUCT_SUCCESS,
  STORE_PRODUCT_FAIL,
  CART_NO_CONNECTED,
  GET_PRODUCT_FOR_QTY,
  QTY_CHANGED_FROM_PRODUCT,
  DISCARD_PRODUCT,
  CLEAR_ERROR
} from '../actions/types'

const INITIAL_STATE = {
  list: [],
  qty: '',
  loading: true,
  totalOrder: 0,
  error: '',
  upToCart: false,
  product: false,
  // qtyFromProduct: '1',
  viewCart: false
}

export default (state = INITIAL_STATE, action) => {
  // console.log(action)
  switch (action.type) {
    case CLEAR_ERROR:
      return { ...state, error: '' }
    case DISCARD_PRODUCT:
      return { ...state, product: action.payload }
    case QTY_CHANGED_FROM_PRODUCT:
      return { ...state, product: action.payload }
    case QTY_CHANGED_SUCCESS:
      return { ...state, qty: action.payload, error: '' }
    case QTY_CHANGED_FAIL:
      return { ...state, error: action.error }
    case GET_CART_LIST:
      return { ...state, loading: true }
    case CART_LIST_SUCCESS:
      return { ...state, list: action.payload, loading: action.loading, totalOrder: action.totalOrder, message: '', arrow: '', upToCart: action.upToCart }
    case CART_LIST_FAIL:
      return { ...state, list: action.payload, loading: false, totalOrder: 0, upToCart: action.upToCart }
    case CLEAR_LIST:
      return { ...state, list: action.payload, loading: false, totalOrder: action.totalOrder, message: '', error: '', arrow: '', upToCart: false }
    case DELETE_PRODUCT:
      return { ...state, loading: true }
    case DELETE_PRODUCT_SUCCESS:
      return { ...state, list: action.payload, loading: false, totalOrder: action.totalOrder, error: '', upToCart: action.upToCart }
    case DELETE_PRODUCT_FAIL:
      return { ...state, list: action.payload, loading: false, error: '' }
    case CHECK_OUT:
      return { ...state,
        loading: true,
        error: '',
        viewCart: true }
    case CHECK_OUT_SUCCESS:
      return { ...state,
        list: action.payload,
        totalOrder: action.totalOrder,
        loading: false,
        upToCart: false,
        error: '',
        // viewCart: false
        message: 'Great! Your products have been uploaded to your cart. ',
        // arrow: '↓'
      }
    case CHECK_OUT_FAIL:
      return { ...state, loading: false, error: 'Check out fail!' }
    case CHANGE_VIEW_CART_STATUS:
      return { ...state, viewCart: action.payload, message: '' }
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
