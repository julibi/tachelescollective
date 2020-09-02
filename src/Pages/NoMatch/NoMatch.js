import React from 'react';
import Skeleton from '../../Components/Skeleton';

import './NoMatch.css';

const NoMatch = () => {
  return (
    <div className="noMatch">
      <p className="noMatchText">{'ups. hier gibts nichts zu sehen.'}</p>
      <div className="noMatchDivider" />
    </div>
  );
}

export default NoMatch;
