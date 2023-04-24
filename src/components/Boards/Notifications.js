import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../../styles/Notifications.css'
import {FaUserFriends} from 'react-icons/fa'
import { addFriend } from '../../actions/actionCreators/userActions'
import { deleteNotification } from '../../actions/actionCreators/notificationActions'
import { addBoardMember } from '../../actions/actionCreators/boardActions'
const Notifications = () => {
    const dispatch = useDispatch();
    const {notifications} = useSelector((state) => state.notification)
    const {token} = useSelector((state) => state.user)

    const handleAddFriend = (data) => {
        const params =  {
            userTosendFR: data.to,
            userTosendFRUsername: data.toUsername,
            userToAddFR: data.from,
            userToAddFRUsername: data.fromUsername
        }
        dispatch(addFriend(params, token))
        dispatch(deleteNotification(data._id, token))
    }

    const handleAddBoardMember = (notification) => {
        const params = {
            memberId: notification.to,
            memberName: notification.toUsername
        }
        dispatch(addBoardMember(notification.boardId, params, token))
        dispatch(deleteNotification(notification._id, token))
    }

    return (
        <>
          <div className="BNotificationsWrapepr">
              <h2 className="BNHeading">Notification</h2>
              <div className="BNnotificationsItems">
                  {notifications.map((notfcs) => {
                      if(notfcs.notificationType === "ADD_FRIEND"){
                          return (
                              <div className="BNnotificationsItem">
                                 <span className="typeAddUser">
                                     <span><FaUserFriends />#friend {notfcs.text}</span>
                                    <span className="typeAddUserAct">
                                        <button onClick={() => handleAddFriend(notfcs)}>Accept</button>
                                        <button onClick={() => dispatch(deleteNotification(notfcs._id, token))}>Reject</button>
                                    </span>
                                 </span>
                             </div>
                          )
                      }
                      else if(notfcs.notificationType === "ADD_BOARD_MEMBER"){
                          return (
                              <div className="BNnotificationsItem">
                                 <span className="typeAddUser">
                                     <span><FaUserFriends />#Board {notfcs.text}</span>
                                    <span className="typeAddUserAct">
                                        <button onClick={() => handleAddBoardMember(notfcs)}>Accept</button>
                                        <button onClick={() => dispatch(deleteNotification(notfcs._id, token))}>Reject</button>
                                    </span>
                                 </span>
                             </div>
                          )
                      }
                  })}
              </div>
              {notifications.length === 0 && (
                      <div className="noBoardMessage">
                        You don't have any notifications.....!
                      </div>
                    )}
          </div>  
        </>
    )
}

export default Notifications
