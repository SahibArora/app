import * as ActionTypes from '../constants/reduxConstants.js';

const initialState = {
  isAccountDropdownOpen: false,
  isConfirmUserModalOpen: false,
  isAddDescriptionModalOpen: false,
  isExamplesModalOpen: false,
  isFileDropdownOpen: false,
  isForgotModalOpen: false,
  isHelpDropdownOpen: false,
  isLoginModalOpen: false,
  isPagesModalOpen: false,
  isResetModalOpen: false,
  isShareModalOpen: false,
  isSignUpModalOpen: false,
  isWelcomeModalOpen: false,
  isPreferencesPanelOpen: false,
  isForkPromptOpen: false
};

const mainToolbar = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.TOGGLE_FILE_DROPDOWN:
      return Object.assign({}, state, {
        isFileDropdownOpen: !state.isFileDropdownOpen
      });

    case ActionTypes.TOGGLE_HELP_DROPDOWN:
      return Object.assign({}, state, {
        isHelpDropdownOpen: !state.isHelpDropdownOpen
      });

    case ActionTypes.TOGGLE_ACCOUNT_DROPDOWN:
      return Object.assign({}, state, {
        isAccountDropdownOpen: !state.isAccountDropdownOpen
      });

    case ActionTypes.VIEW_EXAMPLES_MODAL:
      return Object.assign({}, state, {
        isExamplesModalOpen: true
      });

    case ActionTypes.CLOSE_EXAMPLES_MODAL:
      return Object.assign({}, state, {
        isExamplesModalOpen: false
      });

    case ActionTypes.VIEW_FORK_PROMPT:
      return Object.assign({}, state, {
        isForkPromptOpen: true
      });

    case ActionTypes.CLOSE_FORK_PROMPT:
      return Object.assign({}, state, {
        isForkPromptOpen: false
      });

    case ActionTypes.VIEW_PAGES_MODAL:
      return Object.assign({}, state, {
        isPagesModalOpen: true
      });

    case ActionTypes.CLOSE_PAGES_MODAL:
      return Object.assign({}, state, {
        isPagesModalOpen: false
      });

    case ActionTypes.VIEW_SHARE_MODAL:
      return Object.assign({}, state, {
        isShareModalOpen: true
      });

    case ActionTypes.CLOSE_SHARE_MODAL:
      return Object.assign({}, state, {
        isShareModalOpen: false
      });

    case ActionTypes.VIEW_LOGIN_MODAL:
      return Object.assign({}, state, {
        isLoginModalOpen: true
      });

    case ActionTypes.CLOSE_LOGIN_MODAL:
      return Object.assign({}, state, {
        isLoginModalOpen: false
      });

    case ActionTypes.VIEW_SIGN_UP_MODAL:
      return Object.assign({}, state, {
        isSignUpModalOpen: true
      });

    case ActionTypes.CLOSE_SIGN_UP_MODAL:
      return Object.assign({}, state, {
        isSignUpModalOpen: false
      });

    case ActionTypes.VIEW_FORGOT_MODAL:
      return Object.assign({}, state, {
        isForgotModalOpen: true
      });

    case ActionTypes.CLOSE_FORGOT_MODAL:
      return Object.assign({}, state, {
        isForgotModalOpen: false
      });

    case ActionTypes.VIEW_RESET_MODAL:
      return Object.assign({}, state, {
        isResetModalOpen: true
      });

    case ActionTypes.CLOSE_RESET_MODAL:
      return Object.assign({}, state, {
        isResetModalOpen: false
      });

    case ActionTypes.VIEW_CONFIRM_USER_MODAL:
      return Object.assign({}, state, {
        isConfirmUserModalOpen: true
      });

    case ActionTypes.CLOSE_CONFIRM_USER_MODAL:
      return Object.assign({}, state, {
        isConfirmUserModalOpen: false
      });

    case ActionTypes.VIEW_WELCOME_MODAL:
      return Object.assign({}, state, {
        isWelcomeModalOpen: true
      });

    case ActionTypes.CLOSE_WELCOME_MODAL:
      return Object.assign({}, state, {
        isWelcomeModalOpen: false
      });

    case ActionTypes.VIEW_ADD_DESCRIPTION_MODAL:
      return Object.assign({}, state, {
        isAddDescriptionModalOpen: true
      });

    case ActionTypes.CLOSE_ADD_DESCRIPTION_MODAL:
      return Object.assign({}, state, {
        isAddDescriptionModalOpen: false
      });

    case ActionTypes.TOGGLE_PREFERENCES_PANEL:
      return Object.assign({}, state, {
        isPreferencesPanelOpen: !state.isPreferencesPanelOpen
      });

    case ActionTypes.LOGOUT_USER:
      return initialState;

    default:
      return state;
  }
};

export default mainToolbar;
