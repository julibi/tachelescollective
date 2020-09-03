import React from 'react';
import classNames from 'classnames';
import PropTypes, { InferProps } from 'prop-types';

import './Skeleton.css';

const NoMatch = ({ className }: InferProps<typeof NoMatch.propTypes>) => {
  return (
    <div className={classNames(className, "skeleton")} />
  );
}

export default NoMatch;

NoMatch.propTypes = {
  className: PropTypes.string
};
