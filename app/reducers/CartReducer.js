import { AsyncStorage } from 'react-native'

import {
  QTY_CHANGED,
  CART_LIST_SUCCESS
} from '../actions/types'

const INITIAL_STATE = {
  list: [],
  qty: '',
  loading: true,
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  // console.log(action)
  switch (action.type) {
    case QTY_CHANGED:
      // console.log(action)
      return { ...state, qty: action.payload }
    case CART_LIST_SUCCESS:
      return { ...state, list: action.payload, loading: false, error: '' }
    default:
      return state
  }
}
// export default (state = INITIAL_STATE, action) => {
//   // console.log(action);
//   switch (action.type) {
//     case QTY_CHANGED:
//       return { ...state, qty: action.payload, error: '' }
//     default:
//       return state
//   }
// }
