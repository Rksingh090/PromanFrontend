import '../../styles/Board.css'
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import _ from 'lodash'
import moment from 'moment'
import {
  fetchBoardById,
  fetchListsFromBoard,
  fetchsCardsFromBoard,
  fetchActivitiesFromBoard,
  fetchAllBoards
} from '../../actions/actionCreators/boardActions'
import midString from '../../ordering/ordering'
import { updateCardById } from '../../actions/actionCreators/cardActions'
import {
  createNewList,
  updateListById,
} from '../../actions/actionCreators/listActions'
import { fetchNotificationByUserID } from '../../actions/actionCreators/notificationActions'
import InputCard from '../Helpers/InputCard'
import {
  createNewActivity,
  deleteActivityById,
} from '../../actions/actionCreators/activityActions'
import Column from './List'
import BoardHeader1 from './BoardHeader1'
import BoardHeader2 from './BoardHeader2'
import SideMenu from './SideMenu'
import { GrAdd } from 'react-icons/gr'



export default function Board() {
  var { id, name } = useParams()
  const { loading, boards, currBoard, error } = useSelector((state) => state.boards)
  const { listLoading, lists } = useSelector((state) => state.lists)
  const { cardLoading, cards } = useSelector((state) => state.cards)
  const { activities } = useSelector((state) => state.activities)
  const { isValid, user, token, tokenRequest } = useSelector((state) => state.user,)

  const [initialData, setInitialData] = useState({})
  const [initDone, setInitDone] = useState(false)
  const addFlag = useRef(true)
  const [addListFlag, setAddListFlag] = useState(false)
  const [listTitle, setListTitle] = useState('')
  const [color, setColor] = useState('#DDD')
  const [boardTitle, setBoardTitle] = useState('')

  const d3ref = useRef();
  const dispatch = useDispatch()


  if (!loading && name !== currBoard.name && currBoard.name !== undefined)
    name = currBoard.name
  else if (name === undefined) name = ''


  useEffect(() => {
    if (isValid && !error) {
      if (id.length === 24) {
        dispatch(fetchBoardById(id, token))
        dispatch(fetchAllBoards(token))
        dispatch(fetchListsFromBoard(id, token))
        dispatch(fetchsCardsFromBoard(id, token))
        dispatch(fetchActivitiesFromBoard(id, token))
      }
    }
  }, [dispatch, id, isValid, token, error])

  useEffect(() => {
    if (user.id !== undefined) {
      dispatch(fetchNotificationByUserID(user.id, token))
    }
  }, [user, dispatch, token])

  useEffect(() => {
    if (!_.isEmpty(currBoard)) {
      setColor(currBoard.Background.color)
      setBoardTitle(currBoard.name)
      document.title = `${currBoard.name} | Trellis`
    }
  }, [currBoard])

  useEffect(() => {
    if (!listLoading && !cardLoading) {
      const prevState = { tasks: {}, columns: {}, columnOrder: [] }
      // eslint-disable-next-line no-shadow
      const getTaskIds = (id) => {
        const filteredTasks = _.filter(cards, { listId: id })
        const sortedTasks = _.orderBy(filteredTasks, ['order'], ['asc'])
        const taskIds = []
        sortedTasks.forEach((task) => taskIds.push(task._id))
        return taskIds
      }

      const setContent = () => {
        cards.forEach((card) => (prevState.tasks[card._id] = card))
        const sortedLists = _.orderBy(lists, ['order'], ['asc'])
        sortedLists.forEach((list) => {
          prevState.columns[list._id] = {
            ...list,
            taskIds: getTaskIds(list._id),
          }
          prevState.columnOrder.push(list._id)
        })
      }
      setContent()
      setInitialData({ ...prevState })
      setInitDone(true)
    }
  }, [setInitDone, listLoading, cardLoading, setInitialData, cards, lists])

  const onDragEnd = (result) => {
    // eslint-disable-next-line no-var
    var newOrder;
    const { destination, source, draggableId, type } = result;
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    if (type === 'list') {
      const listOrder = initialData.columnOrder
      if (destination.index === 0) {
        newOrder = midString('', initialData.columns[listOrder[0]].order)
      } else if (destination.index === listOrder.length - 1) {
        newOrder = midString(
          initialData.columns[listOrder[destination.index]].order,
          '',
        )
      } else if (destination.index < source.index) {
        newOrder = midString(
          initialData.columns[listOrder[destination.index - 1]].order,
          initialData.columns[listOrder[destination.index]].order,
        )
      } else {
        newOrder = midString(
          initialData.columns[listOrder[destination.index]].order,
          initialData.columns[listOrder[destination.index + 1]].order,
        )
      }
      dispatch(updateListById(draggableId, { order: newOrder }))
      const newListOrder = Array.from(initialData.columnOrder)
      const destinationColumn = initialData.columns[draggableId]
      destinationColumn.order = newOrder
      newListOrder.splice(source.index, 1)
      newListOrder.splice(destination.index, 0, draggableId)
      const newData = {
        ...initialData,
        columnOrder: newListOrder,
        columns: {
          ...initialData.columns,
          draggableId: destinationColumn,
        },
      }
      setInitialData(newData)
      return
    }
    const startList = initialData.columns[source.droppableId]
    const endList = initialData.columns[destination.droppableId]

    if (startList === endList) {
      const column = startList
      if (destination.index === 0)
        newOrder = midString('', initialData.tasks[column.taskIds[0]].order)
      else if (destination.index === column.taskIds.length - 1)
        newOrder = midString(
          initialData.tasks[column.taskIds[destination.index]].order,
          '',
        )
      else if (destination.index < source.index)
        newOrder = midString(
          initialData.tasks[column.taskIds[destination.index - 1]].order,
          initialData.tasks[column.taskIds[destination.index]].order,
        )
      else
        newOrder = midString(
          initialData.tasks[column.taskIds[destination.index]].order,
          initialData.tasks[column.taskIds[destination.index + 1]].order,
        )

      dispatch(updateCardById(draggableId, { order: newOrder }))
      const newTaskIds = Array.from(column.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)
      const destinationTask = initialData.tasks[draggableId]
      destinationTask.order = newOrder
      const newColumn = {
        ...column,
        taskIds: newTaskIds,
      }
      const newData = {
        ...initialData,
        columns: {
          ...initialData.columns,
          [newColumn._id]: newColumn,
        },
        tasks: {
          ...initialData.tasks,
          draggableId: destinationTask,
        },
      }
      setInitialData(newData)
      return
    }

    // Move from one list to another
    if (endList.taskIds.length === 0) newOrder = 'n'
    else if (destination.index === 0) {
      newOrder = midString('', initialData.tasks[endList.taskIds[0]].order)
    } else if (destination.index === endList.taskIds.length)
      newOrder = midString(
        initialData.tasks[endList.taskIds[destination.index - 1]].order,
        '',
      )
    else
      newOrder = midString(
        initialData.tasks[endList.taskIds[destination.index - 1]].order,
        initialData.tasks[endList.taskIds[destination.index]].order,
      )
    dispatch(
      updateCardById(draggableId, { order: newOrder, listId: endList._id }),
    )
    const text = `${user.username} moved ${initialData.tasks[draggableId].name} from ${startList.name} to ${endList.name}`
    const recentActivity = activities[activities.length - 1]
    if (
      recentActivity.text ===
      `${user.username} moved ${initialData.tasks[draggableId].name} from ${endList.name} to ${startList.name}` &&
      moment(recentActivity.createdAt).fromNow().includes('second')
    ) {
      dispatch(deleteActivityById(recentActivity._id))
    } else dispatch(createNewActivity({ text, boardId: currBoard._id, UserId: user.id }, token))

    const startTaskIds = Array.from(startList.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStartList = {
      ...startList,
      taskIds: startTaskIds,
    }
    const destinationTask = initialData.tasks[draggableId]
    destinationTask.order = newOrder
    const endTaskIds = Array.from(endList.taskIds)
    endTaskIds.splice(destination.index, 0, draggableId)
    const newEndList = {
      ...endList,
      taskIds: endTaskIds,
    }
    const newData = {
      ...initialData,
      columns: {
        ...initialData.columns,
        [newStartList._id]: newStartList,
        [newEndList._id]: newEndList,
      },
      tasks: {
        ...initialData.tasks,
        draggableId: destinationTask,
      },
    }
    setInitialData(newData)
  }

  if (id.length < 24) return <h1>Invalid URL</h1>
  const handleChange = (e) => {
    e.preventDefault()
    setListTitle(e.target.value)
  }

  const submitHandler = () => {
    if (listTitle === '') return
    const text = listTitle.trim().replace(/\s+/g, ' ')
    if (text === '') {
      setListTitle(listTitle)
      return
    }

    const totalLists = initialData.columnOrder.length
    const postListReq = {
      name: text,
      boardId: currBoard._id,
      order:
        totalLists === 0
          ? 'n'
          : midString(
            initialData.columns[initialData.columnOrder[totalLists - 1]]
              .order,
            '',
          ),
    }
    dispatch(createNewList(postListReq, token))
    dispatch(
      createNewActivity(
        {
          text: `${user.username} added ${listTitle} list to ${currBoard.name} board`,
          boardId: currBoard._id,
          UserId: user.id
        },
        token,
      ),
    )
    setListTitle('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitHandler()
    }
  }

  const closeButtonHandler = () => {
    setAddListFlag(false)
    addFlag.current = true
    setListTitle('')
  }

  const handleAddition = () => {
    setAddListFlag(true)
    addFlag.current = false
  }
  const setBackground = (background) => {
    if (background) {
      setColor(background)
    }
  }


  return (
    <>
      {isValid || tokenRequest ? (
        <div className="d_container" style={{ backgroundColor: color }}>
          <BoardHeader1 boards={boards} currBoardName={name} username={user.username} backgroundColor={color} />
          <BoardHeader2 currBoardName={name} currBoardId={id} />
          {/* <ChatMessage /> */}
          <div className="d-3" ref={d3ref}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId="all-columns"
                direction="horizontal"
                type="list"
              >
                {(provided) => (
                  <div
                    className="listContainer"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {initDone &&
                      initialData.columnOrder.map((columnId, index) => {
                        const column = initialData.columns[columnId]
                        const tasks = column.taskIds.map(
                          (taskId) => initialData.tasks[taskId],
                        )
                        return (
                          <React.Fragment key={columnId} >
                            <Column
                              column={column}
                              tasks={tasks}
                              index={index}
                            />
                          </React.Fragment>
                        )
                      })}
                    <div>
                      {addFlag.current && (
                        <button
                          onClick={handleAddition}
                          className="glass addAnotherListBtn"
                        ><GrAdd color={"#fff"} /> Add another list</button>
                      )}
                      {addListFlag && (
                        <InputCard
                          margin={"0 20px"}
                          value={listTitle}
                          changedHandler={handleChange}
                          itemAdded={submitHandler}
                          closeHandler={closeButtonHandler}
                          keyDownHandler={handleKeyDown}
                          type="list"
                          btnText="Add List"
                          placeholder="Enter list title..."
                          width="256px"
                          marginLeft="1"
                        />
                      )}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <SideMenu
              setBackground={setBackground}
              board={{ id, color, title: boardTitle }}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
