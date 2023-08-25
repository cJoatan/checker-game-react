import React from 'react'
import { useDrag } from 'react-dnd'
import { ItemTypes } from './Piece';

function BlackPiece({ yPosition, xPosition }) {
  
  const pieceType = ItemTypes.BLACK;
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: {pieceType, yPosition, xPosition },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return (
    <div ref={drag} style={{opacity: isDragging ? 0.5 : 1, cursor: 'move', padding: 5, borderRadius: 50}}>
      <svg  viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" />
      </svg>
    </div>
  )
}

export default BlackPiece