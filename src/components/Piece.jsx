import React from 'react'
import BlackPiece from './BlackPiece'
import WhitePiece from './WhitePiece'

export const PieceType = {
  BLACK: 'black',
  WHITE: 'white',
}

export const ItemTypes = {
  PIECE: 'piece',
  WHITE: 'white',
  BLACK: 'black',
}

function Piece({ pieceType, yPosition, xPosition }) {

  if (pieceType === PieceType.BLACK)
    return <BlackPiece yPosition={yPosition} xPosition={xPosition}  />

  if (pieceType === PieceType.WHITE)
    return <WhitePiece yPosition={yPosition} xPosition={xPosition}/>

  return (
    <div></div>
  )
}

export default Piece