import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { withFirebase } from '../../Components/Firebase/context';
import { withAuthentication, AuthUserContext } from '../../Components/Session';
import history from '../../history';
import Timer from '../../Components/Timer'

import './Texts.css';

// todo: modularize sidebar and nav, so that other componens just fit into the given space automatically

const Texts = ({ firebase }) => {
  const [texts, setTexts] = useState([]);
  const [myUserId, setUserId] = useState(null);
  const [myUsername, setMyUsername] = useState(null);
  const [lastTextId, setLastTextId] = useState('');
  const [challengedName, setChallengedName] = useState('');
  const [countdown, setCountdown] = useState('');
  const [shouldShowReplyButton, setShouldShowReplyButton] = useState(false);

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

  return (
    <div className="grid">
    <div className="sidebar"></div>
    <div className="textContainer">
      <Timer page={"texts"} className="timer">
        <AuthUserContext.Consumer>
          {authUser => {  
            if(authUser) {
              setUserId(authUser.uid);
              return shouldShowReplyButton ? (
                <button onClick={() => history.push(`/write/${lastTextId}`)}>
                  {`Come on ${myUsername}, reply!`}
                </button>) : (<div>{`${challengedName.toUpperCase()} IST DRAN IN`}</div>);
            } else {
              return(
              <div>{`${challengedName} IST DRAN IN`}</div>
              );
            }
          }}
        </AuthUserContext.Consumer>
      </Timer>
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