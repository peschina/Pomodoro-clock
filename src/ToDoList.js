import React from "react";
import { Container, Form, ListGroup, Button, Row, Col } from "react-bootstrap";

function ToDoList(props) {
  return (
    <Container className="pt-5">
      <Form>
        <Form.Label className="d-flex justify-content-center my-3">
          TO DO LIST
        </Form.Label>
        <Form.Row className="d-flex flex-column flex-md-row flex-sm-row pt-3 pb-3">
          <Col md={10} sm={9} className="pt-2">
            <Form.Control
              required
              type="text"
              placeholder="Add item"
              value={props.toAdd}
              onChange={props.handleAdd}
            />
          </Col>
          <Col md={2} sm={3} className="pt-2">
            <Button
              type="submit"
              onClick={props.handleSubmit}
              className="custom-btn btn-block rounded-pill"
            >
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
            <Button
              value="clear"
              onClick={props.handleClearList}
              className="custom-btn rounded-pill"
            >
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
