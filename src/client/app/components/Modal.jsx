import React from 'react';
import {RichUtils} from 'draft-js';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
const axios = require('axios');

class Modal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ReactModal className="Modal" isOpen={this.props.isOpen}>
        <nav>
          <button className="Modal_closeButton" onClick={this.props.closeModal}>Close</button>
        </nav>
        {this.props.children}
      </ReactModal>
    );
  }
}

export default Modal;