import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CloseSVG from '../../../../images/close.svg';
import CopySVG from '../../../../images/copy.svg';
import DragSVG from '../../../../images/drag.svg';

import { duplicateEditor, removeEditor } from '../../../../action/editors.js';
import RolloverText from '../../Shared/RolloverText/RolloverText.jsx';

require('./widgetNav.scss');

class WidgetNav extends React.Component {
  constructor(props) {
    super(props);
    this.removeEditor = () => { this.props.removeEditor(this.props.id); };
    this.duplicateEditor = () => {
      this.props.duplicateEditor(this.props.id);
    };
  }

  render() {
    return (
      <nav className="widget__nav">
        <button
          className="widget__close"
          onClick={this.duplicateEditor.bind(this)}
          data-test="widget__duplicate"
        >
          <RolloverText
            rolloverText="Duplicate"
          >
            <CopySVG alt="duplicate widget" />
          </RolloverText>
        </button>
        <button
          className={`widget__close widget__drag drag__${this.props.id}`}
        >
          <RolloverText
            rolloverText="Drag and Drop"
          >
            <DragSVG alt="drag widget" />
          </RolloverText>
        </button>
        <button
          className="widget__close"
          onClick={this.removeEditor.bind(this)}
          data-test="widget__close"
        >
          <RolloverText
            rolloverText="Delete"
          >
            <CloseSVG alt="delete element" />
          </RolloverText>
        </button>
      </nav>
    );
  }
}

WidgetNav.propTypes = {
  duplicateEditor: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  removeEditor: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  duplicateEditor,
  removeEditor
}, dispatch);

export default connect(null, mapDispatchToProps)(WidgetNav);
