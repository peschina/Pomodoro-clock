import React from "react";
import { Button } from "react-bootstrap";

const Pill = ({ value, onClick, children }) => (
	<Button className="rounded-pill" variant="light" {...{ value, onClick }}>
		{children}
	</Button>
);

export default Pill;
