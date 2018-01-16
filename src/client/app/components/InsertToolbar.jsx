import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import EditorSVG from '../images/editor.svg';
import TextSVG from '../images/text.svg';
import EmbedSVG from '../images/embed.svg';

class InsertToolbar extends React.Component {
  render() {
    return (
      <div className="insertToolbar__container">
        <button
          onClick={() => {
            this.props.addEditor();
            this.props.setUnsavedChanges(true);
          }}
          className="insertToolbar__button"
        >
          <EditorSVG alt="add editor" />
          editor
        </button>
        <button
          onClick={() => {
            this.props.addTextEditor();
            this.props.setUnsavedChanges(true);
          }}
          id="elementButton" className="insertToolbar__button"
        >
          <TextSVG alt="add text" />
          text box
        </button>
        <button
          onClick={() => {
            this.props.addIframe();
            this.props.setUnsavedChanges(true);
          }}
          className="insertToolbar__button"
        >
          <EmbedSVG alt="add embed" />
          embed
        </button>
      </div>
    );
  }

}

InsertToolbar.propTypes = {
  addEditor: PropTypes.func.isRequired,
  addIframe: PropTypes.func.isRequired,
  addTextEditor: PropTypes.func.isRequired,
  setUnsavedChanges: PropTypes.func.isRequired
};

export default InsertToolbar;
