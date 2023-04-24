import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateUser } from '../../actions/actionCreators/userActions'
import '../../styles/ProfilePage.css'
import {BiArrowBack} from'react-icons/bi'

function ProfilePage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user,errorMessage, token } = useSelector((state) => state.user)

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [currPassword, setCurrPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [formError, setFormError] = useState('')
    const [showChangePassword, setShowChangePassword] = useState(false)

    useEffect(() => {
        setName(user.name)
        setUsername(user.username)
    }, [user])

    useEffect(() => {
        setFormError("")
    }, [])

    useEffect(() => {
        if(errorMessage !== undefined){
            setFormError(errorMessage)
        }
    },[errorMessage])
    useEffect(() => {
        const localToken = localStorage.getItem('auth-token')
        if (localToken === null || localToken === '') {
            navigate('/')
        }
    }, [navigate])

    const profileUpdatehandler = (e) => {
        e.preventDefault()
        const params = {
            name: "",
            username: "",
            currPassword: "",
            newPassword: ""
        }
        if(name.trim() !== '' && user.name !== name){
            params.name = name.trim()
        }
        if(username.trim() !== '' && user.username !== username){
            params.username = username.trim()
        }
        if(currPassword.trim() !== '' && newPassword.trim() !== ''){
            if(currPassword !== newPassword){
                params.currPassword = currPassword.trim()
                params.newPassword = newPassword.trim()
            }else{
                setFormError("Both Passwords are same.")
            }
        }
        if(currPassword.trim() !== '' && newPassword.trim() === ''){
            setFormError("Enter New Password")
        }
        if(currPassword.trim() === '' && newPassword.trim() !== ''){
            setFormError("Enter New Password")
        }

        dispatch(updateUser(user.id, params, token))
    } 
    return (
        <div className="profilePageContainer">
            <span onClick={() => {setFormError(""); navigate(-1); }} className="ArrowbackProfile"><BiArrowBack /> </span>
            <div className="profileWrapper">
                <form autoComplete={'off'} onSubmit={profileUpdatehandler}>
                    <h3>UPDATE PROFILE</h3>
                    {formError !== '' && <span className="errorForm">{formError }</span> }
                    <input type="text" placeholder="Name"
                    value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
                    <input type="text" placeholder="UserName"
                    value={username} onChange={(e) => setUsername(e.target.value)} />
                    <span onClick={() => setShowChangePassword(!showChangePassword)} className="showPasswordField">
                        Change Password
                    </span>

                    {showChangePassword && <>
                        <input type="password" value={currPassword || ''} 
                        onChange={(e) => setCurrPassword(e.target.value)} placeholder="Current password" />
                        <input type="password" value={newPassword || ''} 
                            onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
                    </>
                    }
                    <button type="submit" >Update</button>
                </form>
            </div>
            <span className="getBalls1"></span>
            <span  className="getBalls2"></span>
        </div>
    )
}

export default ProfilePage
