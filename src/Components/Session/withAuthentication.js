import React, { useEffect, useState } from 'react';

import { withFirebase } from '../Firebase/context';
import { AuthUserContext } from '.';
import { auth } from 'firebase';

// state type, with default null
// props - what does a firebase object look like?
// the function on AuthStateChanged

// interface authenticationState {
//   authUser: object | null
// }

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    state = {
      authUser: null
    };

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      });
    }

    componentWillUnmount() {
      this.listener();
    }
    render() {
      const { authUser } = this.state;

      return (
        <AuthUserContext.Provider value={authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication; 


// attempt to turn higher order component into a hook
// const WithAuthentication = (Component) => {
//   const something = ({firebase}) => {
//   const [authUser, setAuthUser] = useState(null);

//   useEffect(() => {
//     const fetch = async () => {
//       await firebase.auth.onAuthStateChanged(authUser => {
//         if (authUser) {
//           setAuthUser(authUser);
//         }
//       });
//     };

//     fetch();

//   }, []);

//   return (
//     <Component {...this.props} authUser={authUser} />
//   );
// };
// };


// export default withFirebase(WithAuthentication);