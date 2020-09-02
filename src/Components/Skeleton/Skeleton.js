import React from 'react';
import classNames from 'classnames';

import './Skeleton.css';

const NoMatch = ({ className }) => {
  return (
    <div className={classNames(className, "skeleton")} />
  );
}

export default NoMatch;
