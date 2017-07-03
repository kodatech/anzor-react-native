import { combineReducers } from 'redux'
import CartReducer from './CartReducer'
import ConnectionReducer from './ConnectionReducer'

export default combineReducers({
  cartList: CartReducer,
  connectionState: ConnectionReducer
})
