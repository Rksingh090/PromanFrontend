import React, { useEffect, useState } from 'react'
import '../../styles/AlertNotification.css'
import {MdClose} from 'react-icons/md'
const AlertNotification = ({alertText, handleClose, alertType}) => {
    
    const [bg, setBg] = useState("rgb(255, 42, 88)")
    useEffect(() => {
        setTimeout(() => {
            handleClose()
            null
        }, 5000)
    }, [])

    useEffect(() => {
       if(alertType === 'warning'){
           setBg("rgb(250, 215, 61)")
       }
       if(alertType === 'success'){
           setBg("rgb(58, 204, 0)")
       }
    }, [alertType])

    return (
        <>
            <div className="anWrapper" id="anWrapper" draggable="true" style={{background: bg }}>
                <div className="anInner">
                    <p>{alertText}</p>
                </div>
                <span className="anTimerCounter"></span>
                <MdClose className="anClose" onClick={handleClose} />
            </div>
        </>
    )
}

export default AlertNotification
