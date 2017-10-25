import React, { PropTypes } from 'react';
import CodeMirror from 'codemirror';

class ConsoleOutput extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }

  render() {
    return (
      <div>
        <h2> Console </h2>
        <p> {this.props.consoleOutputText.join("\n")} </p>
      </div>
    );
  }
}

export default ConsoleOutput;
