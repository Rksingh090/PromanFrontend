import * as ACTIONS from '../actions/actions'

const initialState = {
    chatLoadings: false,
    chats: [],
    chatUpdate: false,
}
export const chatReducer = (state = initialState, action) => {
   switch (action.type) {
       case ACTIONS.CHAT_LOADING:
           return {...state, chatLoadings: true}
       case ACTIONS.CHAT_LOADING_STOP:
           return {...state, chatLoadings: false}
        case ACTIONS.GET_CHAT_BY_BOARD_ID:
           return { ...state, chats: action.payload.chats, chatLoadings: false, chatUpdate: false}
        case ACTIONS.CREATE_CHAT_BY_BOARD_ID:
            const ChatsCopy = [...state.chats]
           const isExistCopy = ChatsCopy.find((chat) => chat._id === action.payload.chat._id)
           if (isExistCopy){
                return {...state}
            }else{
                return {...state, chats :[...state.chats, action.payload.chat], recentChat: action.payload.chat}
            }
        case ACTIONS.UPDATE_CHAT:
            const prevChats = [...state.chats]
            const isExist = prevChats.find((chat) => chat._id === action.payload.chat._id)
            if(isExist){
                return { ...state, chatUpdate: false}
            }else{
                return {...state, chats :[...state.chats, action.payload.chat], recentChat: action.payload.chat}
            }
       default:
           return {...state}
   }
}

export default chatReducer
