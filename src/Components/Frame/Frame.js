import React, { Fragment } from 'react';
import classNames from 'classnames';
import { Link, withRouter } from "react-router-dom";
import Navigation from '../Navigation';

import './Frame.css';

// interface FrameProps {
//   children: React.ReactNode;
// }

// TODO: withRouter typescript!

const Frame = ({ children, location }) => {
  return (
    <Fragment>
      <Navigation />
      <div className="grid">
        <div className="sidebar">
          <div className={classNames("logo", "first")}>33</div>
          <div className="logo">Z</div>
          <div className={classNames("logo", "third")}>E<span className="neon">I</span></div>
          <div className="logo"><span className="neon">C</span>HE</div>
          <div className={classNames("logo", "fifth")}>N</div>
          <div className={classNames(location.pathname === "/about" && "strikethrough","navigationAbout")}>
            <Link to="/about">ABOUT</Link>
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </Fragment>
  );
}

export default withRouter(Frame);