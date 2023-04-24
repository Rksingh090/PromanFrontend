import React, { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import Card from './Card'
import InputCard from '../Helpers/InputCard'
import { createNewCard } from '../../actions/actionCreators/cardActions'
import midString from '../../ordering/ordering'
import { createNewActivity } from '../../actions/actionCreators/activityActions'
import AddItem from '../Helpers/AddItem'
import {
  updateListById,
  deleteListById,
} from '../../actions/actionCreators/listActions'
import '../../styles/List.css';
import MakeConfirmation from '../Helpers/MakeConfirmation'

export default function Column({ column, tasks, index, key}) {
  const [cardTitle, setCardTitle] = useState('')
  const [listTitle, setListTitle] = useState(column.name)
  const [addCardFlag, setAddCardFlag] = useState(false)
  const [editable, setEditable] = useState(false)
  const [list, setList] = useState(true)
  const [deleteList, setDeleteList] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [ListDragDisable, setListDragDisable] = useState(false)

  const { token, user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleChange = (e) => {
    e.preventDefault()
    setCardTitle(e.target.value)
  }

  const submitHandler = () => {
    if (cardTitle === '') return
    const text = cardTitle.trim().replace(/\s+/g, ' ')
    setCardTitle(text)
    const totalTasks = tasks.length
    const postCardReq = {
      name: text,
      boardId: column.boardId,
      listId: column._id,
      order:
        totalTasks === 0 ? 'n' : midString(tasks[totalTasks - 1].order, ''),
      description: '',
      topBorderColor: ''
    }
    dispatch(createNewCard(postCardReq, token))
    dispatch(
      createNewActivity(
        {
          text: `${user.username} added card ${text} to list ${column.name}`,
          boardId: column.boardId,
          UserId: user.id
        },
        token,
      ),
    )
    setCardTitle('')
  }
  const handleAddition = () => {
    setAddCardFlag(true)
  }
  const closeButtonHandler = () => {
    setAddCardFlag(false)
    setCardTitle('')
  }
  const changedHandler = (e) => {
    e.preventDefault()
    setListTitle(e.target.value)
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitHandler()
    }
  }
  const updateListTitle = () => {
    const text = listTitle.trim().replace(/\s+/g, ' ')
    if (text === '') {
      setListTitle(column.name)
      setEditable(false)
      return
    }
    setListTitle(text)
    dispatch(updateListById(column._id, { name: listTitle }))
    // eslint-disable-next-line no-param-reassign
    column.name = text
    setEditable(false)
  }
  const handleDeleteReq = () => {
    setList(false)
    dispatch(deleteListById(column._id))
    setDeleteList(false)
}

const styles = { maxHeight: "360px", overflowY: "auto", overflowX: "hidden" }
return (
  <div className="ListWrapper" >
    {deleteList &&
    <MakeConfirmation cancleHandler={() => setDeleteList(false)}
    confirmText={(<>Do you want to delete list <strong>"{column.name}"</strong> ?</>)} okBtnText="Delete"
    okHandler={() => handleDeleteReq()}
     />
    }
    {list && (
      <Draggable draggableId={column._id} index={index} isDragDisabled={ListDragDisable ? true : false} >
        {(provided) => (
          <div {...provided.draggableProps} ref={provided.innerRef}>
            <div
              className="ListBack"
              style={{
                backgroundColor: "#f8f8f8",
                width: "272px",
                wordWrap: 'break-word',
                marginLeft: "12px",
                borderRadius: "6px"
              }}
              {...provided.dragHandleProps}
            >
              <div
                className="title"
                onMouseEnter={() => setShowDelete(true)}
                onMouseLeave={() => setShowDelete(false)}
                onClick={() => setEditable(true)}
              >
                {!editable && (
                  <div style={{ position: 'relative' }}>
                    <div style={{ cursor: "text", marginLeft: "15px", paddingTop: "8px", width: "fit-content" }}>{column.name}</div>
                    {showDelete && (
                      <span
                        size="small"
                        style={{
                          right: "5px",
                          cursor: "pointer",
                          top: "5px",
                          position: 'absolute',
                          backgroundColor: '#EBECF0',
                          zIndex: 100,
                          padding: "5px"
                        }}
                        onClick={() => {
                          setDeleteList(true)
                        }}
                      >
                        <i className="fa fa-trash"
                          style={{ backgroundColor: '#EBECF0' }}
                        />
                      </span>
                    )}
                  </div>
                )}



                {editable && (
                  <div className="ListEditable">
                    <input
                      onChange={changedHandler}
                      multiline
                      fullWidth
                      value={listTitle}
                      style={{
                        padding: '5px',
                        marginLeft: '5px',
                        border: 'none',
                        borderBottom: '1px solid #AAAAAA',
                        background: 'transparent',
                        outline: 'none',
                        borderRadius: '0px',
                        fontSize: '16px',
                        fontFamily:'monospace'
                      }}
                      autoFocus
                      onFocus={(e) => {
                        const val = e.target.value
                        e.target.value = ''
                        e.target.value = val
                      }}
                      onBlur={updateListTitle}
                    />
                  </div>
                )}
              </div>
              <Droppable droppableId={column._id} type="card">
                {
                  // eslint-disable-next-line no-shadow
                  (provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <div className="ListScroll" style={styles}>
                        {/* eslint-disable-next-line no-shadow */}
                        {tasks.map((task, index) => (
                          <Card key={task._id} task={task} index={index} setListDragDisable={setListDragDisable} />
                        ))}
                        {addCardFlag && (
                          <InputCard
                            value={cardTitle}
                            changedHandler={handleChange}
                            itemAdded={submitHandler}
                            closeHandler={closeButtonHandler}
                            keyDownHandler={handleKeyDown}
                            type="card"
                            btnText="Add Card"
                            placeholder="Enter a title for this card..."
                            width="230px"
                          />
                        )}
                        {provided.placeholder}
                      </div>
                      {!addCardFlag && (
                        <AddItem
                          handleClick={handleAddition}
                          btnText="+ Add another card"
                          type="card"
                          width="256px"
                        />
                      )}
                    </div>
                  )
                }
              </Droppable>
            </div>
          </div>
        )}
      </Draggable>
    )}
  </div>
)
}
