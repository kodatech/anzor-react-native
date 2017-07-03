import {
  SET_IS_CONNECTED
} from '../actions/types'

const INITIAL_STATE = {
  isConnected: null
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_IS_CONNECTED:
      return { ...state, isConnected: action.payload }
    default:
      return state
  }
}
