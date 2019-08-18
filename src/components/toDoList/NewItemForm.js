import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";

const NewItemForm = ({ onAdd }) => {
	const [value, setValue] = useState("");

	const handleChange = e => setValue(e.target.value);

	const handleSubmit = e => {
		e.preventDefault();

		if (value === "") return;

		onAdd({
			id: Date.now(),
			name: value,
			completed: false
		});

		setValue("");
	};

	return (
		<Form.Row className="d-flex flex-column flex-md-row flex-sm-row py-3">
			<Col md={10} sm={9} className="pt-2">
				<Form.Control
					required
					placeholder="Type in task description"
					value={value}
					onChange={handleChange}
				/>
			</Col>

			<Col md={2} sm={3} className="pt-2">
				<Button
					className="custom-btn btn-block rounded-pill"
					type="submit"
					onClick={handleSubmit}
				>
					{"Add "}
					<i className="fas fa-plus" />
				</Button>
			</Col>
		</Form.Row>
	);
};

export default NewItemForm;
