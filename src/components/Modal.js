import React from "react";
import "./Modal.css";

class Modal extends React.Component {
  render() {
    return (
      <div
        className={`modal-container ${this.props.display ? "disp-modal" : ""}`}
      >
        <div className="modal-title">
          <h2>{this.props.title}</h2>
        </div>
        <div className="modal-content">{this.props.children}</div>
      </div>
    );
  }
}

export default Modal;
