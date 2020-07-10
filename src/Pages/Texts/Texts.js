import React, { useEffect, useState } from 'react';
import { withFirebase } from '../../Components/Firebase/context';
import { withAuthentication, AuthUserContext } from '../../Components/Session';
import history from '../../history';

import './Texts.css';


const Texts = ({ firebase }) => {
  const [texts, setTexts] = useState([]);
  const [myUserId, setUserId] = useState(null);
  const [myUsername, setMyUsername] = useState(null);
  const [lastTextId, setLastTextId] = useState('');
  const [challengedName, setChallengedName] = useState('');
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
      setLastTextId(texts[texts.length-1].id);
      setChallengedName(texts[texts.length-1].challenged);
      if (texts[texts.length-1].challenged === myUsername) {
        setShouldShowReplyButton(true)
      }
    } 
  }, [challengedName, myUsername, texts]);

  return (
    <div className="container">
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
      {texts.length > 0 && texts.map(text =>
        <div className="textWrapper" key={text.id} onClick={() => history.push(`/texts/${text.id}`)}>
          {text.title && <h2>{text.title}</h2>}
          <h3>{text.authorName}</h3>
          <p className="textContent">{text.mainText}</p>
        </div>
      )}
    </div>
  );
}

export default withAuthentication(withFirebase(Texts));