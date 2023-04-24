import axios from 'axios'
import * as ACTIONS from '../actions'

const BASE_URL = `${ACTIONS.api}/chat/`

export const fetchChatbyID = (boardID, token) => (dispatch) => {
    dispatch({ type: ACTIONS.CHAT_LOADING });
    axios.get(BASE_URL + boardID, {
        headers: { 'x-auth-token': token },
    })
    .then((res) => {
        dispatch({ type: ACTIONS.GET_CHAT_BY_BOARD_ID, payload: { chats: res.data } })
        }).catch((e) => {
            if (e.message === 'Network Error')
                dispatch({ type: ACTIONS.ERROR_CARD, payload: { error: e.message } })
            else if (e.response.status === 422)
                dispatch({ type: ACTIONS.VALIDATION_ERROR_CARD })
        })

}

export const createChatByBoardID = (boardID, params, token) => (dispatch) => {
    axios.post(BASE_URL + boardID, params, {
        headers: { 'x-auth-token': token },
    })
    .then((res) => {
        dispatch({type: ACTIONS.CREATE_CHAT_BY_BOARD_ID, payload: {chat: res.data}})
    })
}
export const deleteChatByID = (chatID, token) => (dispatch) => {
    axios.delete(BASE_URL + chatID, {
        headers: { 'x-auth-token': token },
    })
    .then((res) => {
        dispatch({type: ACTIONS.DELETE_CHAT_BY_ID, payload: {chat: res.data}})
    })
}