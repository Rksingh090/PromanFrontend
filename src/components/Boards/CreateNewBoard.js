import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { trim } from "lodash";
import { ChromePicker } from 'react-color'
import { createNewBoard } from "../../actions/actionCreators/boardActions";
import AlertNotification from "../Helpers/AlertNotification";

const CreateNewBoardComponent = () => {
    const dispatch = useDispatch();

    const { token, user, } = useSelector((state) => state.user);
    const [formError, setFormError] = useState({type: "",msg: ""})

    const [boardTitle, setBoardTitle] = useState("");
    const [boardDescription, setBoardDescription] = useState("");
    const [backgroundChoose, setBackgroundChoose] = useState("rgb(10, 67, 141)");
    const [showColorPicker, setShowColorPicker] = useState(false)

    const [showAlert, setShowAlert] = useState(false)
    const [alertText, setAlertText] = useState("")
    const [alertType, setAlertType] = useState("")

    const submitHandler = (e) => {
        e.preventDefault();
        const s = trim(boardTitle)
        const d = trim(boardDescription);
        if (s === "") return setFormError({type: "error" ,msg: "Enter Board Name"});
        if (d === "") return setFormError({type: "error" ,msg: "Enter Board Description"});

        const postBoardReq = {
            name: boardTitle,
            userId: user.id,
            description: boardDescription,
            Background: {
                color: backgroundChoose,
            },
        };
        dispatch(createNewBoard(postBoardReq, token));
        setBoardTitle("");
        setBoardDescription("")
        setShowAlert(true)
        setAlertText("Board Created Successfully !")
        setAlertType("success")
    };

    return (
        <div className="newBoardFormWrapper">
            <form className="newBoardForm" onSubmit={submitHandler}>
                <h2>Create New Board</h2>
                <span style={{ color: (formError && formError.type === "success" ) ?  "#44DD11": "#D22"}}>{formError.msg}</span>
                <div>
                    <label>Board Name</label>
                    <input type="text" placeholder="Board Name.."
                        value={boardTitle} onChange={(e) => setBoardTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Board Description</label>
                    <textarea name="boardDescription" value={boardDescription} onChange={(e) => setBoardDescription(e.target.value)}
                        placeholder="Board Description..." width="100%" rows="6"></textarea>
                </div>
                <span onClick={() => setShowColorPicker(!showColorPicker)} className="backgroundColorChoose" style={{ backgroundColor: backgroundChoose }}>Choose Background</span>
                <button className="createnewboardbtn" onClick={submitHandler}>Create</button>
            </form>
            {showColorPicker &&
                <p className="colorSelector">
                    <ChromePicker color={backgroundChoose} onChange={(color) => setBackgroundChoose(color.hex)} />
                    <button onClick={() => setShowColorPicker(false)}>Save</button>
                </p>
            }
            {showAlert && 
            <AlertNotification alertText={alertText} alertType={alertType} handleClose={() => setShowAlert(false)} />
            }
        </div>
    )
}

export default CreateNewBoardComponent