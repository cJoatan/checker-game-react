import React from 'react'
import {  Col, FormControl, Form, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function CreateGame() { 

  function inviteAFriend() {
    
  }

  return (
    <Row>
      <Col>

        <Link to="/board">Invite a friend</Link>

        {/* <Form.Group controlId="formBasicEmail">
          <Form.Label>Enter a game</Form.Label>
          <Form.Control />
        </Form.Group>
       */}
      </Col>
      <Col>


      </Col>
    </Row>
  )
}

export default CreateGame