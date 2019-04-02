import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

require('./rolloverText.scss');

class RolloverText extends React.Component {
  render() {
    return (
      <div className="rollovertext__container">
        <p className="rollovertext__text">
          {this.props.rolloverText}
        </p>
        {this.props.children}
      </div>
    );
  }
}

export default RolloverText;
