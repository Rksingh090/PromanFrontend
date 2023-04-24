import React, { useState } from 'react'
import '../../styles/Settings.css'
import AddBoardMember from './AddBoardMember'
import AddFriend from './AddFriend'

const Settings = () => {
    

    return (
        <div className="settingsWrapper">
            <h2 style={{textAlign: "center"}}>Settings</h2>
            <hr />
            <AddFriend />
            <AddBoardMember />
        </div>
    )
}

export default Settings
