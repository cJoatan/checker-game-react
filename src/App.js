import './App.css';
import Board from './components/Board';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Routes, Route, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

function App() {
  return (
    <>

      <Container fluid>
        
        <h1>Checker Game</h1>

        <Routes>
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
