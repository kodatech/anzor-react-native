import { AsyncStorage } from 'react-native'

import {
  QTY_CHANGED,
  QTY_CHANGED_FAIL,
  CART_LIST_SUCCESS,
  CLEAR_LIST,
  CART_LIST_FAIL
} from '../actions/types'

const INITIAL_STATE = {
  list: [],
  qty: '',
  loading: true,
  ready: false,
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  // console.log(action)
  switch (action.type) {
    case QTY_CHANGED:
      console.log(action)
      return { ...state, qty: action.payload, list: action.list, loading: false, totalOrder: action.totalOrder, error: '' }
    case QTY_CHANGED_FAIL:
      return state
    case CART_LIST_SUCCESS:
      return { ...state, list: action.payload, loading: false, ready: true, totalOrder: action.totalOrder, error: '' }
    case CART_LIST_FAIL:
      return { ...state, list: action.payload, loading: false, ready: true, error: '' }
    case CLEAR_LIST:
      return { ...state, list: action.payload, loading: false, totalOrder: action.totalOrder }
    default:
      return state
  }
}
