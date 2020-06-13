import React, { useEffect, useState } from 'react';
import { withFirebase } from '../../Components/Firebase/context';
import { withAuthentication, AuthUserContext } from '../../Components/Session';
import history from '../../history';

import './Text.css';




// TODO: we need a loading state
const Texts = ({ firebase }) => {
  const [texts, setTexts] = useState([]);
  const [myUserId, setUserId] = useState(null);
  const [myUsername, setMyUsername] = useState(null);
  const [lastTextId, setLastTextId] = useState('');
  const [challengedName, setChallengedName] = useState('');
  const [shouldShowReplyButton, setShouldShowReplyButton] = useState(false);

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
    // const getCurrentUsername = async () => {
    //   await firebase.users().once('value', snapshot => console.log(snapshot.val().find(item => item.id === myUserId)?.username));
    // };
    const getCurrentUsername = async () => {
      await firebase.users().once('value', snapshot => setMyUsername(snapshot.val().find(user => user.id === myUserId)?.username));
    };
    !myUsername && getCurrentUsername();
    getTexts();
  }, [firebase, myUserId, myUsername])

  useEffect(() => {
    if (texts.length) {
      setLastTextId(texts[texts.length-1].id);
      setChallengedName(texts[texts.length-1].challenged);
      if (texts[texts.length-1].challenged === myUsername) {
        setShouldShowReplyButton(true)
      }
    } 
  }, [challengedName, myUsername, texts]);

  return (
    <div className="container">
      {texts.length > 0 && texts.map(text =>
        <div className="textWrapper" key={text.id}>
          {text.title && <h2>{text.title}</h2>}
          <h3>{text.authorName}</h3>
          <p>{text.mainText}</p>
        </div>
      )}
      <AuthUserContext.Consumer>
        {authUser => {  
          if(authUser) {
            setUserId(authUser.uid);
            return shouldShowReplyButton &&
              <button onClick={() => history.push(`/write/${lastTextId}`)}>
                {`Come on ${myUsername}, reply!`}
              </button>;
          } else {
            return(
            <div>{`It is ${challengedName}'s time to write.`}</div>
            );
          }
        }}
      </AuthUserContext.Consumer>
    </div>
  );
}

export default withAuthentication(withFirebase(Texts));