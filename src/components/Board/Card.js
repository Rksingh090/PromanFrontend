import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { Paper, makeStyles } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import CardForm from './CardForm'
import {
  deleteCardById,
} from '../../actions/actionCreators/cardActions'
import { createNewActivity } from '../../actions/actionCreators/activityActions'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(1, 1, 1, 2),
    margin: theme.spacing(1),
    width: '230px',
    wordWrap: 'break-word',
    zIndex: '-100',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },

}))

export default function Card({ task, index, setListDragDisable }) {
  const [cardFormVisible, setCardFormVisible] = useState(false)
  const [card, setCard] = useState(true)
  const [showTools, setShowTools] = useState(false)
  const classes = useStyles()
  const { token, user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  return (<>
    {cardFormVisible ?
      <CardForm
        cardID={task._id}
        cardFormVisibleHandler={() => {
          setCardFormVisible(false)
        }}
        setListDragDisable={setListDragDisable}
      /> : null
    }
    <Draggable draggableId={task._id} index={index} >
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {card && (
            <Paper
              style={{ borderTop: task.topBorderColor ? `2px solid ${task.topBorderColor}` : 'none' }}
              className={classes.card}
              onMouseEnter={() => setShowTools(true)}
              onMouseLeave={() => setShowTools(false)}
              onDoubleClick={() => {
                setCardFormVisible(true)
                setListDragDisable(true)
              }}
            >

              <div className="cardToolsWrapper">
                <div>{task.name}</div>
                {showTools && (
                  <span
                    className="card-tool-icons"
                  >
                    <AiOutlineEdit className="cardEdit"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setCardFormVisible(true)
                        setListDragDisable(true)
                      }}
                    />
                    <AiOutlineDelete
                      className="fa fa-trash"
                      style={{ cursor: 'pointer'}}
                      onClick={() => {
                        setCard(false)
                        dispatch(deleteCardById(task._id))
                        const text = `${user.username} deleted card ${task.name}`
                        dispatch(
                          createNewActivity(
                            { text, boardId: task.boardId },
                            token,
                          ),
                        )
                      }}
                    />
                  </span>
                )}
              </div>

            </Paper>
          )}
        </div>
      )}
    </Draggable>
  </>
  )
}
