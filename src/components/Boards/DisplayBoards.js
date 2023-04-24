import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
    deleteBoardById,
} from "../../actions/actionCreators/boardActions";
import { createNewActivity } from "../../actions/actionCreators/activityActions";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import EditBoard from "../Boards/EditBoard";
import moment from "moment";

const DisplayBoards = ({handleClick}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { boards } = useSelector((state) => state.boards);
    const { token, user } = useSelector((state) => state.user);
    const [isEditable, setIsEditable] = useState(false)
    const [editBoard, setEditBoard] = useState('')

    const editableBoardHandler = (board) => {
        setIsEditable(true);
        setEditBoard(board)
    }

    const toBoard = (e, board) => {
        if (e.target !== e.currentTarget) return;
        navigate(`/b/${board._id}/${board.name}`)
        setIsEditable(false)
    }

    var reversedBoards = [...boards.reverse()]
    return (
      <>
        {!isEditable ? (
          <div className="AllBoardsCards">
            <h2 className="AllBoardsCardsH2">All Boards</h2>
            <div className="allBoardsWrapper">
              {reversedBoards.reverse().map((board) => {
                const date = new Date(board.createdAt);
                const strdate = moment(date).format("DD-MM-YYYY hh:mm a");
                return (
                  <div
                  key={board._id}
                    className={`boardsCard`}
                    onClick={(e) => toBoard(e, board)}
                  >
                    <div
                      onClick={(e) => toBoard(e, board)}
                      className="boardsCardControl"
                      style={{ backgroundColor: board.Background.color }}
                    >
                      <AiOutlineEdit
                        onClick={() => editableBoardHandler(board)}
                      />
                      <AiOutlineDelete
                        onClick={() => {
                          dispatch(deleteBoardById(board._id, token));
                          dispatch(
                            createNewActivity(
                              {
                                text: `${board.name} was deleted`,
                                boardId: board._id,
                                UserId: user.id
                              },
                              token
                            )
                          );
                        }}
                      />
                    </div>
                    <h4 onClick={(e) => toBoard(e, board)}>{board.name}</h4>
                    <p onClick={(e) => toBoard(e, board)}>
                      {board.description && board.description.length > 25
                        ? board.description.slice(0, 22) + "..."
                        : board.description}
                    </p>
                    <p
                      onClick={(e) => toBoard(e, board)}
                      style={{ fontSize: "14px" }}
                    >
                      {strdate}
                    </p>
                  </div>
                );
              })}
            </div>
              {reversedBoards.length === 0 && (
                <div className="noBoardMessage">
                  You have no Boards, <span className="emptyAction" onClick={() => handleClick()}>Create New One !</span>
                </div>
              )}
          </div>
        ) : (
          <EditBoard
            updateBoard={editBoard}
            setEditable={() => setIsEditable(false)}
          />
        )}
      </>
    );}

export default DisplayBoards