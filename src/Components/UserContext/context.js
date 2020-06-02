import React from 'react';
 
const UserContext = React.createContext(null);
 
export const withUserContext = Component => props => (
  <UserContext.Consumer>
    {whatexactly => <Component {...props} whatexactly={whatexactly} />}
  </UserContext.Consumer>
);

export default UserContext;