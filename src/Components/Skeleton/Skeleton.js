import React from 'react';

import './Skeleton.css';

const NoMatch = ({ type }) => {
  if (type === 'texts') {
    return (
      <div className="skeleton texts" />
    );
  }
}

export default NoMatch;
