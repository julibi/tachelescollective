import React, { useEffect, useState } from 'react';
import { withFirebase } from '../../Components/Firebase/context';
import history from '../../history';

import './Text.css';

// TODO: we need a loading state
const Texts = ({ firebase }) => {
  const [texts, setTexts] = useState([]);
  const [myUsername, setMyUsername] = useState('');
  const [lastTextId, setLastTextId] = useState('');
  const [shouldShowReplyButton, setshouldShowReplyButton] = useState(false);
  const [shouldShowWaitingForResponseText, setShouldShowWaitingForResponseText] = useState(false);

  useEffect(() => {
    const getTexts = async () => {
      const results = await firebase.texts().once('value', snapshot => snapshot);
      let formattedTextlist = [];
      for (let i = 0; i < Object.values(results.val()).length; i++) {
        formattedTextlist.push({id: Object.keys(results.val())[i], ...Object.values(results.val())[i]})
      }
      setTexts(formattedTextlist);
    };
    // TODO: refactor, exact same fetching method inside Write.js
    const getCurrentUsername = async () => {
      await firebase.users().once('value', snapshot => setMyUsername(snapshot.val().find(item => item.id === firebase.currentUser()).username));
    };
    getCurrentUsername();
    getTexts();
  }, [firebase])

  useEffect(() => {
    if (texts.length) {
      setLastTextId(texts[texts.length-1].id);
      if (texts[texts.length-1].challenged === myUsername) {
        setshouldShowReplyButton(true)
      } else if (texts[texts.length-1].authorName === myUsername) {
        setShouldShowWaitingForResponseText(true)
      }
    } 
  }, [myUsername, texts]);

  return (
    <div className="container">
      {texts.length > 0 && texts.map(text =>
        <div className="textWrapper" key={text.id}>
          {text.title && <h2>{text.title}</h2>}
          <h3>{text.authorName}</h3>
          <p>{text.mainText}</p>
        </div>
        )}
        {/* TODO: we need to pass something as query parameters, the ID of the text being replied to   */}
        { shouldShowReplyButton &&
          <button onClick={() => history.push(`/write/${lastTextId}`)}>{'Come on, reply!'}</button>
        }
        { shouldShowWaitingForResponseText &&
          <p>{'Waiting for that puss to reply lol!'}</p>
        }
    </div>
  );
}

export default withFirebase(Texts);