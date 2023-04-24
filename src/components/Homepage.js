import React, { useEffect } from 'react';
import boardImage from '../assets/images/board.png'
import firstImp from '../assets/images/proman-signup.png'
import { useNavigate } from 'react-router';
import '../styles/homepage.css'
import { useSelector } from 'react-redux';

const Homeapp = () => {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.user)

    useEffect(() => {
        const token = localStorage.getItem('auth-token')
        if (token !== '' && user.username !== undefined) {
            navigate(`/${user.username}/boards`)
        }
    }, [navigate, user])


    return (
        <>
            <section className="sec-1-home">
                <div className="nav-home">
                    <div className="brand-name-home">
                        <img className="logo-home" src="https://www.ontrick.xyz/favicon.ico" alt="favicon" />
                        <h3 className="app-name-home">
                           ProMan
                        </h3>
                    </div>
                    <div className="log-sign-btn">
                        <button id="open_modal_signup" className="sign-up-home anchor" onClick={() => navigate('/auth')}>Sign In</button>
                    </div>
                </div>
                <div className="landing-home">
                    <div className="rowLandingHome">
                        <div className="column1home">
                            <div className="main-heading-home">
                                <div>
                                    <h2 className="headline-home" >ProMan helps you to grow faster and work smarter.</h2>
                                    <p className="desc-home ">Collaborate, manage projects, and reach new productivity peaks. From
                                        high rises to the
                                        home office, the way your team works is unique-accomplish it all with ProMan.</p>
                                </div>
                                <div className="sign-up-2-btn">
                                    <form autoComplete="off">
                                        <button type="submit" className="sign-up-2" id="open_auth"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                navigate('/auth')
                                            }}>Sign Up</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="homePageImage">
                            <div>
                                <img src={firstImp} className="signup-img-home" alt="Logo Top" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="sec-2-home">
                <div className="block-2-home">
                    <div className="second-para-home">
                        <h3>Work Together - It's more than a workplace. </h3>
                        <p>Start with a ProMan lists, cards, and Other tools. Customize and expand with more features as your
                            teamwork
                            grows. Manage projects, organize tasks, and build team spirit - all in one place.</p>
                        <p className="my-5">
                            <button href="#" className="lets_start" >Let's Start <i
                                className="fa fa-long-arrow-right"></i> </button>
                        </p>
                    </div>
                    <div className="block2-div2">
                        <img src={boardImage} className="block-2-img-home" alt="Board Middle" />
                    </div>
                    <div>
                        <p className="block2-para-3-home">Join over 50+ members in a single project and take advantage of team work.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
export default Homeapp;