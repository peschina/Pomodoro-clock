import React from "react";
import { Container, Form, ListGroup, Button, Row, Col } from "react-bootstrap";

function ToDoList(props) {
  return (
    <Container>
      <Form>
        <Form.Label className="d-flex justify-content-center">
          TO DO LIST
        </Form.Label>
        <Form.Row className="mb-3">
          <Col xs={10}>
            <Form.Control
              required
              type="text"
              placeholder="Add item"
              value={props.toAdd}
              onChange={props.handleAdd}
            />
          </Col>
          <Col xs={2}>
            <Button type="submit" onClick={props.handleSubmit}>
              {"Add "}
              <i className="fas fa-plus" />
            </Button>
          </Col>
        </Form.Row>
        <Row>
          <Col className="mb-3">
            <ListGroup>{props.createLi}</ListGroup>
          </Col>
        </Row>
        <Row className="justify-content-end">
          <Col xs="auto">
            <Button value="clear" onClick={props.handleClearList}>
              {"Clear "}
              <i className="fas fa-eraser" />
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default ToDoList;
