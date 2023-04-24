import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import Activities from './Activities'
import { deleteBoardById, updateBoardById } from '../../actions/actionCreators/boardActions'
import '../../styles/SideMenu.css'
import { ChromePicker } from 'react-color'
import MakeConfirmation from '../Helpers/MakeConfirmation'

export default function SideMenu({ setBackground, board }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showBackground, setShowBackground] = useState(false)
  
  const {currBoard} = useSelector((state) => state.boards)
  const { user, token } = useSelector((state) => state.user)

  const [BGColor, setBGColor] = useState('#F68ACD')
  const [prevBGColor, setPrevBGColor] = useState(board.color)
  const [deleting, setDeleting] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!_.isEmpty(currBoard)) {
      setPrevBGColor(currBoard.Background.color)
    }
  }, [currBoard])

  return (
    <>
      {deleting && <MakeConfirmation okBtnText={"Delete"}
        confirmText={`Do you want to delete this Board ?`}
        okHandler={() => {
          setDeleting(false);
          window.location.href =`/${user.username}/boards`
          dispatch(deleteBoardById(board.id, token))
        }}
        cancleHandler={() => setDeleting(false)
        }
      />}
      <div className="SideMenu">
        <button
          className="showSideMenuBtn glass"
          onClick={() => setShowMenu(true)}
        >
          <i className="fa fa-ellipsis-v"></i>Show Menu
        </button>
      </div>
      {!showBackground && (
        <div className="SideMenuContainer" style={{ right: showMenu ? '0px' : '-1000px' }}>
          <div
            className="menuHeader"
          >
            <h4>Menu</h4>
            <span onClick={() => setShowMenu(false)} className="SideMenuCloseloseBtn" ><i className="fa fa-times"></i></span>
          </div>
          <div className="changeBGBoardBtn" onClick={() => setShowBackground(true)} >
            <div className="bgHolder" style={{backgroundColor: board.color}}></div>
            <span>Change Background</span>
          </div>
          <div className="deleteBoardBtn" onClick={() => setDeleting(true)} >
            <i style={{ fontSize: '20px', marginRight: '8px' }} className="fa fa-trash-o" ></i> Delete
          </div>
          <div className="ActivityContainer" >
            <i className="fa fa-list-ul faListUl" />
            <div className="ActivityTitle" >
              Activity
            </div>
          </div>
          <div className="activityScroll">
            <Activities board={{ id: board.id }} />
          </div>
        </div>
      )}
      <div className="FixedBGColorPicker">
        {showBackground && (
          <>
            <ChromePicker color={BGColor} onChangeComplete={(color) => setBackground(color.hex)}
            onChange={(color) => {setBGColor(color.hex) }}
            />
            <button
              onClick={() => {
                setBackground(BGColor)
                setShowBackground(false)
                dispatch(
                  updateBoardById(
                    board.id,
                    {
                      Background: {
                        color: BGColor,
                      },
                    },
                    token,
                  ),
                )
              }}
              style={{
                width: '100%',
                padding: '3px 10px',
                backgroundColor: '#45A9FE',
                border: 'none',
                outline: 'none',
                borderRadius: '0px',
                cursor: 'pointer'
              }}>Save</button>
            <button
              onClick={() => {
                setShowBackground(false)
                setBackground(prevBGColor)
              }}
              style={{
                width: '100%',
                padding: '3px 10px',
                backgroundColor: '#45A9FE',
                border: 'none',
                outline: 'none',
                borderRadius: '0px',
                cursor: 'pointer'
              }}>Cancle</button>
          </>
        )}
      </div>
    </>
  )
}
