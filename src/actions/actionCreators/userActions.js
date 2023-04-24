import axios from 'axios'
import * as ACTIONS from '../actions'

const BASE_URL = `${ACTIONS.api}/user/`

export const fetchUserInfo = (token) => (dispatch) => {
  dispatch({ type: ACTIONS.USER_REQUEST })
  axios
    .get(BASE_URL, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({
        type: ACTIONS.GET_USER,
        payload: { user: res.data, token },
      })
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_USER, payload: { error: e.message } })
    })
}

export const checkTokenValidity = (token) => (dispatch) => {
  dispatch({ type: ACTIONS.TOKEN_REQUEST })
  axios
    .post(`${BASE_URL}tokenIsValid`, null, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({
        type: ACTIONS.TOKEN_RESPONSE,
        payload: { isTokenValid: res.data, token },
      })
    })
    .catch((e) => {
      dispatch({
        type: ACTIONS.TOKEN_RESPONSE_ERROR,
        payload: { error: e.message },
      })
    })
}

export const loginUser = (params) => (dispatch) => {
  dispatch({ type: ACTIONS.LOGIN_REQUEST })
  axios
    .post(`${BASE_URL}login`, params)
    .then((res) => {
      dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: { user: res.data } })
    })
    .catch((e) => {
      dispatch({
        type: ACTIONS.LOGIN_FAILED,
        payload: { error: e.response.data.msg },
      })
    })
}

export const registerUser = (params) => (dispatch) => {
  dispatch({ type: ACTIONS.REGISTER_REQUEST })
  axios
    .post(`${BASE_URL}register`, params)
    .then((res) => {
      dispatch({
        type: ACTIONS.REGISTER_SUCCESS,
        payload: { user: res.data },
      })
    })
    .catch((e) => {
      dispatch({
        type: ACTIONS.REGISTER_FAILED,
        payload: { error: e.response.data.msg },
      })
    })
}

export const updateUser = (id, params, token) => (dispatch) => {
  axios
  .post(`${BASE_URL}update`,{id, params}, {
    headers: {
      "x-auth-token": token
    }
  })
  .then((res) => {
    dispatch({ type: ACTIONS.UPDATE_USER, payload: {user: res.data} })
  })
  .catch((e) => {
    dispatch({type: ACTIONS.UPDATE_ERROR,
    payload: {msg: e.response.data.message}
  })
  })
}

export const addFriend = (params, token) => (dispatch) => {
  axios
  .post(`${BASE_URL}addfriend`,params, {
    headers: {
      "x-auth-token": token
    }
  })
  .then((res) => {
    dispatch({ type: ACTIONS.ADD_FRIEND, payload: {user: res.data} })
  })
  .catch((e) => {
    dispatch({type: ACTIONS.UPDATE_ERROR,
    payload: {msg: e.response.data.message}
  })
  })
}

export const logoutUser = () => (dispatch) => {
  dispatch({ type: ACTIONS.LOGOUT_USER })
}

