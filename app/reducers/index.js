import { combineReducers } from 'redux'
import CartReducer from './CartReducer'

export default combineReducers({
  cartList: CartReducer
})
