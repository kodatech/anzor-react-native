import { AsyncStorage } from 'react-native'

import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  CHECK_IF_LOGGED_ON,
  LOGGED_ON_SUCCESS,
  LOGGED_ON_FAIL,
  LOG_OUT,
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  REMEMBER_ME,
  REMOVE_FROM_DEVICE,
  CHECK_IF_REMEMBER,
  CHECK_IF_REMEMBER_SUCCESS,
  CHECK_IF_REMEMBER_FAIL
} from '../actions/types'

const INITIAL_STATE = {
  // email: 'pania.pene@gatewayglass.co.nz',
  // password: '123456',
  email: '',
  password: '',
  rememberMe: true,
  loading: false,
  error: '',
  user: null,
  uid: null
}

export default (state = INITIAL_STATE, action) => {
  // console.log(action)
  switch (action.type) {
    case CHECK_IF_REMEMBER:
      return { ...state, loading: action.payload }
    case CHECK_IF_REMEMBER_SUCCESS:
      return { ...state, loading: action.payload, email: action.email, password: action.password }
    case CHECK_IF_REMEMBER_FAIL:
      return { ...state, loading: action.payload, email: action.email, password: action.password }
    case REMEMBER_ME:
      return { ...state, rememberMe: action.payload }
    case EMAIL_CHANGED:
      return { ...state, email: action.payload, error: '' }
    case PASSWORD_CHANGED:
      return { ...state, password: action.payload, error: '' }
    case LOGIN_USER:
      return { ...state, loading: true, error: '' }
    case LOGIN_USER_SUCCESS:
      return { ...state, ...INITIAL_STATE, user: action.payload, uid: action.uid, email: action.email, password: action.password }
    case LOGIN_USER_FAIL:
      return { ...state, ...INITIAL_STATE, error: 'Authentication Failed' }
    case CHECK_IF_LOGGED_ON:
      return { ...state, loading: true, error: '' }
    case LOGGED_ON_SUCCESS:
      return { ...state, user: action.payload, email: action.email, password: action.password, uid: action.uid, loading: false, error: '' }
    case LOGGED_ON_FAIL:
      return { ...state, ...INITIAL_STATE }
    case LOG_OUT:
      return { ...state }
    case REMOVE_FROM_DEVICE:
      return { ...state, ...INITIAL_STATE }
    default:
      return state
  }
}
