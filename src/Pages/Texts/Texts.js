import React, { useEffect, useState, Fragment } from 'react';
import { useHistory } from 'react-router';
import classNames from 'classnames';
import { useFirebase } from '../../Components/Firebase';
import Timer from '../../Components/Timer'
import Skeleton from '../../Components/Skeleton'
import { formatTime } from '../../lib/timeStampConverter'

import './Texts.css';

const Texts = () => {
  const { firebaseFunctions } = useFirebase();
  const history = useHistory();
  const [texts, setTexts] = useState([]);

  useEffect(() => {
    const getTexts = async () => {
      // TODO: refactor, exact same fetching method inside Write.js
      await firebaseFunctions.texts().on('value', snapshot => {
        let formattedTextlist = [];
        for (let i = 0; i < Object.values(snapshot.val()).length; i++) {
          formattedTextlist.push({id: Object.keys(snapshot.val())[i], ...Object.values(snapshot.val())[i]})
        }
        setTexts(formattedTextlist.reverse());
      });

    };
    getTexts();
  }, [firebaseFunctions])

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

export default Texts;