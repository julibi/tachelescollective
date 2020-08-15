import React, { useEffect, useState, Fragment } from 'react';
import classNames from 'classnames';
import { withFirebase } from '../../Components/Firebase/context';
import { withAuthentication, AuthUserContext } from '../../Components/Session';
import history from '../../history';
import Pagegrid from '../../Components/Pagegrid';
import Timer from '../../Components/Timer'
import Skeleton from '../../Components/Skeleton'
import { formatTime } from '../../Components/Timer/Timer'

import './Texts.css';

// todo: modularize sidebar and nav, so that other componens just fit into the given space automatically

const Texts = ({ firebase }) => {
  const [texts, setTexts] = useState([]);

  useEffect(() => {
    const getTexts = async () => {
      await firebase.texts().on('value', snapshot => {
        let formattedTextlist = [];
        for (let i = 0; i < Object.values(snapshot.val()).length; i++) {
          formattedTextlist.push({id: Object.keys(snapshot.val())[i], ...Object.values(snapshot.val())[i]})
        }
        setTexts(formattedTextlist.reverse());
      });

    };
    // TODO: refactor, exact same fetching method inside Write.js
    // const getCurrentUsername = async () => {
    //   await firebase.users().once('value', snapshot => console.log(snapshot.val().find(item => item.id === myUserId)?.username));
    // };

    getTexts();
  }, [firebase])
  
  return (
    <Pagegrid>
      <div className="textContainer">
        <Timer page={"texts"} className="timer" lastText={texts[0]} />
        {texts.length === 0 &&
          <Fragment>
            <div className="textWrapper">
              <div className="textBlock">
                <Skeleton className={"skeletonTitle"} />
                <Skeleton className={"skeletonText"} />
                <Skeleton className={"skeletonMeta"} />
              </div>
            </div>
            <div className="textWrapper">
              <div className="textBlock">
                <Skeleton className={"skeletonTitle"} />
                <Skeleton className={"skeletonText"} />
                <Skeleton className={"skeletonMeta"} />
              </div>
            </div>
            <div className="textWrapper">
              <div className={classNames("textBlock", "lastTextBlock")}>
                <Skeleton className={"skeletonTitle"} />
                <Skeleton className={"skeletonText"} />
                <Skeleton className={"skeletonMeta"} />
              </div>
            </div>
          </Fragment>
        }
        {texts.length > 0 && texts.map((text, index) => {
          return (
            <div className="textWrapper" key={text.id} onClick={() => history.push(`/texts/${text.id}`)}>
              <div className={classNames("textBlock",
                (index === texts.length - 1) && "lastTextBlock" 
              )}>
                {text.title && <h1 className="title">{text.title}</h1>}
                <p className="text">{text.mainText}</p>
                <p className="author">
                  {`${text.authorName.toUpperCase()} -
                  ${formatTime(text.publishedAt.server_timestamp)}`}
                </p>
                </div>
            </div>
          )
        })}
      </div>
    </Pagegrid>
  );
}

export default withAuthentication(withFirebase(Texts));