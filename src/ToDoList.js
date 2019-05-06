import React from "react";
import { Container, Form, ListGroup, Button } from "react-bootstrap";

function ToDoList(props) {
  return (
    <Container className="justify-content-center">
      <Form>
        <Form.Group>
          <Form.Label>To do list</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Add item"
            value={props.toAdd}
            onChange={props.handleAdd}
          />
          <Button
            variant="secondary"
            type="submit"
            onClick={props.handleSubmit}
          >
            Add
          </Button>
        </Form.Group>
      </Form>
      <Form>
        <ListGroup>{props.createLi}</ListGroup>
        <Button value="clear" onClick={props.handleClearList}>
          Clear
        </Button>
      </Form>
    </Container>
  );
}

export default ToDoList;
