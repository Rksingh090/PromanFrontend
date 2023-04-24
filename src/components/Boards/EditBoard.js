import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/Boards.css";
import {ChromePicker} from 'react-color'
import { trim } from "lodash";
import { updateBoardById } from "../../actions/actionCreators/boardActions";

const EditBoard = ({ updateBoard, setEditable}) => {

    const {token} = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const [boardID, setBoardID] = useState("");
    const [boardTitle, setBoardTitle] = useState("");
    const [boardDescription, setBoardDescription] = useState("");
    const [backgroundChoose, setBackgroundChoose] = useState("rgb(10, 67, 141)");

    const [showColorPicker, setShowColorPicker] = useState(false)


    useEffect(() => {
        if(updateBoard !== ''){
            setBoardID(updateBoard._id)
            setBoardDescription(updateBoard.description)
            setBoardTitle(updateBoard.name)
            setBackgroundChoose(updateBoard.Background.color)
        }
    }, [boardID, updateBoard])

    const submitHandler = (e) => {
        e.preventDefault();
        const s = trim(boardTitle);
        if (s === "") return;

        const postBoardReq = {
            name: boardTitle,
            description: boardDescription,
            Background: {
                color: backgroundChoose,
            },
        };
        dispatch(updateBoardById(boardID, postBoardReq, token));
        setBoardTitle("");
        setBoardDescription("")
        setEditable()
    };

    return (
        <div className="newBoardFormWrapper">
            <form className="newBoardForm" onSubmit={submitHandler}>
                <h2>Create New Board</h2>
                <span style={{ color: "#d33" }}></span>
                <div>
                    <lable>Board Name</lable>
                    <input type="text" placeholder="Board Name.."
                        value={boardTitle}
                        onChange={(e) => setBoardTitle(e.target.value)}
                    />
                </div>
                <div>
                    <lable>Board Description</lable>
                    <textarea name="boardDescription"
                        placeholder="Board Description..."
                        onChange={(e) => setBoardDescription(e.target.value)}
                        width="100%" rows="6" value={boardDescription}>
                        {boardDescription}
                    </textarea>
                </div>
                <span className="backgroundColorChoose"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    style={{ backgroundColor: backgroundChoose }}>Choose Background</span>
                <button type="submit" className="createnewboardbtn" onClick={submitHandler}>Update</button>
                <button type="button" className="cancleupdateboardbtn" onClick={setEditable} >Back</button>
            </form>
            {showColorPicker &&
                <p className="colorSelector">
                    <ChromePicker color={backgroundChoose}
                        onChange={(color) => setBackgroundChoose(color.hex)} />
                    <button onClick={() => setShowColorPicker(false)}>Save</button>
                </p>
            }
        </div>
    )
}

export default EditBoard