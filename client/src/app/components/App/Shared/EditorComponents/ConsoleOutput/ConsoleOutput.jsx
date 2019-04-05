import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import RolloverText from '../../RolloverText/RolloverText.jsx';

require('./consoleOutput.scss');

class ConsoleOutput extends React.Component {
  render() {
    const toggleButton = this.props.isConsoleOpen ? '&or;' : '&and;';
    return (
      <div className="console__outputDiv">
        <nav //eslint-disable-line
          className="console__nav"
          tabIndex="0" //eslint-disable-line
          onClick={this.props.toggleConsole}
        >
          <p className="console__heading"> Console </p>
          <button
            className="console__toggle"
          >
            <RolloverText
              rolloverText="Toggle Console"
            >
              {ReactHtmlParser(toggleButton)}
            </RolloverText>
          </button>
        </nav>
        {this.props.isConsoleOpen && (
          <p className="console__output-text">
            {' '}
            {this.props.consoleOutputText.join('\n')}
            {' '}
          </p>
        )}
      </div>
    );
  }
}

ConsoleOutput.propTypes = {
  consoleOutputText: PropTypes.arrayOf(PropTypes.string).isRequired,
  isConsoleOpen: PropTypes.bool.isRequired,
  toggleConsole: PropTypes.func.isRequired
};

export default ConsoleOutput;
