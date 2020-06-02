import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../Components/Firebase/context';
import AutoSuggest from '../../Components/AutoSuggest';
import './style.css';

const Write = ({ firebase, whatexactly }) => {
    const MIN_LENGTH = 10;
    const MAX_LENGTH = 20;
    const [mainText, setMainText] = useState('')
    // it should reset, when clicking back space - if it is not anymore
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [users, setUsers] = useState([]);
    const [myUsername, setMyUsername] = useState('');
    const [challenged, setChallenged] = useState('');
    const handleTextareaChange = (value) => {
      if (value.length === MAX_LENGTH) {
        setError('Your text length exceeds the maximum of allowed characters.');
      } else {
        setError('');
      }
      setMainText(value);
    };
    const handleTextSubmit = async () => {
      console.log();
      if (mainText.length < MIN_LENGTH) {
        setError(`Your text needs to be at least${MIN_LENGTH} characters.`);
      } else if(!error.length) {
        try {
          // Set ist nicht richtig, push?
          await firebase.texts().set({
            // automatically create ID 
            mainText,
            publishedAt: new Date(),
            authorID: firebase.currentUser(),
            authorName: myUsername,
            title,
            challenged
            // stream - how?
          })
          // empty all state
          // go to /texts route
        } catch(error) {
          console.log(error);
        }

      }
    };

    useEffect(() => {
      const getUsers = async () => {
        // TODO: sort yourself out of that array
        // TODO: throw an error when submitting with wrong username
        await firebase.users().once('value', snapshot => setUsers(snapshot.val().filter(item => item.id !== firebase.currentUser())));
      };
   
      getUsers();
    }, [firebase, users]);

    useEffect(() => {
     const getCurrentUsername = async () => {
       await firebase.users().once('value', snapshot => setMyUsername(snapshot.val().find(item => item.id === firebase.currentUser()).username));
     };

     getCurrentUsername();
    }, [firebase]);


    return (
      <div className="pageWrapper">
        <h1>{'WRITE'}</h1>
        <div className="inputWrapper">
          <input
            value={title}
            onChange={ event => setTitle(event.target.value) }
            placeholder="Title"
          />
          <AutoSuggest
            className="react-autosuggest"
            values={users && users}
            placeholder="Who do you want to challenge?"
            // the Challenged is not being posted to Firebase
            // onChange={ value => setChallenged(value) }
          />
          <textarea
            className="editor"
            maxLength={MAX_LENGTH}
            onChange={ event => handleTextareaChange(event.target.value) }
          >
            {mainText}
          </textarea>
          <p className="error">{error ? error : ''}</p>
          <button onClick={() => handleTextSubmit()}>{'Submit'}</button>
        </div>
      </div>
    );
}


export default withRouter(withFirebase(Write));