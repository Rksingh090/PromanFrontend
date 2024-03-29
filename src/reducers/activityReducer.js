import * as ACTIONS from '../actions/actions'

const initialState = {
  activities: [],
  allActivity: [],
}
export const activityReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_ACTIVITIES:
      return {
        ...state,
        activities: [
          ...(action.payload.add ? state.activities : []),
          ...action.payload.activities,
        ],
        hasMore: action.payload.hasMore,
      }
    case ACTIONS.ADD_ACTIVITY:
      return {
        ...state,
        activities: [action.payload.activity, ...state.activities],
        allActivity: [action.payload.activity, ...state.allActivity]
      }
      case ACTIONS.GET_ALL_ACTIVITY:
        return {
          ...state,
          allActivity: [...action.payload]
        }
    case ACTIONS.DELETE_ACTIVITY: {
      const activitiesLog = state.activities
      const index = activitiesLog.findIndex(
        (activity) => activity._id === action.payload.activity._id,
      )
      activitiesLog.splice(index, 1)
      return {
        ...state,
        activities: [...state.activitiesLog],
      }
    }
    case ACTIONS.ERROR_ACTIVITY:
      return { ...state, activityError: action.payload.error }
    default:
      return state
  }
}
