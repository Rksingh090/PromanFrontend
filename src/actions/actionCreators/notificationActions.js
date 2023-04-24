import axios from 'axios'
import * as ACTIONS from '../actions'

const BASE_URL = `${ACTIONS.api}/notification/`

export const fetchNotificationByUserID = (userID, token) => (dispatch) => {
    dispatch({
        type: ACTIONS.NOTIFICATION_REQUEST
    })
    axios.get(BASE_URL+userID, 
        { headers: { 'x-auth-token': token },})
    .then(res => {
        dispatch({type: ACTIONS.GET_NOTIFICATION, payload:{notification: res.data}})
    }).catch(err => {
        if(err){
            dispatch({type: ACTIONS.NOTIFICATION_ERROR})
        }
    })
}

export const createNewNotification = (params,token) => (dispatch) => {
    axios
    .post(BASE_URL, params, {
        headers: {
            "x-auth-token": token
        }
    })
    .then((res) => {
        dispatch({
            TYPE: ACTIONS.ADD_NOTIFICATION,
            payload: res.data
        })
    }).catch((err) => {
        if(err){
            dispatch({type: ACTIONS.NOTIFICATION_ERROR, payload: {error: err}})
        }
    } )
}

export const deleteNotification = (id, token) => (dispatch) => {
    axios.delete(BASE_URL+id, 
        { headers: { 'x-auth-token': token },})
    .then(res => {
        dispatch({type: ACTIONS.DELETE_NOTIFICATION, payload:{notification: res.data}})
    }).catch(err => {
        if(err){
            dispatch({type: ACTIONS.NOTIFICATION_ERROR})
        }
    })
}