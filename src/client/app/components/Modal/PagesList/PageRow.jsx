import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
// import { DragSource } from 'react-dnd';

import ItemTypes from './itemTypes.js';
import { deletePage } from '../../../action/page.js';
import DeleteIcon from '../../../images/trash.svg';


// const pageSource = {
//   beginDrag(props) {
//     return { id: props.id };
//   },

//   endDrag(props, monitor, component) {
//     if (!monitor.didDrop()) {
//       return;
//     }

//     const item = monitor.getItem();
//     const dropResult = monitor.getDropResult();
//     // CardActions.moveCardToList(item.id, dropResult.listId);
//   }
// };

// function collect(_connect, monitor) {
//   return {
//     connectDragSource: _connect.dragSource(),
//     isDragging: monitor.isDragging()
//   };
// }

function convertIsoDateToReadableDate(isoDate = '') {
  if (!isoDate || isoDate === '') {
    return '';
  }

  // format looks like: January 1, 2018
  return moment.utc(isoDate).format('MMMM D, YYYY');
}

class PageRow extends Component {
  render() {
    const { page } = this.props;
    const link = `/pebl/${page.id}`;
    return (
      <tr className="pages__row" key={page.id}>
        <td className="pages__col" > <a className="pages__link" href={link}> {page.title} </a> </td>
        <td className="pages__col" > {convertIsoDateToReadableDate(page.createdAt)} </td>
        <td className="pages__col" > {convertIsoDateToReadableDate(page.updatedAt)} </td>
        <td className="pages__col" >
          <button className="pages__delete" onClick={() => { this.props.deletePage({ page }); }}>
            <DeleteIcon alt="delete page" />
          </button>
        </td>
      </tr>
    );
  }
}

PageRow.propTypes = {
  deletePage: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  page: PropTypes.shape({}).isRequired
};

const mapStateToProps = (state, ownProps) => ({
  page: state.page.pages.byId[ownProps.id]
});
const mapDispatchToProps = dispatch => bindActionCreators({ deletePage }, dispatch);

// const DraggablePageRow = DragSource(ItemTypes.Page, pageSource, collect)(PageRow);

export default connect(mapStateToProps, mapDispatchToProps)(PageRow);
