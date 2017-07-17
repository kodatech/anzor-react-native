import { AsyncStorage } from 'react-native'
import { Actions } from 'react-native-router-flux'
import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  CHECK_IF_LOGGED_ON,
  LOGGED_ON_SUCCESS,
  LOGGED_ON_FAIL,
  LOG_OUT,
  EMAIL_CHANGED,
  PASSWORD_CHANGED
} from './types'

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  }
}

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  }
}

export const loginUser = (email, password) => {
  return (dispatch) => {
    dispatch({type: LOGIN_USER})
    let pass = changeURIEncode(password)
    let url = `http://anzornz.kodait.com/anzor_services/login?name=${email}&pass=${pass}`
    // let url = `http://anzorbeta.dev.kodait.com/anzor_services/login?name=${email}&pass=${pass}`
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('RJ', responseJson)
      if (responseJson) {
        console.log('RJ23', responseJson)
        loginUserSuccess(dispatch, responseJson[0].pass, responseJson[0].uid, email, pass)
      } else {
        loginUserFail(dispatch)
      }
    })
    .catch(() => console.log('Fail communication with server'))
  }
}

export const checkIfLoggedOn = (dispatch) => {
  return (dispatch) => {
    dispatch({type: CHECK_IF_LOGGED_ON})
    AsyncStorage.getItem('user').then(user => {
      // console.log(user)
      if (user) {
        AsyncStorage.getItem('email').then(email => {
          AsyncStorage.getItem('pass').then(pass => {
            // loginUser(email, pass)
            email = email.substr(1)
            email = email.substr(0, email.length - 1)
            pass = pass.substr(1)
            pass = pass.substr(0, pass.length - 1)
            let url = `http://anzornz.kodait.com/anzor_services/login?name=${email}&pass=${pass}`
            // console.log(url)
            fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
              // console.log('RJ 2', responseJson)
              if (responseJson) {
                loggedOnSuccess(dispatch, user, responseJson[0].uid, email, pass)
              } else {
                loggedOnFail(dispatch)
              }
            })
          })
        })
      } else {
        loggedOnFail(dispatch)
      }
    })
  }
}

export const logOut = () => {
  return (dispatch) => {
    dispatch({type: LOG_OUT})
    AsyncStorage.removeItem('user')
    AsyncStorage.removeItem('email')
    AsyncStorage.removeItem('pass')
    // AsyncStorage.clear()
    Actions.loginScene()
  }
}

const loggedOnSuccess = (dispatch, user, uid, email, pass) => {
  dispatch({
    type: LOGGED_ON_SUCCESS,
    payload: user,
    uid: uid,
    email: email,
    password: pass
  })
  Actions.listScene()
}

const loggedOnFail = (dispatch) => {
  dispatch({
    type: LOGGED_ON_FAIL,
  })
  Actions.loginScene()
}

const loginUserSuccess = (dispatch, user, uid, email, pass) => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user,
    uid: uid,
    email: email,
    password: pass
  })
  AsyncStorage.setItem('user', JSON.stringify(user))
  AsyncStorage.setItem('uid', JSON.stringify(uid))
  AsyncStorage.setItem('email', JSON.stringify(email))
  AsyncStorage.setItem('pass', JSON.stringify(pass))
  Actions.listScene()
}

const loginUserFail = (dispatch) => {
  dispatch({
    type: LOGIN_USER_FAIL
  })
}

const changeURIEncode = (password) => {
  let pass = ''
  for (let i = 0; i < password.length; i++) {
    switch (password[i]) {
      case '&':
        pass += '%26'
        break
      case '=':
        pass += '%3D'
        break
      default:
        pass += password[i]
    }
  }
  return pass
}
