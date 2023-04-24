import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { updateBoardById } from '../../actions/actionCreators/boardActions'

export default function BoardHeader2({ currBoardName, currBoardId }) {

  const dispatch = useDispatch();
  const { id, name} = useParams()

  const [boardEditable, setBoardEditable] = useState(false);
  const [boardInput, setBoardInput] = useState(name);
  const {token, user} = useSelector((state) => state.user);

  useEffect(() => {
    if(name && id) {
      setBoardInput(name)
    }
  },[id,name])

  const boardNameHandler = (e) => {
    e.preventDefault();
    dispatch(updateBoardById(currBoardId, {name: boardInput}, token));
    setBoardEditable(false)
  }


  return (
    <div className="d-2">
      <div className="d-21">
        {boardEditable ?
          (<form onSubmit={boardNameHandler}>
            <input className="d-21-text-2 glass"
              placeholder="Board Name.." type="text"
              value={boardInput}
              autoFocus
              onFocus={(e) => {
                const val = e.target.value
                e.target.value = ''
                e.target.value = val
              }}
              onBlur={() => {
                setBoardEditable(false)
                const text = boardInput.trim().replace(/\s+/g, ' ')
                if (text === '') {
                  setBoardInput(currBoardName)
                  return
                }
                setBoardInput(text)
                dispatch(updateBoardById(currBoardId, { name: text }, token))
              }}
              onChange={(e) => setBoardInput(e.target.value)}
              style={{
                outline: 'none',
                backgroundColor: 'rgb(255,255,255)',
                color: '#444444',
                border: 'none',
              }}
            />
          </form>)
          :
          (<span className="d-21-text-1 glass"
          style={{cursor: "text"}}
            onClick={() => {
              setBoardEditable(true);
            }}> {boardInput} </span>)
        }
        <span className="d-21-btn-1 glass"><i className="fa fa-star-o"></i></span>
        <p className="vr"></p>
        <span className="d-21-text-2 glass">{user.name}'s WorkPlace</span>
        <p className="vr"></p>
        <span className="d-21-text-2 glass">Private <i className="fa lock_fa fa-lock"></i></span>
        <p className="vr"></p>
        <div className="d-21_profiles">
          <span className="d-21_profile">{user.name ? (user.name).slice(0,1) : ""}</span>
        </div>
      </div>
      {/* <div className="d-22">
        <span className="d-22_btn-1 glass"><i className="fa fa-ellipsis-v"></i>Show Menu</span>
      </div> */}

    </div>
  )
}
