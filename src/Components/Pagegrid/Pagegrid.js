import React from 'react';
import classNames from 'classnames';

import './Pagegrid.css';

const Pagegrid = ({children}) => {
  return(
    <div className="grid">
      <div className="sidebar">
        <div className={classNames("logo", "first")}>33</div>
        <div className="logo">Z</div>
        <div className={classNames("logo", "third")}>E<span className="neon">I</span></div>
        <div className="logo"><span className="neon">C</span>HE</div>
        <div className={classNames("logo", "fifth")}>N</div>
      </div>
      <div className="content">{children}</div>
    </div>
  );
}

export default Pagegrid;