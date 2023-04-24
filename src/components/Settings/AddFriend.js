import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewNotification } from '../../actions/actionCreators/notificationActions'
import { useOuterClick } from '../Board/BoardHeader1'
import { api } from '../../actions/actions'

const AddFriend = () => {
    const dispatch = useDispatch()


    const [userID, setUserID] = useState("")
    const [userUserName, setUserUserName] = useState("")
    const [userName, setUserName] = useState("")
    const [showAllUsers, setShowAllUsers] = useState(true)
    const [allUsers, setAllUsers] = useState([])
    const [inp, setInp] = useState("")
    
    const {token, user} = useSelector((state) => state.user)

    const fetchUsers = async ({target}) => {
        setInp(target.value)
        if((target.value).trim().length >= 3){
            await fetch(`${api}/user/search/${target.value}`, {headers: {"x-auth-token": token}})
           .then((res) => res.json())
           .then((data) => {
               setAllUsers(data)
               console.log(data)
           }).catch(err => console.log(err))
           setShowAllUsers(true)
        }
    }

    const usersShowRef = useOuterClick(e => {
        setShowAllUsers(false)
      });

    const handleUserDate = (user) => {
        setUserName(user.name)
        setUserUserName(user.username)
        setUserID(user._id)
        setShowAllUsers(false)
    }

    const sendNotificationtoUser = () => {
        const params = {
            text: `${user.username} has send friend request to You.`,
            notificationType: "ADD_FRIEND",
            to: userID,
            toUsername: userUserName,
            from: user.id,
            fromUsername: user.username
        }
        dispatch(createNewNotification(params, token))
    }
    return (
        <>
        <section className="addFriendSection">
            <h2>Add New Friend</h2>
            <div className="SelBRDOpt">
                {/* <div className="boardsOptions">
                    <span className="boardSelector" onClick={() => setShowBoardSel(!showBoardSel)}><span>{boardName}</span> <RiArrowDownSLine /></span>
                    {showBoardSel && boards.map((brd) =>
                        (
                            <span className="boardSelector" onClick={() => handleBoardSelector(brd)} key={brd._id} >{brd.name}</span>
                        )
                    )}
                </div> */}
                <div className="inputRowSS">
                    {userID === '' ? 
                        <input value={inp} ref={usersShowRef} autoComplete={'off'} onFocus={(e) => setShowAllUsers(true)} onChange={fetchUsers} placeholder="Search User by username.." type="text" name="searchUser" />
                    :
                        <div className="selectedDiv" onClick={() => setUserID("")}><strong>@{userUserName}</strong> {userName}</div>
                    }
                    <input type="button" value="send" onClick={sendNotificationtoUser} />
                    <div className="allUserMap">
                        {showAllUsers === true && allUsers.length > 0 &&
                        allUsers.map((user) => {
                            return (
                                <div  className="allUsers" onClick={() => handleUserDate(user)}>
                                    <p><strong>@{user.username}</strong> {user.name} </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}

export default AddFriend
