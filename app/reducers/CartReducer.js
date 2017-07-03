import { AsyncStorage } from 'react-native'

import {
  QTY_CHANGED,
  CART_LIST_SUCCESS,
  CLEAR_LIST
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
      // console.log(action)
      return { ...state, qty: action.payload }
    case CART_LIST_SUCCESS:
      return { ...state, list: action.payload, loading: false, ready: true, error: '' }
    case CLEAR_LIST:
      return { ...state, list: action.payload, loading: false }
    default:
      return state
  }
}
