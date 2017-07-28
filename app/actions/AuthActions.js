import { AsyncStorage } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { URI } from './configuration'
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

    let Crypto = require('crypto-js')

    // let data = '12345678'
    let key = '59b6ab46d379b89d794c87b74a511fbd59b6ab46d379b89d794c87b74a511fbd'
    let iv = '0aaff094b6dc29742cc98a4bac8bc8f9'
    pass = Crypto.AES.encrypt(Crypto.enc.Utf8.parse(password), Crypto.enc.Hex.parse(key), { iv: Crypto.enc.Hex.parse(iv) })

    // let pass2 = Crypto.AES.encrypt('Message', 'kodakabana')

    // pass2 = Crypto.AES.decrypt(pass2, 'kodakabana')
    // pass2 = pass2.toString(Crypto.enc.Utf8)

    // let pass = changeURIEncode(password)
    let url = `${URI}login?name=${email}&pass=${pass}`

    // let url = `${URI}login?name=${email}&pass=${pass}`
    // console.log(url)
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson) {
        // console.log(pass2.ciphertext)
        // console.log(pass2.key)
        console.log('RJ23', responseJson)
        loginUserSuccess(dispatch, responseJson[0].pass, responseJson[0].uid, email, password)
      } else {
        loginUserFail(dispatch)
      }
    })
    .catch((error) => {
      console.log('Fail communication with server: ', error)
      loginUserFail(dispatch)
    })
    // loginUserSuccess(dispatch, '$S$DYKn6ASvijMjn0nBIjMLAz5zR11xpNxbZfSIrt3FGnwUj8xn0Crp', '7067', email, pass)
  }
}

export const checkIfLoggedOn = (scene, dispatch) => {
  // console.log(test)
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
            // let url = `http://anzorapp.stage.kodait.com/anzor_services/login?name=${email}&pass=${pass}`
            // console.log(url)

            let Crypto = require('crypto-js')

            // let data = '12345678'
            let key = '59b6ab46d379b89d794c87b74a511fbd59b6ab46d379b89d794c87b74a511fbd'
            let iv = '0aaff094b6dc29742cc98a4bac8bc8f9'
            pass = Crypto.AES.encrypt(Crypto.enc.Utf8.parse(pass), Crypto.enc.Hex.parse(key), { iv: Crypto.enc.Hex.parse(iv) })

            let url = `${URI}login?name=${email}&pass=${pass}`
            fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
              // console.log('RJ 2', responseJson)
              if (responseJson) {
                loggedOnSuccess(dispatch, user, responseJson[0].uid, email, pass, scene)
              } else {
                loggedOnFail(dispatch)
              }
            })
            // loggedOnSuccess(dispatch, user, '7067', email, pass, scene)
          })
        })
      } else {
        loggedOnFail(dispatch)
      }
    })
    // loggedOnSuccess(dispatch, user, 7067, email, pass, scene)
  }
}

export const logOut = () => {
  return (dispatch) => {
    dispatch({type: LOG_OUT})
    // AsyncStorage.removeItem('user')
    // AsyncStorage.removeItem('email')
    // AsyncStorage.removeItem('pass')
    AsyncStorage.clear()
    Actions.loginScene()
  }
}

const loggedOnSuccess = (dispatch, user, uid, email, pass, scene) => {
  dispatch({
    type: LOGGED_ON_SUCCESS,
    payload: user,
    uid: uid,
    email: email,
    password: pass
  })
  switch (scene) {
    case 'listScene':
      Actions.listScene()
      break
    case 'scanScene':
      Actions.scanScene()
      break
    case 'cartScene':
      Actions.cartScene()
      break
    default:
      Actions.loginScene()
  }
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
