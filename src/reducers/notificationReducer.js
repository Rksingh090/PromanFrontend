import * as ACTIONS from "../actions/actions";

const initialState = {
  notifications: [],
  notificationLoading: true,
  notificationError: false,
  notificationSuccess: false,
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.NOTIFICATION_REQUEST:
      return { ...state, notificationLoading: true };
    case ACTIONS.NOTIFICATION_ERROR:
      return { ...state, notificationLoading: false, notificationError: true };
    case ACTIONS.GET_NOTIFICATION:
      return {
        notifications: action.payload.notification,
        notificationLoading: false,
        notificationSuccess: true,
      };
    case ACTIONS.ADD_NOTIFICATION:
      return { notifications: [...state, action.payload] };
    case ACTIONS.DELETE_NOTIFICATION:
      const notificationsPrev = [...state.notifications];
      const index = notificationsPrev.findIndex(
        (noti) => noti._id === action.payload.notification._id
      );
      notificationsPrev.splice(index, 1);
      return {...state, notifications: notificationsPrev};
    default:
      return { ...state };
  }
};
