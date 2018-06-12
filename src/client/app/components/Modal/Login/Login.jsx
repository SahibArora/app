import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';

import GoogleLoginButton from '../../shared/GoogleLoginButton/GoogleLoginButton.jsx';

require('./login.scss');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotice: false,
      notice: ''
    };
    this.loginSuccessful = this.loginSuccessful.bind(this);
    this.loginFailed = this.loginFailed.bind(this);
  }

  componentWillUnmount() {
    this.props.authLoadedPage();
  }

  loginFailed(error) {
    this.setState({
      showNotice: true,
      notice: error.response.data.msg
    });
  }

  loginSuccessful(response) {
    this.props.setUserName(response.data.user.name);
    this.props.closeLoginModal();
  }

  submitLoginUser(event, name, password) {
    axios.post('/users/login', {
      name,
      password
    })
      .then(this.loginSuccessful)
      .catch(this.loginFailed);
    event.preventDefault();
  }

  render() {
    return (
      <div className="login-modal__content">
        <h1 className="login-modal__title">Log In</h1>
        <form onSubmit={(event) => { this.submitLoginUser(event, this.userName.value, this.userPassword.value); }}>
          <div className="login-modal__div">
            <label htmlFor="login-modal-name" className="login-modal__label"> Email / Name
              <input
                id="login-modal-name"
                className="login-modal__input"
                type="text"
                ref={(userName) => { this.userName = userName; }}
              />
            </label>
          </div>
          <div className="login-modal__div">
            <label htmlFor="login-modal-password" className="login-modal__label"> Password
              <input
                id="login-modal-password"
                className="login-modal__input"
                type="password"
                ref={(userPassword) => { this.userPassword = userPassword; }}
              />
            </label>
          </div>

          <button className="forgot-modal__button" type="submit" value="Submit" >
            Submit
          </button>
        </form>

        <GoogleLoginButton
          onLoginSuccess={this.loginSuccessful}
          onLoginFailure={this.loginFailed}
        />

        <button
          className="login-modal__button"
          onClick={() => {
            this.props.viewForgotModal();
            this.props.closeLoginModal();
          }}
        >
          Forgot password
        </button>
        {this.state.showNotice &&
          <p className="forgot-modal__notice">
            {ReactHtmlParser(this.state.notice)}
          </p>
        }
      </div>
    );
  }

}

Login.propTypes = {
  authLoadedPage: PropTypes.func.isRequired,
  closeLoginModal: PropTypes.func.isRequired,
  setUserName: PropTypes.func.isRequired,
  viewForgotModal: PropTypes.func.isRequired
};

export default Login;
