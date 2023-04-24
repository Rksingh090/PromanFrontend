import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../../actions/actionCreators/userActions'
import '../../styles/Auth.css'
import {BiArrowBack} from 'react-icons/bi'
import {FiLogIn, FiLock} from 'react-icons/fi'
import {AiOutlineLock, AiOutlineLogin, AiOutlineUser} from 'react-icons/ai'
import {MdShortText} from 'react-icons/md'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')


  const [loginUserName, setLoginUserName] = useState("");
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupUserName, setSignupUserName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const { token, user, successLogin, loginError, requestLogin, requestRegister, successRegister, registerError  } = useSelector(
    (state) => state.user,
  )


  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = `Authentication | Proman`  
  }, [])


  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if(token !== '' && user.username !== undefined){
      navigate(`/${user.username}/boards`)
    }
  }, [navigate, user])

  useEffect(() => {
    setLoginUserName('')
    setLoginPassword('')
    setSignupName('')
    setSignupUserName('')
    setSignupPassword('')
    setSignupConfirmPassword('')
  },[])

  useEffect(() => {
    setTimeout(() => { 
      setError('')
    }, 2000)
  }, [loginError,registerError])

  useEffect(() => {
    if (!requestLogin) {
      if (token !== '' && successLogin) {
        localStorage.setItem('auth-token', token)
        setError('Login Success')
      }else if(!token && !successLogin){
        setError(loginError)
      }
    }
  }, [token, successLogin, requestLogin, loginError, navigate, user])

  const loginHandler = (e) => {
    setError('')
    e.preventDefault()
    const loginReq = { username: loginUserName, password: loginPassword }
    dispatch(loginUser(loginReq))
  }

  useEffect(() => {
    if (!requestRegister && successRegister) {
      setError('Successfully Registered ✔')
      localStorage.setItem('auth-token', '')
      setIsLogin(true);
    } else if (!requestRegister && !successRegister) {
      setError(registerError)
    }
  }, [requestRegister, successRegister, registerError])

  const signupHandler = (e) => {
    setError('')
    e.preventDefault()
    const newUser = {name: signupName, username: signupUserName, password: signupPassword, passwordCheck: signupConfirmPassword}
    dispatch(registerUser(newUser))
  }

  return (
    <>
      <div className="MainContainer">
        <span className="arrowBackAuth" onClick={() => navigate.goBack()}><BiArrowBack /></span>
        <div className="wrapper">
            {isLogin ? (
              <div className="loginFormWrapper">
                <form className="loginForm" onSubmit={loginHandler} autoComplete="off">
                  {(loginError && error !== '' )&& <span className="loginError">{error}</span>}
                  <h2 className="loginFormHeader">Login to Work With Us..</h2>
                  <div className="FormInputIcons">
                    <span className="inputIcon"><AiOutlineUser /></span>
                    <input name="loginUsername" type="text" placeholder="Username" value={loginUserName} onChange={(e) => setLoginUserName(e.target.value)} />
                  </div>
                  <div className="FormInputIcons">
                    <span className="inputIcon"><FiLock /></span>
                    <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}/>
                  </div>
                  <button type="submit" className="loginSubmitHandler" >LOGIN<FiLogIn /> </button>
                </form>
                <div className="AuthSignUpWrapper">
                  <h2>Don't have a account ?</h2>
                  <p>Create new account to get started with us.</p>
                  <button className="GotoSignup" onClick={() => setIsLogin(false)} >SignUp</button>
                  <span className="gotosignup_circle1"></span>
                  <span className="gotosignup_circle2"></span>
                </div>
              </div>
            ) : (
              <div className="signupFormWrapper">
                <div className="AuthLogInWrapper">
                  <h2>Already an User!</h2>
                  <p>Login to start using the application...</p>
                  <button className="GotoLogin" onClick={() => setIsLogin(true)} >Login</button>
                  <span className="gotosignup_circle3"></span>
                  <span className="gotosignup_circle4"></span>
                </div>
                <form className="signUpForm" onSubmit={signupHandler} autoComplete="off">
                  {(registerError && error !== '')&& <span className="signupError">{error}</span>}
                  <h2 className="signupFormHeader">Signup to start with Us..</h2>
                  <div className="FormInputIcons">
                    <span className="inputIcon"><MdShortText /></span>
                    <input type="text" placeholder="Name" value={signupName} onChange={(e) => setSignupName(e.target.value)} />
                  </div>
                  <div className="FormInputIcons">
                    <span className="inputIcon"><AiOutlineUser /></span>
                    <input type="text" placeholder="Username" value={signupUserName} onChange={(e) => setSignupUserName(e.target.value)} />
                  </div>
                  <div className="FormInputIcons">
                    <span className="inputIcon"><AiOutlineLock /></span>
                    <input type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                  </div>
                  <div className="FormInputIcons">
                    <span className="inputIcon"><AiOutlineLock /></span>
                    <input type="password" placeholder="Confirm Password" value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} />
                  </div>
                  <button type="submit" value="SignUp" className="signupSubmitHandler">SIGN UP<AiOutlineLogin /></button>
                </form>   
                </div>
            )}
        </div>
      </div>
    </>
  )
}
