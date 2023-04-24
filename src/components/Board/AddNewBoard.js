import React from "react";
const AddNewBoard = ({newBoardTitle,  newBoardTitleChangeHandler, newBoardSubmitHandler}) => {
    
    return (
        <div className="AddNewBoardWrapper">
            <form method="post" onSubmit={newBoardSubmitHandler} className="AddNewboardForm">
                <input type="text"  placeholder="Board Name" value={newBoardTitle} onChange={newBoardTitleChangeHandler} />
                <input type="submit" value="Create" title="Create New Board" />
            </form>
        </div>
    )
}

export default AddNewBoard;
