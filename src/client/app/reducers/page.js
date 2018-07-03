import { normalize } from 'normalizr';

import * as ActionTypes from '../constants/reduxConstants.js';
import convertPixelHeightToGridHeight from '../utils/pixel-to-grid.js';
import { folderSchema, pageSchema } from '../schema.js';

const initialState = {
  id: '',
  rgl: {
    cols: 30,
    margin: [50, 25],
    padding: [0, 0],
    rowHeight: 1,
    width: 1440,
  },
  layout: [],
  textHeights: {},
  pages: {
    byId: {},
    allIds: [] // keeps track of display order
  },
  folders: {
    byId: {},
    allIds: []
  },
  pageTitle: 'Untitled',
  parentId: '',
  preview: false,
  unsavedChanges: false
};

function findChildFolderIds(foldersById = {}, folderId = '') {
  const folder = foldersById[folderId];
  if (!folder) {
    return [];
  }
  return [folderId, ...folder.children.reduce((accum, childId) => [
    ...accum,
    ...findChildFolderIds(foldersById, childId)
  ], [])];
}

const page = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.DELETE_PAGE: {
      const { pages } = state;
      delete pages.byId[action.pageId];
      return {
        ...state,
        pages: {
          byId: { ...pages.byId },
          allIds: pages.allIds.filter(pageId => pageId !== action.pageId)
        }
      };
    }

    case ActionTypes.SET_PAGE_TITLE:
      return Object.assign({}, state, {
        pageTitle: action.event.target.value
      });

    case ActionTypes.SET_PAGE_LAYOUT:
      return Object.assign({}, state, {
        layout: action.value
      });

    case ActionTypes.SET_PAGE_ID:
      return Object.assign({}, state, {
        id: action.id
      });

    case ActionTypes.SET_DB_PAGE:
      return Object.assign({}, state, {
        id: action.id,
        pageTitle: action.title,
        preview: action.preview,
        layout: action.layout
      });

    case ActionTypes.SET_ALL_PAGES: {
      const normalizedPageData = normalize(action.pages, [pageSchema]);
      const normalizedFolderData = normalize(action.folders, [folderSchema]);
      return Object.assign({}, state, {
        pages: {
          byId: {
            ...(normalizedPageData.entities.pages || {}),
            ...(normalizedFolderData.entities.pages || {})
          },
          allIds: (normalizedPageData.result || [])
            .concat(Object.keys(normalizedFolderData.entities.pages || {}))
            .filter((elem, pos, arr) => arr.indexOf(elem) === pos) // filter uniques
        },
        folders: {
          byId: (normalizedFolderData.entities.folders || {}),
          allIds: (normalizedFolderData.result || [])
        }
      });
    }

    case ActionTypes.SET_UNSAVED_CHANGES:
      return Object.assign({}, state, {
        unsavedChanges: action.value
      });

    case ActionTypes.TOGGLE_PREVIEW_MODE:
      return Object.assign({}, state, {
        preview: !state.preview
      });

    case ActionTypes.DUPLICATE_EDITOR: {
      const layout = state.layout;
      const originalEditorIndex = layout.findIndex(x => x.i === action.originalEditorId);
      const originalEditor = layout[originalEditorIndex];
      const duplicateEditor = { ...originalEditor };
      duplicateEditor.i = action.duplicateEditorId;
      // setting the duplicate's y to 1 less than the original's y + height
      // seems to place the duplicate directly below the original
      duplicateEditor.y = originalEditor.y + originalEditor.h + -1;
      layout.splice(originalEditorIndex, 0, duplicateEditor);
      return Object.assign({}, state, { layout });
    }

    case ActionTypes.RESIZE_TEXT_EDITOR: {
      const { margin, rowHeight } = state.rgl;
      const layout = JSON.parse(JSON.stringify(state.layout));
      const textHeights = state.textHeights;
      const gridItemIndex = layout.findIndex(x => x.i === action.id);
      // need to create copy of the grid item because ReactGridLayout tests
      // for object equality when deciding whether to re-render grid items
      // reference: https://github.com/STRML/react-grid-layout/issues/382#issuecomment-299734450
      const gridItem = JSON.parse(JSON.stringify(layout[gridItemIndex]));

      // convert from pixel height to grid units
      // reference: https://github.com/STRML/react-grid-layout/issues/190#issuecomment-200864419
      const h = convertPixelHeightToGridHeight(action.height, margin, rowHeight, gridItem.maxH);
      gridItem.h = h;
      textHeights[action.id] = h;

      layout[gridItemIndex] = gridItem;
      return Object.assign({}, state, { layout, textHeights });
    }

    case ActionTypes.UPDATE_TEXT_HEIGHT: {
      const { margin, rowHeight } = state.rgl;
      const gridItem = state.layout.find(x => x.i === action.id);
      const h = convertPixelHeightToGridHeight(action.height, margin, rowHeight, gridItem.maxH);
      const textHeights = {
        ...state.textHeights,
        [action.id]: h
      };
      return Object.assign({}, state, { textHeights });
    }

    case ActionTypes.CREATE_FOLDER: {
      const { folders } = state;
      const normalizedFolderData = normalize(action.folder, folderSchema);
      return {
        ...state,
        folders: {
          ...folders,
          byId: {
            ...folders.byId,
            ...(normalizedFolderData.entities.folders || {}),
          },
          allIds: folders.allIds.concat(normalizedFolderData.result || [])
        }
      };
    }

    case ActionTypes.DELETE_FOLDER: {
      const { folders, pages } = state;
      const folderIdsToDelete = findChildFolderIds(folders.byId, action.folderId);
      const pageIdsToDelete = pages.allIds.filter(pageId => folderIdsToDelete.includes(pages.byId[pageId].folder));
      return {
        ...state,
        folders: {
          byId: Object.values(folders.byId).reduce((accum, folder) => {
            if (folderIdsToDelete.includes(folder._id)) {
              return accum;
            }
            return { ...accum, [folder._id]: folder };
          }, {}),
          allIds: folders.allIds.filter(folderId => !folderIdsToDelete.includes(folderId))
        },
        pages: {
          byId: Object.values(pages.byId).reduce((accum, p) => {
            if (pageIdsToDelete.includes(p._id)) {
              return accum;
            }
            return { ...accum, [p._id]: p };
          }, {}),
          allIds: pages.allIds.filter(pageId => !pageIdsToDelete.includes(pageId))
        }
      };
    }

    case ActionTypes.MOVE_PAGE_TO_TOP_LEVEL: {
      const pageId = action.pageId;
      const { folders, pages } = state;
      const pageToMove = pages.byId[pageId];
      const folderId = pageToMove.folder;
      if (!folderId) {
        return state;
      }

      const folder = folders.byId[folderId];
      folder.files = folder.files.filter(pId => pId !== pageId);

      delete pageToMove.folder;
      return {
        ...state,
        folders: {
          ...folders,
          byId: {
            ...folders.byId,
            [folderId]: { ...folder }
          }
        },
        pages: {
          ...pages,
          byId: {
            ...pages.byId,
            [pageId]: { ...pageToMove }
          }
        }
      };
    }

    case ActionTypes.MOVE_PAGE_TO_FOLDER: {
      const { folderId, pageId } = action;
      const { folders, pages } = state;

      const pageToMove = pages.byId[pageId];
      pageToMove.folder = folderId;

      const folder = folders.byId[folderId];
      folder.files = folder.files.concat(pageId);
      return {
        ...state,
        folders: {
          ...folders,
          byId: {
            ...folders.byId,
            [folderId]: { ...folder }
          }
        },
        pages: {
          ...pages,
          byId: {
            ...pages.byId,
            [pageId]: { ...pageToMove }
          }
        }
      };
    }

    case ActionTypes.MOVE_FOLDER_TO_TOP_LEVEL: {
      const childFolderId = action.folderId;
      const { folders } = state;
      const childFolder = folders.byId[childFolderId];
      const parentFolderId = childFolder.parent;
      if (!parentFolderId) {
        return state;
      }

      const parentFolder = folders.byId[parentFolderId];
      parentFolder.children = parentFolder.children.filter(folderId => folderId !== childFolderId);

      delete childFolder.parent;
      return {
        ...state,
        folders: {
          ...folders,
          byId: {
            ...folders.byId,
            [childFolderId]: { ...childFolder },
            [parentFolderId]: { ...parentFolder }
          }
        }
      };
    }

    case ActionTypes.MOVE_FOLDER_TO_FOLDER: {
      const { childFolderId, parentFolderId } = action;
      const { folders, } = state;

      const childFolder = folders.byId[childFolderId];
      childFolder.parent = parentFolderId;

      const parentFolder = folders.byId[parentFolderId];
      parentFolder.children = parentFolder.children.concat(childFolderId);
      return {
        ...state,
        folders: {
          ...folders,
          byId: {
            ...folders.byId,
            [childFolderId]: { ...childFolder },
            [parentFolderId]: { ...parentFolder }
          }
        },
      };
    }

    default:
      return state;
  }
};

export default page;
