import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {RiArrowDownSLine} from 'react-icons/ri'
import {createNewNotification} from '../../actions/actionCreators/notificationActions'

const AddBoardMember = () => {
    const dispatch = useDispatch()

    const [boardId, setBoardId] = useState("Select Board")
    const [boardName, setBoardName] = useState("Select Board")
    const [showBoardSel, setShowBoardSel] = useState(false)

    const [friendId, setFriendId] = useState("Select Friend")
    const [friendUsername, setFriendUsername] = useState("Select Friend")
    const [showFriendSelect, setShowFriendSelect] = useState(false)

    const [allFriends, setAllFriends] = useState([])
    const { boards } = useSelector((state) => state.boards)
    const { user, token} = useSelector((state) => state.user)
    
    useEffect(() => {
        if(user.friends && user.friends !== null){
            setAllFriends([...user.friends])
        }
    }, [])

    const handleBoardSelector = (brd) => {
        setBoardId(brd._id)
        setBoardName(brd.name)
        setShowBoardSel(false)
    }
    const handleFriendSelection = (frd) => {
        setFriendUsername(frd.friendUsername)
        setFriendId(frd.friendId)
        setShowFriendSelect(false)
    }
    
    const handleAddMemberToBoard = () => {
        const params = {
            text: `@${user.username} want to share his board ${boardName} with You`,
            notificationType: 'ADD_BOARD_MEMBER',
            to: friendId,
            toUsername: friendUsername,
            from: user.id,
            fromUsername: user.username,
            boardId: boardId
        }
        dispatch(createNewNotification(params, token))
    }

    return (
        <>
            <section className="addFriendSection">
                <h2>Add Board Member</h2>
                <div className="SelBRDOpt">
                    <div className="boardsOptions">
                        <span className="boardSelector" onClick={() => setShowBoardSel(!showBoardSel)}><span>{boardName}</span> <RiArrowDownSLine /></span>
                        {showBoardSel && boards.map((brd) =>
                            (
                                <span className="boardSelector" onClick={() => handleBoardSelector(brd)} key={brd._id} >{brd.name}</span>
                            )
                        )}
                    </div>
                    <div className="inputRowSS">
                        <div className="boardsOptions">
                            <span className="boardSelector" onClick={() => setShowFriendSelect(!showFriendSelect)}><span>{friendUsername}</span> <RiArrowDownSLine /></span>
                            {showFriendSelect && allFriends.map((frd) =>
                                (
                                    <span className="boardSelector" onClick={() => handleFriendSelection(frd)} key={frd.UserId} >@{frd.friendUsername}</span>
                                )
                            )}
                        </div>
                        <button className="FriendSubmit" onClick={() => handleAddMemberToBoard()} type="button" >Send Request</button>
                    </div>
                    <div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AddBoardMember;
