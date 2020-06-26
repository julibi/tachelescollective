import React, { useEffect, useState } from 'react';
import { withFirebase } from '../../Components/Firebase/context';
import { withAuthentication, AuthUserContext } from '../../Components/Session';
import history from '../../history';

const TextDetail = ({ firebase }) => {
  return (
    <div>
      {"Textdetail"}
    </div>
  );
}

export default withAuthentication(withFirebase(TextDetail));