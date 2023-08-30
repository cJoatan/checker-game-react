import React, { useEffect, useRef, useState } from 'react'
import "./Board.css";
import Tile from "./Tile";
import Piece, { PieceType } from './Piece';
import useWebSocket from 'react-use-websocket';
import uuid from 'react-uuid'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from 'react-bootstrap';

const WS_URL = "ws://localhost:8080/echoHandler"

const yAxis = [1, 2, 3, 4, 5, 6, 7, 8];
const xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const initialWhitePositions = [
  [1, 1],
  [1, 3],
  [1, 5],
  [1, 7],

  [2, 2],
  [2, 4],
  [2, 6],
  [2, 8],
  
  [3, 1],
  [3, 3],
  [3, 5],
  [3, 7],
]

const initialBlackPositions = [
  [6, 2],
  [6, 4],
  [6, 6],
  [6, 8],

  [7, 1],
  [7, 3],
  [7, 5],
  [7, 7],

  [8, 2],
  [8, 4],
  [8, 6],
  [8, 8]
]

const deadZone = [

]

const boardWidth = 660;
const boardHeight = 500;

const ENTER_A_GAME = "enter_a_game";
const CREATE_NEW_GAME_OR_ENTER_A_GAME = "create_new_game_or_enter_a_game";
const PLAYING = "playing";

function Board() {

  const boardId = useRef("");
  const userId = useRef("");
  
  const [boardStatus, setBoardStatus] = useState(CREATE_NEW_GAME_OR_ENTER_A_GAME);
  const [blackPositions, setBlackPositions] = useState(initialBlackPositions);
  const [whitePositions, setWhitePositions] = useState(initialWhitePositions);
  const [boardUpdate, setBoardUpdate] = useState(0);
  const [gameAccessCode, setGameAccessCode] = useState("");
  const [enterGameCode, setEnterGameCode] = useState("");
  const [movePiece, setMovePiece] = useState({});

  useEffect(() => {
    userId.current = getOrCreateUserId();
  }, [])
  

  const { sendJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    onOpen: () => {
      console.log("ISOPENDED")
    },
    onError: (err) => {
      console.warn(err)
    },
    onMessage: (message) => {
      const data = JSON.parse(message.data);
      console.log(data)

      if (!!data.id) {
        boardId.current = data.id
      }

      if (data.type === "content_change") {
        setBlackPositions(prevPos => data.content.blackPositions);
        setWhitePositions(prevPos => data.content.whitePositions);
      } else if (data.status === "WAITING_OPPONENT") {
        setGameAccessCode(prev => data.code);
      } else if (data.status === "START_GAME") {
        setBoardStatus(prev => PLAYING);
      }
    }
  })

  useEffect(() => {
    
    sendJsonMessage({
      id: boardId.current,
      userId: userId.current,
      type: 'content_change',
      content: {
        whitePositions: whitePositions,
        blackPositions: blackPositions
      }
    })

  }, [boardUpdate])

  useEffect(() => {
    if (boardStatus === ENTER_A_GAME) {
      sendJsonMessage({
        userId: userId.current,
        type: 'enter_a_game',
        code: enterGameCode,
        content: {
          whitePositions: whitePositions,
          blackPositions: blackPositions
        }
      })
    }
  }, [boardStatus])

  useEffect(() => {
    
    if (movePiece.pieceType === PieceType.BLACK) {

      const canMove = !isBlackMarked(movePiece.toY, movePiece.toX) && !isWhiteMarked(movePiece.toY, movePiece.toX);
      if (canMove) {
        moveBlackPiece(movePiece.fromY, movePiece.fromX, movePiece.toY, movePiece.toX);
      }
    
    } else if (movePiece.pieceType === PieceType.WHITE) {

      const canMove = !isWhiteMarked(movePiece.toY, movePiece.toX) && !isBlackMarked(movePiece.toY, movePiece.toX);
      if (canMove) {
        moveWhitePiece(movePiece.fromY, movePiece.fromX, movePiece.toY, movePiece.toX);
      }
    }
  }, [movePiece])
  

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
  
  function updatePiece(pieceType, fromY, fromX, toY, toX) {
    setMovePiece({pieceType: pieceType, fromY: fromY, fromX: fromX, toY: toY, toX: toX})
    
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

  function createNewGame() {
    sendJsonMessage({
      type: 'create_new_game',
      id: boardId.current,
      userId: userId.current
    })
  }

  function enterAGame() {
    setBoardStatus(ENTER_A_GAME);
  }

  function getOrCreateUserId() {
    
    const userId = localStorage.getItem('checkGameUserId');

    if (!!userId) {
      return userId;
    }
    else {
      const newUserId = uuid();
      localStorage.setItem('checkGameUserId', newUserId)
      return newUserId;
    }

  }

  return (
    <DndProvider backend={HTML5Backend}>

      <Button onClick={createNewGame}>Create new Game</Button>

      {gameAccessCode}
      <br/>

      <input type="text" value={enterGameCode} onChange={(event) => setEnterGameCode(event.target.value)} /> 
      <Button onClick={enterAGame}>Enter a game</Button>
      
      {boardStatus === PLAYING &&
        <div className='board'>
          {yAxis.map((yItem) => 
            xAxis.map((xItem) => {

              return <Tile
                key={"tile" + yItem + xItem}
                xPosition={xItem}
                yPosition={yItem}
                squareWidth={squareWidth}
                squareHeight={squareHeight}
                movePiece={updatePiece}
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
      }
      

    </DndProvider>
  )
}

export default Board