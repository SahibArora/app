import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Canvas from './Canvas.jsx';
import Login from './Login.jsx';
import MainToolbar from './MainToolbar.jsx';
import Modal from './Modal.jsx';
import PagesList from './PagesList.jsx';
import SignUp from './SignUp.jsx';

import * as editorActions from '../action/editors.jsx';
import * as mainToolbarActions from '../action/mainToolbar.jsx';
import * as p5filesActions from '../action/p5files.jsx';
import * as pageActions from '../action/page.jsx';
import * as userActions from '../action/user.jsx';

const axios = require('axios');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.authAndLoadPage = this.authAndLoadPage.bind(this);
    this.authLoadedPage = this.authLoadedPage.bind(this);
    this.projectID = this.projectID.bind(this);
    this.savePage = this.savePage.bind(this);
  }

  componentDidMount() {
    this.authAndLoadPage();
  }

  onKeyPressed(e) {
    if (e.metaKey || e.ctrlKey) {
      switch (e.keyCode) {
        case 78: // n,N
          // new
          break;
        case 79: // o,O
          this.props.viewPagesModal();
          e.preventDefault();
          break;
        case 83: // s,S
          this.savePage();
          e.preventDefault();
          break;
        default:
          break;
      }
    }
  }

  projectID() {
    const location = this.props.location.pathname;
    const projectID = location.match(/\/pebl\/([\w-].*)/);
    return projectID ? projectID[1] : null;
  }

  authAndLoadPage() {
    if (this.projectID()) {
      this.props.setEditAccess(false);
      const projectID = this.projectID();
      axios.get(`/api/page/${this.projectID()}`)
        .then((res) => {
          this.props.loadPage(res.data[0].id, res.data[0].title, res.data[0].preview);
          this.props.loadEditors(res.data[0].editors, res.data[0].editorIndex);
          axios.get('/api/user')
            .then((res1) => {
              if (res1.data.pages && res1.data.pages.includes(projectID)) {
                this.props.setEditAccess(true);
              }
            });
        });
    }
    axios.get('/api/user')
      .then((res) => {
        if (res.data.name) {
          this.props.setUserName(res.data.name);
        }
      });
  }

  authLoadedPage() {
    if (this.projectID()) {
      this.props.setEditAccess(false);
      const projectID = this.projectID();
      axios.get('/api/user')
        .then((res1) => {
          if (res1.data.pages && res1.data.pages.includes(projectID)) {
            this.props.setEditAccess(true);
          }
        });
    }
  }

  savePage() {
    if (this.props.name) {
      if (this.props.id.length === 0) {
        this.props.submitPage(
          '',
          this.props.pageTitle,
          this.props.preview,
          this.props.editors,
          this.props.editorIndex
        );
      } else if (this.props.canEdit) {
        this.props.updatePage(
          this.props.id,
          this.props.pageTitle,
          this.props.preview,
          this.props.editors,
          this.props.editorIndex
        );
      } else {
        // this is for fork and save
        this.props.submitPage(
          this.props.id,
          `${this.props.pageTitle}-copy`,
          this.props.preview,
          this.props.editors,
          this.props.editorIndex
        );
      }
    } else {
      this.props.viewLoginModal();
    }
  }

  render() {
    return (
      <div
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >
        <nav>
          <MainToolbar
            addCodeEditor={this.props.addCodeEditor}
            addTextEditor={this.props.addTextEditor}
            addIframe={this.props.addIframe}
            name={this.props.name}
            pageTitle={this.props.pageTitle}
            preview={this.props.preview}
            setPageTitle={this.props.setPageTitle}
            savePage={this.savePage}
            unsavedChanges={this.props.unsavedChanges}
            isFileDropdownOpen={this.props.isFileDropdownOpen}
            toggleFileDropdown={this.props.toggleFileDropdown}
            togglePreviewMode={this.props.togglePreviewMode}
            viewPagesModal={this.props.viewPagesModal}
            viewLoginModal={this.props.viewLoginModal}
            viewSignUpModal={this.props.viewSignUpModal}
          />
        </nav>
        <Canvas
          preview={this.props.preview}

          updateFile={this.props.updateFile}
          editors={this.props.editors}
          setCurrentEditor={this.props.setCurrentEditor}
          removeEditor={this.props.removeEditor}
          setEditorSize={this.props.setEditorSize}
          setEditorPosition={this.props.setEditorPosition}
          setCurrentFile={this.props.setCurrentFile}

          playCode={this.props.playCode}
          stopCode={this.props.stopCode}
          updateCode={this.props.updateCode}
          updateConsoleOutput={this.props.updateConsoleOutput}
          setEditorMode={this.props.setEditorMode}
          updateTextChange={this.props.updateTextChange}
          setIframeURL={this.props.setIframeURL}
        />
        <Modal
          isOpen={this.props.isPagesModalOpen}
          closeModal={this.props.closePagesModal}
        >
          <PagesList
            pages={this.props.pages}
            deletePage={this.props.deletePage}
            setAllPages={this.props.setAllPages}
          />
        </Modal>
        <Modal
          isOpen={this.props.isLoginModalOpen}
          closeModal={this.props.closeLoginModal}
        >
          <Login
            authLoadedPage={this.authLoadedPage}
            loginName={this.props.loginName}
            loginPassword={this.props.loginPassword}
            updateUserName={this.props.updateUserName}
            updateUserPassword={this.props.updateUserPassword}
            setUserName={this.props.setUserName}
            closeLoginModal={this.props.closeLoginModal}
          />
        </Modal>
        <Modal
          isOpen={this.props.isSignUpModalOpen}
          closeModal={this.props.closeSignUpModal}
        >
          <SignUp
            authLoadedPage={this.authLoadedPage}
            loginName={this.props.loginName}
            loginPassword={this.props.loginPassword}
            updateUserName={this.props.updateUserName}
            updateUserPassword={this.props.updateUserPassword}
            signUserUp={this.props.signUserUp}
            setUserName={this.props.setUserName}
            closeSignUpModal={this.props.closeSignUpModal}
          />
        </Modal>
      </div>
    );
  }
}

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  editors: PropTypes.shape.isRequired,
  editorIndex: PropTypes.number.isRequired,

  pageTitle: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  pages: PropTypes.arrayOf(PropTypes.shape).isRequired,
  preview: PropTypes.bool.isRequired,
  unsavedChanges: PropTypes.bool.isRequired,

  canEdit: PropTypes.bool.isRequired,
  loginName: PropTypes.string.isRequired,
  loginPassword: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,

  isFileDropdownOpen: PropTypes.bool.isRequired,
  isPagesModalOpen: PropTypes.bool.isRequired,
  isLoginModalOpen: PropTypes.bool.isRequired,
  isSignUpModalOpen: PropTypes.bool.isRequired,

  setCurrentEditor: PropTypes.func.isRequired,
  removeEditor: PropTypes.func.isRequired,
  loadEditors: PropTypes.func.isRequired,
  setEditorPosition: PropTypes.func.isRequired,
  setEditorSize: PropTypes.func.isRequired,
  addCodeEditor: PropTypes.func.isRequired,
  playCode: PropTypes.func.isRequired,
  stopCode: PropTypes.func.isRequired,
  updateCode: PropTypes.func.isRequired,
  setEditorMode: PropTypes.func.isRequired,
  updateConsoleOutput: PropTypes.func.isRequired,
  addTextEditor: PropTypes.func.isRequired,
  updateTextChange: PropTypes.func.isRequired,
  addIframe: PropTypes.func.isRequired,
  setIframeURL: PropTypes.func.isRequired,
  updateFile: PropTypes.func.isRequired,
  setCurrentFile: PropTypes.func.isRequired,

  togglePreviewMode: PropTypes.func.isRequired,
  setPageTitle: PropTypes.func.isRequired,
  submitPage: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  loadPage: PropTypes.func.isRequired,
  setUserName: PropTypes.func.isRequired,
  deletePage: PropTypes.func.isRequired,
  setAllPages: PropTypes.func.isRequired,
  setEditAccess: PropTypes.func.isRequired,

  viewPagesModal: PropTypes.func.isRequired,
  closePagesModal: PropTypes.func.isRequired,
  viewLoginModal: PropTypes.func.isRequired,
  closeLoginModal: PropTypes.func.isRequired,
  viewSignUpModal: PropTypes.func.isRequired,
  closeSignUpModal: PropTypes.func.isRequired,
  toggleFileDropdown: PropTypes.func.isRequired,

  updateUserName: PropTypes.func.isRequired,
  updateUserPassword: PropTypes.func.isRequired,
  signUserUp: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    editors: state.editors.editors,
    editorIndex: state.editors.editorIndex,

    pageTitle: state.page.pageTitle,
    id: state.page.id,
    pages: state.page.pages,
    preview: state.page.preview,
    unsavedChanges: state.page.unsavedChanges,

    canEdit: state.user.canEdit,
    loginName: state.user.loginName,
    loginPassword: state.user.loginPassword,
    name: state.user.name,

    isFileDropdownOpen: state.mainToolbar.isFileDropdownOpen,
    isPagesModalOpen: state.mainToolbar.isPagesModalOpen,
    isLoginModalOpen: state.mainToolbar.isLoginModalOpen,
    isSignUpModalOpen: state.mainToolbar.isSignUpModalOpen,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    editorActions,
    mainToolbarActions,
    p5filesActions,
    pageActions,
    userActions),
  dispatch);
}
export default (connect(mapStateToProps, mapDispatchToProps)(App));
