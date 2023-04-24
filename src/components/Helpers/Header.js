import React from 'react'
import {  useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../actions/actionCreators/userActions'
import '../../styles/Header.css'
import {FiLogOut} from 'react-icons/fi'

export default function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  return (
    <>
      <div className="HeaderContainer">
        <div className="HeaderLogo">
          <h4 className="BrandName">ProMan</h4>
        </div>
        <div>
          <h2 className="BoardsHeader">Select Board</h2>
        </div>
        <div className="HeaderLogOut">
          <button
          onClick={() => {
            dispatch(logoutUser())
            localStorage.setItem('auth-token','')
            navigate('/')
          }}>LogOut <FiLogOut /></button>
        </div>
      </div>
    </>
  )
}
