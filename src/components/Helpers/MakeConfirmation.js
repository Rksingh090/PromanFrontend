import React from 'react'
import '../../styles/MakeConfirmation.css'

function MakeConfirmation({
    confirmText,
    okHandler,
    cancleHandler,
    okBtnText
}) {
    return (
    <div className="makeConfirmationWrapper">
        <div className="askforConfirmation">
            <h4 className="confirmationText">{confirmText}</h4>
            <div className="toolsBtn">
                    <button className="confirmCancle" onClick={cancleHandler}>Cancle<i className="fa fa-ban" /></button>
                <button className="confirmOk" onClick={okHandler}>{okBtnText} <i className="fa fa-check-circle-o" /></button>
            </div>
        </div>
    </div>
    )
}

export default MakeConfirmation
