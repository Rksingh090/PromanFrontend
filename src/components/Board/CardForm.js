import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//actions
import {
  deleteCardById,
  fetchCardbyID,
  updateCardById,
} from "../../actions/actionCreators/cardActions";

//utilities
import { ChromePicker } from "react-color";
import Datetime from "react-datetime";
import moment from "moment";

//icons
import "react-datetime/css/react-datetime.css";
import {
  AiOutlinePlusCircle,
  AiOutlineClose,
  AiOutlineShareAlt,
  AiOutlineTag,
  AiOutlineClockCircle,
  AiOutlineDelete
} from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { MdCancel, } from "react-icons/md";

function CardForm({ cardFormVisibleHandler, cardID, setListDragDisable }) {
  const { oneCard } = useSelector((state) => state.cards);
  const {user, token} = useSelector((state) => state.user)
  const dispatch = useDispatch();

  const [cardName, setCardName] = useState("");
  const [cardDescription, setCardDescription] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDD, setShowDD] = useState(true)
  const [deadDate, setDeadDate] = useState(Date());
  const [deadDateFormat, setDeadDateFormat] = useState("");
  const [colorPicker, setColorPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [topBordercolor, setTopBorderColor] = useState("");
  const [ddColor, setDDColor] = useState("")

  useEffect(() => {
    dispatch(fetchCardbyID(cardID));
  }, [cardID, dispatch]);

  useEffect(() => {
    setCardName(oneCard.name);
    setCardDescription(oneCard.description);
    setTopBorderColor(oneCard.topBorderColor);
    makeDateFormate(oneCard.deadLineDate)
  }, [oneCard]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateCardById(cardID, { name: cardName, description: cardDescription })
    );
    dispatch(fetchCardbyID(cardID));
    cardFormVisibleHandler();
  };

  const makeDateFormate = (date) => {
    if(date !== undefined){
      setDeadDate(date);
      var isAfter = moment(date).isAfter(Date.now())
      if(!isAfter){
        setDDColor("red")
      }else{
        setDDColor("#333333")
      }
      const rtime = moment(date).fromNow();
      setDeadDateFormat(rtime)
      setShowDD(true)
    }else{
      setShowDD(false)
    }
  }
 
  const makeDateFormate2 = (date) => {
    setDeadDate(date);
    var isAfter = moment(date).isAfter(Date.now())
    if(!isAfter){
      return alert("Select the time from now! ");
    }
    setShowDD(true)
    const rtime = moment(date).fromNow();
    setDeadDateFormat(rtime)
  }
  const handleAddDD = () => {
    var isAfter = moment(deadDate).isAfter(Date.now())
    if(!isAfter){
      alert("Please Select next day or time from now.")
      setShowDatePicker(false);
    }else{
      dispatch(updateCardById(cardID,{deadLineDate: deadDate, isNFSend: false}))
      setShowDatePicker(false);
    }
  }
 
  return (
    <div className="listFormWrapper" draggable="false">
      <div
        className="listformWarapper2"
        style={{ borderTop: `4px solid ${topBordercolor}` }}
      >
        <div>
          <form method="POST" className="addListform" onSubmit={submitHandler}>
            <label>
              <i className="fa fa-caret-right mx-2"></i> Title
            </label>
            <input
              type="text"
              name="title"
              className="title"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="name"
            />
            <label>
              <i className="fa fa-bars mx-2"></i> Description
            </label>
            <textarea
              rows="7"
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              placeholder="Description"
            ></textarea>

            <input
              type="submit"
              value="Save"
              className="AddListformSubmit"
              style={{
                backgroundColor:
                  topBordercolor !== "" ? topBordercolor : "#fafafa",
                color: topBordercolor !== "" ? "#EEE" : "#333",
              }}
            />
          </form>
          {showDD &&
          <div>
            <span style={{color: ddColor}}>
              <AiOutlineClockCircle /> Deadline:
            </span>
            <span style={{color: ddColor}}> {deadDateFormat}</span>
          </div>}
        </div>
        <div className="formHelpers">
          <div className="tooltipsbtns">
            <p>
              <i className="fa fa-plus"></i>ADD TO CARD
            </p>
            <div className="add_members">
              <span>
                <AiOutlineShareAlt /> Share
              </span>
            </div>
            <div className="add_labels">
              <span>
                <AiOutlineTag /> Labels
              </span>
            </div>
            <div className="aa_friends">
              <span>
                <FaUserFriends /> Add Friend
              </span>
            </div>
            <div className="add_dates" onClick={() => setShowDatePicker(true)}>
              <span>
                <AiOutlineClockCircle />
                Deadline
              </span>
            </div>
            <div
              className="colorPicker"
              onClick={() => setColorPicker(!colorPicker)}
            >
              <p className="colorPickerBox">
                <span
                  className="square"
                  style={{
                    backgroundColor:
                      topBordercolor !== "" ? topBordercolor : "inherit",
                  }}
                ></span>
                Ac. Color
              </p>
            </div>
            {!showDeleteConfirm && (
              <div
                className="delete_card"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <span>
                  <AiOutlineDelete />
                  Delete
                </span>
              </div>
            )}
            {showDeleteConfirm && (
              <span className="confirmDeleteCard">
                <span
                  onClick={() => {
                    dispatch(deleteCardById(cardID));
                    cardFormVisibleHandler(false);
                    setListDragDisable(false);
                  }}
                >
                  Confirm
                </span>
                <span onClick={() => setShowDeleteConfirm(false)}>Cancle</span>
              </span>
            )}
          </div>
        </div>
        <div className="utils">
          {showDatePicker && (
            <div className="datePickerWrapepr">
              <Datetime
                input={false}
                className="datePicker"
                
                closeOnClickOutside={false}
                onChange={(date) => {
                  makeDateFormate2(moment(date).toISOString())
                }}
                mindate={Date.now()}
              />
              <button
                type="button"
                onClick={() => handleAddDD()}
                className="datePickSaver"
              >
                <AiOutlinePlusCircle /> ADD
              </button>
              <button
                type="button"
                onClick={() => {setShowDatePicker(false)
                makeDateFormate2(oneCard.deadLineDate)}}
                className="datePickSaver"
              >
                <MdCancel /> Cancle
              </button>
            </div>
          )}
          {colorPicker && (
            <div className="swatches">
              <ChromePicker
                color={topBordercolor}
                onChange={(color) => setTopBorderColor(color.hex)}
              />
              <button
                onClick={() => {
                  setColorPicker(false);
                  dispatch(
                    updateCardById(cardID, { topBorderColor: topBordercolor })
                  );
                  dispatch(fetchCardbyID(cardID));
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>
        <span
          className="clsBtnWrapper"
          onClick={() => {
            cardFormVisibleHandler(false);
            setListDragDisable(false);
          }}
        >
          <AiOutlineClose className="closeBTN" />
        </span>
      </div>
    </div>
  );
}

export default CardForm;
