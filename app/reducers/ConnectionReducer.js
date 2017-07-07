import {
  SET_IS_CONNECTED,
  APP_CONNECTION_SUCCESS,
  APP_CONNECTION_FAIL
} from '../actions/types'

const INITIAL_STATE = {
  isConnected: null
}

export default (state = INITIAL_STATE, action) => {
  // console.log(action)
  switch (action.type) {
    case SET_IS_CONNECTED:
      return { ...state, isConnected: action.payload }
    default:
      return state
  }
}
