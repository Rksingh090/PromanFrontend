import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import AddNewBoard from './AddNewBoard'
import { useDispatch, useSelector } from 'react-redux'
import { createNewBoard } from '../../actions/actionCreators/boardActions'
import { deleteNotification, fetchNotificationByUserID } from '../../actions/actionCreators/notificationActions'
import { useRef } from 'react'
import { AiOutlineCloseSquare } from 'react-icons/ai'

export function useOuterClick(callback) {
  const innerRef = useRef();
  const callbackRef = useRef();

  // set current callback in ref, before second useEffect uses it
  useEffect(() => { // useEffect wrapper to be safe for concurrent mode
    callbackRef.current = callback;
  });

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);

    // read most recent callback and innerRef dom node from refs
    function handleClick(e) {
      if (
        innerRef.current &&
        callbackRef.current &&
        !innerRef.current.contains(e.target)
      ) {
        callbackRef.current(e);
      }
    }
  }, []); // no need for callback + innerRef dep

  return innerRef; // return ref; client can omit `useRef`
}



export default function BoardHeader1({ boards, currBoardName, username }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, token } = useSelector((state) => state.user);
  const { newBoard } = useSelector((state) => state.boards);
  const { notifications, notificationLoading } = useSelector((state) => state.notification)

  const [showBoardOptions, setShowBoardOption] = useState(false)
  const [showNewAddBoard, setShowNewAddBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const [boardAdded, setBoardAdded] = useState(false)
  const [showNotification, setShowNotification] = useState(false)


  useEffect(() => {
    if (!notifications && notificationLoading) {
      dispatch(fetchNotificationByUserID(user.id, token))
    }
  }, [notificationLoading, dispatch, user, token, notifications])

  useEffect(() => {
    if (newBoard) {
      navigate(`/b/${newBoard._id}/${newBoard.name}`)
    }
  }, [newBoard, boardAdded, navigate])

  const submitHandler = (e) => {
    e.preventDefault()
    if (newBoardTitle === '') return
    const postBoardReq = {
      name: newBoardTitle,
      userId: user.id,
      Background: {
        color: '#f88b42',
      },
    }
    dispatch(createNewBoard(postBoardReq))
    setNewBoardTitle('')
    setShowNewAddBoard(false)
    setBoardAdded(true)
  }
  const BoardOptionInnerRef = useOuterClick(e => {
    setShowBoardOption(false)
  });
  const AddNewBoardInnerRef = useOuterClick(e => {
    setShowNewAddBoard(false)
  });
  const notificationInnerRef = useOuterClick(e => {
    setShowNotification(false);
  });

  return (
    <div className="d-1" >
      <div className="d-11">
        <span className="d-11-btn-1 glass" onClick={() => navigate(`/${username}/boards`)}><i className="fa fa-home"></i></span>
        <div className="d-11-btn-2 glass" ref={BoardOptionInnerRef}>
          <div className="BoardName" onClick={() => setShowBoardOption(!showBoardOptions)} onAbort={() => { alert(false) }}>{currBoardName} </div>
          <div className="DisplayAllBoards" >
            {showBoardOptions &&
              boards.map((board) => (
                <div key={board._id} className="darkenBname" onClick={() => { setShowBoardOption(false); navigate(`/b/${board._id}/${board.name}`) }}>{board.name}</div>
              ))
            } 
          </div>
        </div>
        <div className="d-11-nav-search">
          <input type="seacrh" className="nav_search" placeholder="Jump To" />
          <i className="fa fa-search seacrInconNav"></i>
        </div>
      </div>
      <div className="d-12">
        <span className="brand_name"><img src="https://www.ontrick.xyz/favicon.ico" alt="dashboard " /> ProMan</span>
      </div>
      <div className="d-13" >
        <div className="d-13-block-1" ref={AddNewBoardInnerRef}>
          <span className="d-13-btn-1 glass" onClick={() => setShowNewAddBoard(!showNewAddBoard)}><i className="fa fa-plus-square-o"></i> </span>
          {showNewAddBoard &&
            <AddNewBoard newBoardTitle={newBoardTitle} newBoardTitleChangeHandler={(e) => setNewBoardTitle(e.target.value)} newBoardSubmitHandler={submitHandler} />
          }
        </div>
        <div className="d-13-block-1" ref={notificationInnerRef}>
          <span className="d-13-btn-1 glass"  onClick={() => setShowNotification(!showNotification)}><i className="fa fa-bell-o"></i></span>
          {showNotification && (
            <div className="notificationWrapper">
              {notifications.length > 0 ? (

                notifications.map((notification) =>
                  (<div className={`notification ${notification.notificationType}`} key={notification._id}>
                    <span>{notification.text}</span>
                    <AiOutlineCloseSquare
                    onClick={() => dispatch(deleteNotification(notification._id, token))}
                     className="notiTime" />
                    </div>)
                )
              ) : 
                <span>You have no notifications yet !</span>
              }
            </div>
          )}
        </div>
        <div onClick={() => navigate(`/profile/${user.id}`)} className="d-13_profile_btn">
          <span>{user.name ? (user.name).slice(0,1) : "P"}</span>
        </div>
      </div>
    </div>
  )
}
