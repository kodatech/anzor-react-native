import { combineReducers } from 'redux'
import CartReducer from './CartReducer'
import ConnectionReducer from './ConnectionReducer'
import AuthReducer from './AuthReducer'

export default combineReducers({
  auth: AuthReducer,
  cart: CartReducer,
  conn: ConnectionReducer
})
