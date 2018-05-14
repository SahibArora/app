import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class ConfrmUser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showReset: false,
      notice: ''
    };
    this.confirmSuccess = this.confirmSuccess.bind(this);
    this.confirmFailed = this.confirmFailed.bind(this);
    this.confirmToken = this.confirmToken.bind(this);
    this.submitConfirmUser = this.submitConfirmUser.bind(this);
    this.resendConfirmUser = this.resendConfirmUser.bind(this);
  }

  confirmSuccess(msg) {
    this.setState({
      showReset: false,
      notice: msg
    });
  }

  confirmFailed(msg) {
    this.setState({
      showReset: true,
      notice: msg
    });
  }

  confirmToken() {
    const location = this.props.location.pathname;
    const tokenID = location.match(/\/confirmation\/([\w-].*)/);
    return tokenID ? tokenID[1] : null;
  }

  submitConfirmUser(token) {
    axios.post('/users/confirmation', {
      token
    })
    .then((res) => {
      this.confirmSuccess(res.data.msg);
    })
    .catch((err) => {
      this.confirmFailed(err.response.data.msg);
    });
  }

  resendConfirmUser(event, email) {
    axios.post('/users/resendconfirmation', {
      email
    })
    .then((res) => {
      this.confirmSuccess(res.data.msg);
    })
    .catch((err) => {
      console.log(err);
      this.confirmFailed(err.response.data.msg);
    });
    event.preventDefault();
  }

  componentDidMount() {
    this.submitConfirmUser(this.confirmToken());
  }

  render() {
    return (
      <div className="confirm-modal__content">
        <p className="confirm-modal__notice">
          {this.state.notice}
        </p>
        {
          this.state.showReset &&
          <form onSubmit={(event) => { this.resendConfirmUser(event, this.email.value); }}>
            <div className="confirm-modal__div">
              <label htmlFor="confirm-modal-email" className="confirm-modal__label"> Email
                <input
                  id="confirm-modal-email"
                  className="confirm-modal__input"
                  type="text"
                  ref={(email) => { this.email = email; }}
                />
              </label>
            </div>
            <button className="confirm-modal__button" type="submit" value="Submit" >
            Resend Token
            </button>
          </form>
        }


      </div>
    );
  }

}

ConfrmUser.propTypes = {
  closeLoginModal: PropTypes.func.isRequired,
  setUserName: PropTypes.func.isRequired
};

export default ConfrmUser;
