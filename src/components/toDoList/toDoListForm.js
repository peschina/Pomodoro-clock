import React from "react";
import { Form, ListGroup, Button, Row, Col } from "react-bootstrap";

class ToDoListForm extends React.Component {
		state= {
			toDoItems: [],
			toAdd: ""
		};
	
	  toggleCompleted = id => {
		const { toDoItems } = this.state;
	    let list = toDoItems.map(item => {
	     if (item.id == id) item.completed = true;
	      return item;
	    });
	    // Push item to end of array
		const item = toDoItems.filter(i => i.id == id);
		list = [...toDoItems.filter(i => i.id !== id), ...item];
	    this.setState({ toDoItems: list });
	  };

	  handleDeleteItem = id => {
	    const toDoItems = this.state.toDoItems.filter(item => item.id != id);
	    this.setState({ toDoItems });
	  };

	  handleRedo = name => {
	    // add item to ToDoItems eg. { id: 0, name: "Fix bugs", completed: false }
	    const item = {
	      id: Date.now(),
	      name,
	      completed: false
	    };
	    const toDoItems = [item, ...this.state.toDoItems];
	    this.setState({ toDoItems });
	  };
	  
	  handleClearList = () => {
	    this.setState({ toDoItems: [] });
	  };

	  handleAdd = e => {
	    this.setState({ toAdd: e.target.value });
	  };

	  handleSubmit = e => {
		const { toAdd } = this.state;
	    // check for form validation
	    if (toAdd === "") return;
	    e.preventDefault();
		
	    // add item to ToDoItems eg. { id: 0, name: "Fix bugs", completed: false }
	    const item = {
	      id: Date.now(),
	      name: toAdd,
	      completed: false
	    };
	    const toDoItems = [item, ...this.state.toDoItems];
	    this.setState({ toDoItems, toAdd: "" });
	  };
	  
	// for each ToDo Item return a li that displays the name of the item
  	// and two inputs, one to mark the item as completed and one to delete the item
	  renderLi() {
	    const list = this.state.toDoItems.map(item => {
	      const { name, id, completed } = item;
	      let style = completed
	        ? { textDecoration: "line-through", color: "#C8C8C8" }
	        : { backgroundColor: "white" };
	      let buttonValue = completed ? "Redo " : "Done ";
	      let faClass = completed ? "fas fa-redo" : "fas fa-check";
	      let onClickFunction = completed
	        ? () => this.handleRedo(name)
	        : () => this.toggleCompleted(id);
	      return (
	        <ListGroup.Item key={id} style={style}>
	          <Row>
	            <Col
	              sm="6"
	              className="d-flex align-items-center pb-2 pb-md-0 pb-sm-0"
	            >
	              {name}
	            </Col>
	            <Col sm="3" className="pb-2 pb-md-0 pb-sm-0">
	              <Button
				    className="rounded-pill"
	                variant="light"
	                value="completed"
	                onClick={onClickFunction}
	              >
	                {buttonValue}
	                <i className={faClass} />
	              </Button>
	            </Col>
	            <Col sm="3">
	              <Button
	                className="rounded-pill"
	                variant="light"
	                value="delete"
	                onClick={() => this.handleDeleteItem(id)}
	              >
	                {"Delete "}
	                <i className="fas fa-trash-alt" />
	              </Button>
	            </Col>
	          </Row>
	        </ListGroup.Item>
	      );
	    });
	    return list;
  	}
	
	renderToDoForm() {
		return (
			<div>
			<Form.Row className="d-flex flex-column flex-md-row flex-sm-row py-3">
		          <Col md={10} sm={9} className="pt-2">
		            <Form.Control
		              required
		              placeholder="Type in task description"
		              value={this.state.toAdd}
		              onChange={this.handleAdd}
		            />
		          </Col>
		          <Col md={2} sm={3} className="pt-2">
		            <Button
		              className="custom-btn btn-block rounded-pill"
		              type="submit"
		              onClick={this.handleSubmit}
		            >
		              {"Add "}
		              <i className="fas fa-plus" />
		            </Button>
		          </Col>
		        </Form.Row>
		        <Row>
		          <Col className="mb-3">
		            <ListGroup>{this.renderLi()}</ListGroup>
		          </Col>
		        </Row>
		        <Row className="justify-content-end pb-3">
		          <Col xs="auto">
		            <Button
		              className="custom-btn rounded-pill"
		              value="clear"
		              onClick={this.handleClearList}
		            >
		              {"Clear "}
		              <i className="fas fa-eraser" />
		            </Button>
		          </Col>
		        </Row>
			</div>
		);
	}
}

export default ToDoListForm;