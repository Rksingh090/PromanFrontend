import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//css
import "../../styles/Boards.css";
//icons
import { AiOutlineBell, AiOutlineLogout, AiOutlineMenu } from "react-icons/ai";
import { BsClipboardData, BsFilePlus } from 'react-icons/bs'
import { FiActivity, FiSettings, FiUser } from 'react-icons/fi'
import { TbBrandGoogleAnalytics } from "react-icons/tb";
//actions
import { logoutUser } from "../../actions/actionCreators/userActions";

const Sidemenu = ({ getActiveComponent }) => {

    const [activeComponent, setActiveComponent] = useState("Boards");

    const [showIConsOnly, setShowIConsOnly] = useState();
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleMenuStateChange = (menuState) => {
        setShowIConsOnly(!showIConsOnly);
    }

    useEffect(() => {
        getActiveComponent(activeComponent)
    }, [activeComponent])

    const MenuItem = ({ active, Component, to, text }) => {
        const handleClick = () => {
            if (to) navigate(to);
            else setActiveComponent(active);
        }
        return (
            <li title={text} className={activeComponent === active ? "ActiveLink menuLink" : "InactiveLink menuLink"}
                onClick={handleClick} >
                <span>
                    {Component}
                    <span className={showIConsOnly ? "collapsMenu" : "menuText"} >{text}</span>
                </span>
            </li>
        )
    }

    return (
        <>
            <div className="boardsSideMenu" style={{ width: showIConsOnly ? "70px" : "240px" }}>
                <div className="boardsSideMenuInner" style={{ width: showIConsOnly ? "50px" : "200px" }}>
                    <div className="menuProfile">
                        <AiOutlineMenu size={18} onClick={() => handleMenuStateChange(showIConsOnly)} />
                    </div>
                    <div className="boardsSideContainer">
                        <div className="sideMenuInner">
                            <div className="menuItems">
                                <ul>
                                    <MenuItem active={"Boards"} text="All Boards" Component={<BsClipboardData />} />
                                    <MenuItem active={"newBoards"} text={"New Board"} Component={<BsFilePlus />} />
                                    <MenuItem active={"BoardsActivity"} text={"Boards Activity"} Component={<FiActivity />} />
                                    <MenuItem active={"Notification"} text={"Notification"} Component={<AiOutlineBell />} />
                                    <MenuItem active={"Analytics"} text={"Analytics"} Component={<TbBrandGoogleAnalytics />} />
                                    <MenuItem active={"Settings"} text={"Settings"} Component={<FiSettings />} />
                                    <MenuItem active={"Profile"} text={"Profile"} to={`/profile/${user.id}`} Component={<FiUser />} />
                                </ul>
                            </div>
                        </div>

                        <button className="logOut" onClick={() => {
                            dispatch(logoutUser());
                            localStorage.setItem("auth-token", "");
                            navigate("/");
                        }}>
                            <span>
                                {!showIConsOnly && (<span style={{ marginRight: 15 }}>LogOut</span>)}
                                <AiOutlineLogout />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidemenu;