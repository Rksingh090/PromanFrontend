import React, { useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

const BoardsActivity = () => {
  const {user} = useSelector((state) => state.user);
  const {allActivity} = useSelector((state) => state.activities)
  
  const ActivityItem = ({data, animDuration}) => {   
      return (
          <div className="actvityItem">
            <span className="ActivityuserIcon">{(user.name).slice(0,1)}</span>
            <div className="activityBody">
              <div className="activityHeader">
                  <strong>{user.name}</strong> 
                  <p>{data.text}
                </p>
              </div>
              <div className="activityFooter">
                <span className="activityDate">{moment(data.createdAt).format("DD/MM/YYYY hh:mm A")}</span>
              </div>
            </div>
          </div>
      )
  }
    
  const reverseActivity = [...allActivity.reverse()]

  
  return (
    <div className={"boardsActivityWrapper"}>
      <h2 className="AllActivityH2">All Activities</h2>
      <div className={"boardAcitivities"}>
          {reverseActivity.reverse().map((ad,index) => {
              return (
                  <ActivityItem animDuration={index+1} data={ad} key={index} />
            )
          })}
      </div>
      {reverseActivity.length === 0 && (
                <div className="noBoardMessage">
                  No Activities Yet ...!!
                </div>
      )}
    </div>
  );
};

export default BoardsActivity;
