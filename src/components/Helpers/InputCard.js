import React, { useRef, useEffect } from 'react'
import {
  IconButton,
} from '@material-ui/core'

import { AiOutlineClose } from 'react-icons/ai'
import styles from "./helper.module.css";

export default function InputItem({
  value,
  changedHandler,
  keyDownHandler,
  itemAdded,
  closeHandler,
  btnText,
  placeholder,
  margin
}) {

  const divRef = useRef(null)

  useEffect(() => {
    if (divRef.current != null) {
      divRef.current.scrollIntoView({ behaviour: 'smooth' })
    }
  }, [])

  const handleBlur = () => {
    closeHandler()
    itemAdded()
  }
  return (
    <div className={styles.inputCardContainer} style={{
      margin: margin || "0px"
    }}>
      <div className={styles.inputCardMain}>
        <input
          className={styles.listInput}
          onChange={changedHandler}
          multiline="true"
          value={value}
          autoFocus
          placeholder={placeholder}
          onBlur={handleBlur}
          onKeyDown={keyDownHandler}
        />
      </div>
      <div className={styles.inputBtns}>
        <button
          ref={divRef}
          variant="contained"
          onClick={itemAdded}
          className={styles.addBtn}
        >
          {btnText}
        </button>
        <button
          ref={divRef}
          className={styles.closeBtn}
          onClick={closeHandler}
        >
          Close
        </button>
      </div>
    </div>
  )
}
