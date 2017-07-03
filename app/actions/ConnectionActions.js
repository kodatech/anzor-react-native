import {
  SET_IS_CONNECTED
} from './types'

export const setIsConnected = (conn) => {
  return ({
    payload: conn,
    type: SET_IS_CONNECTED
  })
}
