import React from 'react';
import Pagegrid from '../../Components/Pagegrid';
import Skeleton from '../../Components/Skeleton';

import './NoMatch.css';

const NoMatch = () => {
  return (
    <Pagegrid>
      <div className="noMatch">
        <p className="noMatchText">{'ups. hier gibts nichts zu sehen.'}</p>
        <div className="noMatchDivider" />
      </div>
    </Pagegrid>
  );
}

export default NoMatch;
