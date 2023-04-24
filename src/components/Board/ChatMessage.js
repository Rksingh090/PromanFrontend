import React, { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import {
    createChatByBoardID,
    fetchChatbyID
} from '../../actions/actionCreators/chatActions'
import '../../styles/ChatMessage.css'
import { useOuterClick } from './BoardHeader1.js'
import { io } from 'socket.io-client'
import { useSelector } from "react-redux"
import ScrollToBottom from 'react-scroll-to-bottom'
import moment from 'moment'
import { UPDATE_CHAT } from "../../actions/actions"


const socket = io('/')

const ChatMessage = () => {
    const dispatch = useDispatch()

    const [showChat, setShowChat] = useState(false)
    const [chatText, setChatText] = useState('')
    const [showBadge, setShowBadge] = useState(false)
    const [showOnlineUsers, setShowOnlineUser] = useState(false)
    const [onlineUsers, setOnlineUser] = useState([])

    const { user, token } = useSelector((state) => state.user);
    const { currBoard } = useSelector((state) => state.boards);
    const { chats } = useSelector((state) => state.chats);

    const [recentMessage, setRecentMessage] = useState({})
    const [Messages, setMessages] = useState([])

    const chatMessageRef = useOuterClick(e => {
        setShowChat(false)
        setShowOnlineUser(false)
    })

    useEffect(() => {
        if (user.id !== undefined && user.name !== undefined && currBoard._id !== undefined) {
            const socket_user = { UserID: user.id, UserName: user.name, boardID: currBoard._id }
            socket.emit("JoinBoard", socket_user);
        }
    }, [user, currBoard])


    useEffect(() => {
        socket.on("userMessage", ({ UserID, UserName, text }) => {
            let newMessage = { UserID: UserID, UserName: UserName, text: text }
            if(newMessage !== null){
                setRecentMessage(newMessage)
                setMessages([...Messages, newMessage])
                dispatch({ type: UPDATE_CHAT, payload: { chat: recentMessage } })
            }
            if (showChat === false) {
                setShowBadge(true)
            } else {
                setShowBadge(false)
            }
        })
    }, [Messages, showChat, dispatch, recentMessage])

    // useEffect(() => {
    //     if(recentMessage !== null){
            
    //     }
    //     setRecentMessage(null)
    // }, [recentMessage, Messages])


    useEffect(() => {
        socket.on("sendBoardMembers", (data) => {
            setOnlineUser([...data])
        })
    }, [])

    useEffect(() => {
        if (currBoard._id !== undefined) {
            dispatch(fetchChatbyID(currBoard._id, token))
        }
    }, [dispatch, currBoard, token])

    useEffect(() => {
        if (chats !== null) {
            setMessages([...chats])
        }
    }, [dispatch, chats])

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (chatText.trim() === '') {
            return null
        }
        const chatMessage = { UserID: user.id, UserName: user.name, text: chatText }
        dispatch(createChatByBoardID(currBoard._id, chatMessage, token))
        setMessages([...Messages, chatMessage])
        socket.emit("sendUserMessage", { UserID: user.id, UserName: user.name, text: chatText, boardID: currBoard._id })
        setChatText('')
    }

    const handleChatControl = () => {
        showChat === true ? setShowChat(false) : setShowChat(true)
        setShowOnlineUser(false)
        setShowBadge(false)
    }

    const onlineUserHandler = () => {
        setShowOnlineUser(!showOnlineUsers);
        currBoard._id && socket.emit("getBoardMembers", (currBoard._id))
    }

    const lastMRef = useRef()


    return (
        <div className="ChatMessaegeWrapper" ref={chatMessageRef}>
            {showChat &&
                <div className="ChatMessage">
                    <ScrollToBottom id="MessageWrapper" className="MessageWrapper">
                        {Messages.map((chat) =>
                            chat.UserID === user.id ? (
                                <div id="Message" className="Message toMe" ref={lastMRef}>
                                    <strong className="MessageUsername" >You:</strong><span className="MessageText">{chat.text}</span>
                                    <span className="dateFormatechat">{moment(chat.createdAt).format('DD-MM-YYYY h:mm a')}</span>
                                </div>) : (
                                <div className="Message toOther" ref={lastMRef}>
                                    <strong className="MessageUsername">{chat.UserName}:</strong><span className="MessageText">{chat.text}</span>
                                    <span className="dateFormatechat">{moment(chat.createdAt).format('DD-MM-YYYY h:mm a')}</span>
                                </div>)
                        )}
                    </ScrollToBottom>
                    <form className="chatForm" onSubmit={handleChatSubmit}>
                        <div className="onlineUsers" onClick={() => onlineUserHandler()}><i className="fa fa-users" /></div>
                        <input placeholder="Enter Message ..." type="text" value={chatText} onChange={(e) => setChatText(e.target.value)} />
                        <button type="submit" ><i className="fa fa-paper-plane-o" /></button>
                    </form>
                </div>
            }
            <div className="ChatControl"
                onClick={handleChatControl}>
                {showBadge && <p className="chatBadge"></p>}
                {!showChat ?
                    <i className="fa fa-comments-o" />
                    :
                    <i className="fa fa-times" />
                }
            </div>
            {showOnlineUsers &&
                <div className="onlineUsersWrapper">
                    <h3 className="onlineHeader"><p className="onlineIcon"></p>Online Users</h3>

                    <div className="UserWrapper" key={user.id}>
                        <i className="fa fa-user-circle-o" />
                        <h4 className="onlineUserName">
                            You
                        </h4>
                    </div>
                    {onlineUsers.map((users) => (
                        user.id !== users.UserID && (
                        <div className="UserWrapper" key={users.UserID}>
                            <i className="fa fa-user-circle-o" />
                            <h4 className="onlineUserName">
                                {user.id === users.UserID ? "You" : users.UserName}
                            </h4>
                        </div>
                        )
                    ))}
                </div>
            }
        </div>
    )
}

export default ChatMessage
