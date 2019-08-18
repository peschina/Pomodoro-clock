import React from "react";
import { ListGroup, Row, Col } from "react-bootstrap";

import Pill from "./Pill";

const icons = {
	check: <i className="fas fa-check" />,
	redo: <i className="fas fa-redo" />,
	trash: <i className="fas fa-trash-alt" />
};

const Item = ({ data, onDelete, onDone, onRedo }) => {
	let style = data.completed
		? { textDecoration: "line-through", color: "#C8C8C8" }
		: { backgroundColor: "white" };

	return (
		<ListGroup.Item style={style}>
			<Row>
				<Col sm="6" className="d-flex align-items-center pb-2 pb-md-0 pb-sm-0">
					{data.name}
				</Col>
				<Col sm="3" className="pb-2 pb-md-0 pb-sm-0">
					<Pill value="completed" onClick={data.completed ? onRedo : onDone}>
						{data.completed ? "Redo " : "Done "}
						{data.completed ? icons.redo : icons.check}
					</Pill>
				</Col>
				<Col sm="3">
					<Pill value="delete" onClick={onDelete}>
						Delete {icons.trash}
					</Pill>
				</Col>
			</Row>
		</ListGroup.Item>
	);
};

export default Item;
