import React, { useEffect, useState, Fragment } from 'react';
import classNames from 'classnames';
import { withFirebase } from '../../Components/Firebase/context';
import { withAuthentication, AuthUserContext } from '../../Components/Session';
import history from '../../history';
import Timer from '../../Components/Timer'
import Skeleton from '../../Components/Skeleton'
import { formatTime } from '../../lib/timeStampConverter'

import './Texts.css';

const Texts = ({ firebase }) => {
  const [texts, setTexts] = useState([]);

  useEffect(() => {
    const getTexts = async () => {
      // TODO: refactor, exact same fetching method inside Write.js
      await firebase.texts().on('value', snapshot => {
        let formattedTextlist = [];
        for (let i = 0; i < Object.values(snapshot.val()).length; i++) {
          formattedTextlist.push({id: Object.keys(snapshot.val())[i], ...Object.values(snapshot.val())[i]})
        }
        setTexts(formattedTextlist.reverse());
      });

    };
    getTexts();
  }, [firebase])

  return (
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
              {text.title && <h2 className="title">{`${text.title.toUpperCase()}`}</h2>}
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
  );
}

export default withAuthentication(withFirebase(Texts));