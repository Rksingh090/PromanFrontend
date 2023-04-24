
import { configureStore, combineReducers } from '@reduxjs/toolkit'

import { boardReducer } from '../reducers/boardReducer'
import { listsReducer } from '../reducers/listsReducer'
import { cardsReducer } from '../reducers/cardsReducer'
import { activityReducer } from '../reducers/activityReducer'
import { imageReducer } from '../reducers/imageReducer'
import { userReducer } from '../reducers/userReducer'
import { notificationReducer } from '../reducers/notificationReducer'
import { chatReducer } from '../reducers/chatReducer'
import * as ACTIONS from '../actions/actions'

const appReducer = combineReducers({
  boards: boardReducer,
  lists: listsReducer,
  cards: cardsReducer,
  activities: activityReducer,
  images: imageReducer,
  user: userReducer,
  notification: notificationReducer,
  chats: chatReducer
})

const rootReducer = (state, action) => {
  if (action.type === ACTIONS.LOGOUT_USER) {
    state = undefined
  }
  return appReducer(state, action)
}

export default configureStore({reducer: rootReducer});