import React from 'react';

import './Pagegrid.css';

const Pagegrid = ({children}) => {
  return(
    <div className="grid">
      <div className="sidebar" />
      <div className="content">{children}</div>
    </div>
  );
}

export default Pagegrid;