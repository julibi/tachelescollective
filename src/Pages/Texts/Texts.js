import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { withFirebase } from '../../Components/Firebase/context';
import { withAuthentication, AuthUserContext } from '../../Components/Session';
import history from '../../history';

import './Texts.css';

const toHHMMSS = (secs) => {
  var hours   = Math.floor(secs / 3600)
  var minutes = Math.floor(secs / 60) % 60
  var seconds = secs % 60

  return [hours,minutes,seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v,i) => v !== "00" || i > 0)
      .join(":")
}

const Texts = ({ firebase }) => {
  const [texts, setTexts] = useState([]);
  const [myUserId, setUserId] = useState(null);
  const [myUsername, setMyUsername] = useState(null);
  const [lastTextId, setLastTextId] = useState('');
  const [challengedName, setChallengedName] = useState('');
  const [countdown, setCountdown] = useState('');
  const [shouldShowReplyButton, setShouldShowReplyButton] = useState(false);
  // const addDays = (date, days) => {
  //   var result = new Date(date) + 48*60*60;
  //   return result;
  // }
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
    const getCurrentUsername = async () => {
      await firebase.users().once('value', snapshot => setMyUsername(snapshot.val().find(user => user.id === myUserId)?.username));
    };
    getCurrentUsername();
    getTexts();
  }, [firebase, myUserId, myUsername])

  useEffect(() => {
    if (texts.length) {
      setLastTextId(texts[0].id);
      setChallengedName(texts[0].challenged);

      if (texts[0].challenged === myUsername) {
        setShouldShowReplyButton(true)
      }
    } 
  }, [challengedName, myUsername, texts]);

  useEffect(() => {
      const createdAt = texts[0] ? texts[0].publishedAt.server_timestamp : null;
      if(createdAt) {
        const deadline = Math.floor(createdAt / 1000) + 172800;
        const now = Math.floor(new Date().getTime() / 1000);
        const currentCount = toHHMMSS(deadline - now);

        setTimeout(() => {
          setCountdown(currentCount)
        }, 1000);
      }
  }, [null, countdown, texts]);

  return (
    <div className="grid">
    <div className="sidebar"></div>
    <div className="textContainer">
      { countdown && <p>{countdown}</p> }
      <AuthUserContext.Consumer>
        {authUser => {  
          if(authUser) {
            setUserId(authUser.uid);
            return shouldShowReplyButton ? (
              <button onClick={() => history.push(`/write/${lastTextId}`)}>
                {`Come on ${myUsername}, reply!`}
              </button>) : (<div>{`It is ${challengedName}'s time to write.`}</div>);
          } else {
            return(
            <div>{`It is ${challengedName}'s time to write.`}</div>
            );
          }
        }}
      </AuthUserContext.Consumer>
      {texts.length > 0 && texts.map((text, index) =>
        <div className="textWrapper" key={text.id} onClick={() => history.push(`/texts/${text.id}`)}>
          <div className={classNames("textBlock",
            (index === texts.length - 1) && "lastTextBlock" 
          )}>
            {text.title && <h2>{text.title}</h2>}
            <h3>{text.authorName}</h3>
            <p className="text">{text.mainText}</p>
            </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default withAuthentication(withFirebase(Texts));