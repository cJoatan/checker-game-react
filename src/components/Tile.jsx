import React from 'react'
import { useDrop } from 'react-dnd'
import { ItemTypes } from './Piece';

function Tile({ xPosition, yPosition, squareWidth, squareHeight, children, movePiece }) {

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item) => {
      movePiece(item.pieceType, item.yPosition, item.xPosition, yPosition, xPosition)
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }), [yPosition, xPosition])

  const isDeadZone = xPosition > 8
  const isDark = ((yPosition % 2) != 0 && (xPosition % 2) != 0) ||  ((xPosition % 2) == 0 && (yPosition % 2) == 0);
  const background = isDeadZone ? "#c3c3c3" : (isDark ? "#78553c" : "#f0c990")
  return (
    <div ref={drop} key={"tile" + yPosition + xPosition} style={{width: squareWidth, height: squareHeight, background: background}}>
     {children}
    </div>
  )
}

export default Tile