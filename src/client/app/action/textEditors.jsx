import * as ActionTypes from '../constants.jsx';

export function addTextEditor() {
  return(dispatch) => {
    dispatch({
      type: ActionTypes.ADD_TEXT_EDITOR
    });
  };
}

export function updateTextChange(state) {
  return(dispatch) => {
    dispatch({
      type: ActionTypes.UPDATE_TEXT_CHANGE,
      state
    });
  };
}

export function setCurrentTextEditor(id, state) {
  return(dispatch) => {
    dispatch({
      type: ActionTypes.SET_CURRENT_TEXT_EDITOR,
      id,
      state
    });
  };
}
