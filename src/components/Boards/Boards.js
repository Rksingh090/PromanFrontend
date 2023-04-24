import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

//actions
import { fetchAllActivitiesOfUser } from "../../actions/actionCreators/activityActions";
import { fetchAllBoards } from "../../actions/actionCreators/boardActions";
import { fetchNotificationByUserID } from "../../actions/actionCreators/notificationActions";
 
//styles
import "../../styles/Boards.css";

//components
import CreateNewBoardComponent from "./CreateNewBoard";
import DisplayBoards from "./DisplayBoards";
import BoardsActivity from './BoardsActivity'
import Settings from "../Settings/Settings";
import Notifications from "./Notifications";

// icons

import {BiLeftArrowAlt} from 'react-icons/bi'
import Sidemenu from "./Sidemenu";
import Analytics from "../Analytics/Analytics";

export default function Boards() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {username} = useParams()
  const [sWidth, setSWidth] = useState(22)
  const [activeComponent, setActiveComponent] = useState("Boards")
  const { isValid, user, token, tokenRequest } = useSelector((state) => state.user);

  useEffect(() => {
    document.title = `Home | Proman`;
  }, [dispatch, user, token]);

  useEffect(() => {
    if(user.id !== undefined){
      dispatch(fetchAllActivitiesOfUser(user.id, token))
      dispatch(fetchAllBoards(token));
      dispatch(fetchNotificationByUserID(user.id, token))
    }
  },[dispatch, user, token])

  useEffect(() => {
    if(user.username !== undefined){
      if(user.username !== username){
        navigate(`/${user.username}/boards`)
      }
    }
  },[dispatch, user, token, navigate, username])

    return (
      <>
        {isValid || tokenRequest ? (
          <div className="boardsContainer">
            <div className="boardsInner">
              <Sidemenu sWidth={sWidth} getActiveComponent={(comp) => setActiveComponent(comp)} />
              <div className="boardsArea">
                {activeComponent === "Boards" && <DisplayBoards handleClick={() => setActiveComponent("newBoards")} />}
                {activeComponent === "newBoards" && (
                  <CreateNewBoardComponent />
                )}
                {activeComponent === "Notification" && <Notifications />}
                {activeComponent === "Analytics" && <Analytics />}
                {activeComponent === "Settings" && <Settings />}
                {activeComponent === "BoardsActivity" && <BoardsActivity />}
              </div>
            </div>
          </div>
        ) : (
          navigate("/")
        )}
      </>
    );
  }
