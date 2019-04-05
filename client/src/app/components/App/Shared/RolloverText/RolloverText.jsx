import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

require('./rolloverText.scss');

class RolloverText extends React.Component {
  render() {
    return (
      <div>
        <div className="rollovertext__container">
          {this.props.children}
        </div>
        <p className="rollovertext__text">
          {this.props.rolloverText}
        </p>
      </div>
    );
  }
}

export default RolloverText;
