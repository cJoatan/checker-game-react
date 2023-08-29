import './App.css';
import Board from './components/Board';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Routes, Route, Link } from 'react-router-dom';
import CreateGame from './components/CreateGame';
import Container from 'react-bootstrap/Container';

function App() {
  return (
    <>
      {/* <nav>
        <Link to="/create-game">Create Game</Link>
        <Link to="/game">Home</Link>
      </nav> */}

      <Container fluid>
        
        <h1>Checker Game</h1>

        <Routes>
          <Route index element={
            <CreateGame />
          } />
          <Route path="board" element={
            <DndProvider backend={HTML5Backend}>
              <Board />
            </DndProvider>
          } />
        </Routes>
      </Container>
      
    </>
  );
}

export default App;
