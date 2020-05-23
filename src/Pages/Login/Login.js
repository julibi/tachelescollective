import React, { Component } from 'react';

import { withFirebase } from '../../Components/Firebase/context';

const INITIAL_STATE = {
  email: '',
  username: '',
  password: '',
  error: '',
  isInvalid: true
};

class Login extends Component {
  state = { ...INITIAL_STATE };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    this.validate();
  };

  validate = () => {
    // TODO: be more accurate about validation
    const { email, username, password } = this.state;
    if (email.length && username.length && password.length) {
      this.setState({ isInvalid: false });
    }
  }

  handleSubmit = event => {
    const { email, password } = this.state;
    console.log(this.props);
    // this.props.firebase
    //   .doCreateUserWithEmailAndPassword(email, password)
    //   .then(authUser => {
    //     this.setState({ ...INITIAL_STATE });
    //   })
    //   .catch(error => {
    //     console.log('error');
    //     this.setState({ error });
    //   });
 
    event.preventDefault();
  };

  render() {
    const { email, username, password, error, isInvalid } = this.state;
    return(
      <form onSubmit={this.handleSubmit}>
        <input
          name="username"
          value={username}
          onChange={this.handleChange}
          type="text"
          placeholder="Username"
        />
        <input
          name="email"
          value={email}
          onChange={this.handleChange}
          type="text"
          placeholder="E-Mail"
        />
        <input
          name="password"
          value={password}
          onChange={this.handleChange}
          type="password"
          placeholder="Password"
        />
        <button type="submit" disabled={isInvalid}>Sign Up</button>

        {error && <p>{error.message}</p>}
    </form>
    );
  }
}

export default withFirebase(Login);