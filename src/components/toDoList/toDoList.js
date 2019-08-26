import React, { useState } from "react";
import { Form, ListGroup, Button, Row, Col } from "react-bootstrap";

import NewItemForm from "./NewItemForm";
import Item from "./Item";

const dummyData = [
  { id: 0, name: "Make laundry", completed: false },
  { id: 1, name: "Buy groceries", completed: false },
  { id: 2, name: "Call doctor", completed: false }
];

const ToDoList = () => {
  const [items, setItems] = useState(dummyData);

  const toggleCompleted = id => {
    const list = [
      ...items.filter(item => item.id !== id),
      {
        ...items.find(item => item.id === id),
        completed: true
      }
    ];

    setItems(list);
  };

  const handleDeleteItem = id => setItems(items.filter(item => item.id !== id));

  const handleRedo = name =>
    setItems([
      {
        id: Date.now(),
        name,
        completed: false
      },
      ...items
    ]);

  const handleClearList = () => setItems([]);

  const handleAdd = item => setItems([item, ...items]);

  return (
    <Form>
      <Form.Label
        className="d-flex justify-content-center my-3"
        style={{ fontWeight: "600", fontSize: "23px" }}
      >
        TO DO LIST
      </Form.Label>
      <div>
        <NewItemForm onAdd={handleAdd} />
        <Row>
          <Col className="mb-3">
            <ListGroup>
              {items.map(item => (
                <Item
                  key={item.id}
                  data={item}
                  onDelete={() => handleDeleteItem(item.id)}
                  onRedo={() => handleRedo(item.name)}
                  onDone={() => toggleCompleted(item.id)}
                />
              ))}
            </ListGroup>
          </Col>
        </Row>
        <Row className="justify-content-end pb-3">
          <Col xs="auto">
            <Button
              className="custom-btn rounded-pill"
              value="clear"
              onClick={handleClearList}
            >
              Clear <i className="fas fa-eraser" />
            </Button>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default ToDoList;
