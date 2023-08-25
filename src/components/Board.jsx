import React, { useEffect, useState } from 'react'
import "./Board.css";
import Tile from "./Tile";
import Piece, { PieceType } from './Piece';
import useWebSocket from 'react-use-websocket';

const WS_URL = "ws://localhost:8080/echoHandler"

const yAxis = [1, 2, 3, 4, 5, 6, 7, 8];
const xAxis = [1, 2, 3, 4, 5, 6, 7, 8];

const initialWhitePositions = [
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [1, 7],
  [1, 8],

  [2, 1],
  [2, 2],
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  [2, 7],
  [2, 8],
  
]

const initialBlackPositions = [
  [7, 1],
  [7, 2],
  [7, 3],
  [7, 4],
  [7, 5],
  [7, 6],
  [7, 7],
  [7, 8],

  [8, 1],
  [8, 2],
  [8, 3],
  [8, 4],
  [8, 5],
  [8, 6],
  [8, 7],
  [8, 8]
]

const boardWidth = 500;
const boardHeight = 500;

function Board() {

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    onOpen: () => {
      console.log("ISOPENDED")
    },
    onError: (err) => {
      console.warn(err)
    },
    onMessage: (message) => {
      const content = JSON.parse(message.data).content;
      console.log(content)
      setBlackPositions(prevPos => content.blackPositions);
      setWhitePositions(prevPos => content.whitePositions);
    }
  })

  const [blackPositions, setBlackPositions] = useState(initialBlackPositions);
  const [whitePositions, setWhitePositions] = useState(initialWhitePositions);
  const [boardUpdate, setBoardUpdate] = useState(0);

  useEffect(() => {
    
    sendJsonMessage({
      type: 'contentchange',
      content: {
        whitePositions: whitePositions,
        blackPositions: blackPositions
      }
    })

  }, [boardUpdate])
  

  const squareWidth = boardWidth / xAxis.length
  const squareHeight = boardHeight / yAxis.length

  function isWhiteMarked(yPosition, xPosition) {
    return whitePositions.some(row => row[0] === yPosition && row[1] === xPosition); 
  }

  function isBlackMarked(yPosition, xPosition) {
    return blackPositions.some(row => row[0] === yPosition && row[1] === xPosition); 
  }

  function renderPiece(yPosition, xPosition) {
    return isBlackMarked(yPosition, xPosition) || isWhiteMarked(yPosition, xPosition);
  }

  function pieceType(yPosition, xPosition) {
    if (isWhiteMarked(yPosition, xPosition))
      return PieceType.WHITE
    if (isBlackMarked(yPosition, xPosition))
      return PieceType.BLACK
  }

  function getPiecesIndex(positions, yPosition, xPosition) {
    for (var i = 0; i < positions.length; i++) {
        // This if statement depends on the format of your array
        if (positions[i][0] == yPosition && positions[i][1] == xPosition) {
            return i;   // Found it
        }
    }
    return -1;   // Not found
  }
  
  function movePiece(pieceType, fromY, fromX, toY, toX) {
    
    if (pieceType === PieceType.BLACK) {
      
      const canMove = !isBlackMarked(toY, toX) && !isWhiteMarked(toY, toX);
      if (canMove) {
        moveBlackPiece(fromY, fromX, toY, toX);
      }
    
    } else if (pieceType === PieceType.WHITE) {

      const canMove = !isWhiteMarked(toY, toX) && !isBlackMarked(toY, toX);
      if (canMove) {
        moveWhitePiece(fromY, fromX, toY, toX);
      }
    }

  }

  function moveBlackPiece(fromY, fromX, toY, toX) {
    setBlackPositions((prevPositions) => {
      const blackIndex = getPiecesIndex(prevPositions, fromY, fromX);
      const filtered = prevPositions.filter((item, index) => index != blackIndex);
      return [...filtered, [toY, toX]]
    })
    setBoardUpdate(prevUpdate => prevUpdate + 1)
  }

  function moveWhitePiece(fromY, fromX, toY, toX) {
    setWhitePositions((prevPositions) => {
      const whiteIndex = getPiecesIndex(prevPositions, fromY, fromX);
      const filtered = prevPositions.filter((item, index) => index != whiteIndex);
      return [...filtered, [toY, toX]]
    })
    setBoardUpdate(prevUpdate => prevUpdate + 1)
  }

  function removePiecePiece(positionY, positionX) {
    setBlackPositions((prevPositions) => {
      const blackIndex = getPiecesIndex(prevPositions, positionY, positionX);
      const filtered = prevPositions.filter((item, index) => index != blackIndex);
      return filtered
    })
  }

  return (
    <div className='board'>
        {yAxis.map((yItem) => 
          xAxis.map((xItem) => {

            return <Tile
              key={"tile" + yItem + xItem}
              xPosition={xItem}
              yPosition={yItem}
              squareWidth={squareWidth}
              squareHeight={squareHeight}
              movePiece={movePiece}
            >
              {renderPiece(yItem, xItem) && 
                <Piece  
                  xPosition={xItem}
                  yPosition={yItem}
                  pieceType={pieceType(yItem, xItem)} 
                />}
            </Tile>
          })
        )}
    </div>
  )
}

export default Board