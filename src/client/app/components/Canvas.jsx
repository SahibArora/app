import React, { PropTypes } from 'react';
import Rnd from 'react-rnd';

import EditorContainer from './EditorContainer.jsx';
import Iframe from './Iframe.jsx';
import TextEditor from './TextEditor.jsx';

class Canvas extends React.Component {

  renderEditors() {
    const editorsHTML = [];
    const ids = Object.keys(this.props.editors);
    ids.forEach((id) => {
      const extendsProps = {
        onMouseEnter: () => {
          this.props.setCurrentEditor(id);
        }
      };
      const dragHandle = `.drag__${id}`;
      editorsHTML.push(
        <Rnd
          className="resize-container"
          size={{ width: this.props.editors[id].width, height: this.props.editors[id].height }}
          position={{ x: this.props.editors[id].x, y: this.props.editors[id].y }}
          onDragStop={(e, d) => { this.props.setEditorPosition(d.x, d.y); }}
          dragHandleClassName={dragHandle}
          onResize={(e, direction, ref, delta, position) => {
            this.props.setEditorSize(ref.offsetWidth, ref.offsetHeight);
            this.props.setUnsavedChanges(true);
          }}
          minWidth={this.props.editors[id].minWidth}
          minHeight={this.props.editors[id].minHeight}
          extendsProps={extendsProps}
          bounds=".canvas"
        >
          <EditorContainer
            x={this.props.editors[id].x}
            y={this.props.editors[id].y}
            setUnsavedChanges={this.props.setUnsavedChanges}
            key={id}
            editorId={id}
            playCode={this.props.playCode}
            stopCode={this.props.stopCode}
            updateCode={this.props.updateCode}
            isPlaying={this.props.editors[id].isPlaying}
            editorMode={this.props.editors[id].editorMode}
            consoleOutputText={this.props.editors[id].consoleOutputText}
            code={this.props.editors[id].code}
            setCurrentEditor={this.props.setCurrentEditor}
            setEditorMode={this.props.setEditorMode}
            updateConsoleOutput={this.props.updateConsoleOutput}
            removeEditor={this.props.removeEditor}
          />
        </Rnd>
      );
    });
    return editorsHTML;
  }

  renderTextEditors() {
    const textEditors = [];

    const ids = Object.keys(this.props.textEditors);
    ids.forEach((id) => {
      const extendsProps = {
        onMouseOver: () => {
          this.props.setCurrentTextEditor(this.props.textEditors[id].id, this.props.textEditors[id].editorState);
        }
      };
      const dragHandle = `.drag__${id}`;
      textEditors.push(
        <Rnd
          className="resize-container"
          size={{ width: this.props.textEditors[id].width, height: this.props.textEditors[id].height }}
          position={{ x: this.props.textEditors[id].x, y: this.props.textEditors[id].y }}
          onDragStop={(e, d) => { this.props.setTextEditorPosition(d.x, d.y); }}
          dragHandleClassName={dragHandle}
          onResize={(e, direction, ref, delta, position) => {
            this.props.setTextEditorSize(ref.offsetWidth, ref.offsetHeight);
            this.props.setUnsavedChanges(true);
          }}
          minWidth={this.props.textEditors[id].minWidth}
          minHeight={this.props.textEditors[id].minHeight}
          extendsProps={extendsProps}
          bounds=".canvas"
        >
          <TextEditor
            x={this.props.textEditors[id].x}
            y={this.props.textEditors[id].y}
            setUnsavedChanges={this.props.setUnsavedChanges}
            key={id}
            editorState={this.props.textEditors[id].editorState}
            onChange={this.props.updateTextChange}
            ref={this.props.textEditors[id].id}
            id={this.props.textEditors[id].id}
            currentTextEditorState={this.props.currentTextEditorState}
            currentTextEditorId={this.props.currentTextEditorId}
            setCurrentTextEditor={this.props.setCurrentTextEditor}
            removeTextEditor={this.props.removeTextEditor}
          />
        </Rnd>
      );
    });

    return textEditors;
  }

  renderIframes() {
    const iframes = [];
    const ids = Object.keys(this.props.iframes);
    ids.forEach((id) => {
      const extendsProps = {
        onMouseOver: () => {
          this.props.setCurrentIframe(id);
        }
      };
      const dragHandle = `.drag__${id}`;
      iframes.push(
        <Rnd
          className="resize-container"
          size={{ width: this.props.iframes[id].width, height: this.props.iframes[id].height }}
          position={{ x: this.props.iframes[id].x, y: this.props.iframes[id].y }}
          onDragStop={(e, d) => { this.props.setIframePosition(d.x, d.y); }}
          dragHandleClassName={dragHandle}
          onResize={(e, direction, ref, delta, position) => {
            this.props.setIframeSize(ref.offsetWidth, ref.offsetHeight);
            this.props.setUnsavedChanges(true);
          }}
          minWidth={this.props.iframes[id].minWidth}
          minHeight={this.props.iframes[id].minHeight}
          extendsProps={extendsProps}
          bounds=".canvas"
        >
          <Iframe
            x={this.props.iframes[id].x}
            y={this.props.iframes[id].y}
            setUnsavedChanges={this.props.setUnsavedChanges}
            key={id}
            id={id}
            setIframeURL={this.props.setIframeURL}
            iframeURL={this.props.iframes[id].url}
            setCurrentIframe={this.props.setCurrentIframe}
            removeIframe={this.props.removeIframe}
          />
        </Rnd>
      );
    });
    return iframes;
  }

  render() {
    return (
      <section className="canvas">
        {this.renderEditors()}
        {this.renderTextEditors()}
        {this.renderIframes()}
      </section>
    );
  }

}

Canvas.propTypes = {
  setUnsavedChanges: PropTypes.func.isRequired,

  editors: PropTypes.objectOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    consoleOutputText: PropTypes.arrayOf(PropTypes.string),
    code: PropTypes.string.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    editorMode: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    minWidth: PropTypes.number.isRequired,
    minHeight: PropTypes.number.isRequired
  })).isRequired,
  textEditors: PropTypes.objectOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    editorState: PropTypes.shape,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    minWidth: PropTypes.number.isRequired,
    minHeight: PropTypes.number.isRequired
  })).isRequired,
  iframes: PropTypes.objectOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    minWidth: PropTypes.number.isRequired,
    minHeight: PropTypes.number.isRequired
  })).isRequired,

  isPlaying: PropTypes.bool.isRequired,
  playCode: PropTypes.func.isRequired,
  stopCode: PropTypes.func.isRequired,
  updateCode: PropTypes.func.isRequired,
  setCurrentEditor: PropTypes.func.isRequired,
  updateConsoleOutput: PropTypes.func.isRequired,
  setEditorMode: PropTypes.func.isRequired,
  removeEditor: PropTypes.func.isRequired,
  setEditorSize: PropTypes.func.isRequired,
  setEditorPosition: PropTypes.func.isRequired,

  removeIframe: PropTypes.func.isRequired,
  setCurrentIframe: PropTypes.func.isRequired,
  setIframePosition: PropTypes.func.isRequired,
  setIframeSize: PropTypes.func.isRequired,
  setIframeURL: PropTypes.func.isRequired,

  currentTextEditorId: PropTypes.string.isRequired,
  currentTextEditorState: PropTypes.shape.isRequired,
  removeTextEditor: PropTypes.func.isRequired,
  setCurrentTextEditor: PropTypes.func.isRequired,
  setTextEditorSize: PropTypes.func.isRequired,
  setTextEditorPosition: PropTypes.func.isRequired,
  updateTextChange: PropTypes.func.isRequired,

};

export default Canvas;
