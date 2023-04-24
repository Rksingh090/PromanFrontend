import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from '../App'
import Board from '../components/Board/Board'
import Auth from '../components/Auth/Auth'
import NotFound from '../components/Helpers/NotFound'

import {
  checkTokenValidity,
  fetchUserInfo,
} from '../actions/actionCreators/userActions'
import Homeapp from '../components/Homepage'
import ProfilePage from '../components/Profile/ProfilePage'

const AppRouter = () => {
  const { isValid, userRequest, token } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isValid) {
      dispatch(fetchUserInfo(token))
    }
  }, [isValid, token, dispatch])

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    let token = localStorage.getItem('auth-token')
    if (token === null || token === '') {
      localStorage.setItem('auth-token', '')
      token = ''
    }
    dispatch(checkTokenValidity(token))
    //* eslint-disable next-line *//
  }, [dispatch])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Homeapp />} />
          <Route path="/auth" exact element={<Auth />} />
          <Route path="/:username/boards" element={<App />} />
          <Route path="/profile/:UserID" element={<ProfilePage />} />
          <Route path="/b/:id/:name" element={<Board />} />
          {!userRequest || !isValid ? <Route element={<NotFound />} /> : null}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default AppRouter
