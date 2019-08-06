import React from "react";
import { Form } from "react-bootstrap";
import ToDoListForm from "./toDoListForm";

class ToDoList extends ToDoListForm {
	constructor() {	
		super();
		this.state= {
				toDoItems: [
					{ id: 0, name: "Make laundry", completed: false },
	        		{ id: 1, name: "Buy groceries", completed: false },
	        		{ id: 2, name: "Call doctor", completed: false }
				],
				toAdd: ""
		};
	}
	
	render() {
		return(
		      <Form>
		        <Form.Label
		          className="d-flex justify-content-center my-3"
		          style={{ fontWeight: "600", fontSize: "23px" }}
		        >
		          TO DO LIST
		        </Form.Label>
				  {this.renderToDoForm()}
		      </Form>
		      
		);
	};
}

export default ToDoList;