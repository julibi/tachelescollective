import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../Components/Firebase/context';

const INITIAL_STATE = {
  email: '',
  username: '',
  password: '',
  error: '',
  isInvalid: true
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    this.validate();
  };

  validate() {
    // TODO: be more accurate about validation
    const { email, password } = this.state;
    if (email.length && password.length) {
      this.setState({ isInvalid: false });
    }
  }

  // TODO async await
  handleSubmit(event) {
    const { email, password } = this.state;
  
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push('/texts');
        console.log('success');
      })
      .catch(error => {
        console.log('error');
        this.setState({ error });
      });
      event.preventDefault(); 
  };

  render() {
    const { email, password, error, isInvalid } = this.state;
    return(
      <form onSubmit={this.handleSubmit}>
        {/* <input
          name="username"
          value={username}
          onChange={this.handleChange}
          type="text"
          placeholder="Username"
        /> */}
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

export default withRouter(withFirebase(Login));