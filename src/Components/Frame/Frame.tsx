import React, { Fragment } from 'react';
import classNames from 'classnames';
import { RouteComponentProps, Link, useLocation } from "react-router-dom";
import { useMediaQuery } from 'react-responsive'
import Navigation from '../Navigation';

import './Frame.css';

interface FrameProps extends RouteComponentProps<any> {
  children: React.ReactNode;
}

const Frame = ({ children }: FrameProps) => {
  const location = useLocation();
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  if (isTabletOrMobile) {
    return (
      <div className="mobileGrid">
      <div className="mobileTopbar">
        {
          "TODO: Put the timer here."
        }
      </div>
      <div className="mobileSidebar"></div>
      <div className="mobileContent">{children}</div>
      </div>
    );
  }
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
          <div className={classNames(location.pathname === "/about" && "strikethrough", "navigationAbout")}>
            <Link to="/about">ABOUT</Link>
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </Fragment> 
  );
}

export default Frame;