import React from 'react';

import './Pagegrid.css';

const Pagegrid = ({children}) => {
  return(
    <div className="grid">
      <div className="sidebar" />
      {children}
    </div>
  );
}

export default Pagegrid;