import React from "react";
import { Modal, Button } from "react-bootstrap";

function ModalAbout(props) {
	return(
		<Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>About</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>
			<p>Ticki is an easy to use and customizable Pomodoro Technique timer, developed with React.</p>

			<p>The Pomodoro Technique is a time management method created by Francesco Cirillo. It helps improving 
			productivity by taking short scheduled breaks regularly, and it can be used for any task.</p>

			<p>Decide the tasks you need to complete and put them on the to do list.
			Start the Pomodoro timer and work until the end of the pomdodoro. Take a short break (3-5 minutes)
			and tick the tasks you have completed. Another working pomodoro will follow. Every 4 Pomodoros take 
			a longer break, (15–30 minutes).</p>

			<p>Take a look at the setting section to customize timers length, theme and sound.</p>
		</span>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={props.handleClose}
          className="rounded-pill custom-btn"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>	
	);
}

export default ModalAbout;