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
    const [stream, setStream] = useState('');
    const [allStreams, setAllStreams] = useState([]);
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
      if (mainText.length < MIN_LENGTH) {
        setError(`Your text needs to be at least${MIN_LENGTH} characters.`);
      } else if(!error.length) {
        try {
          // Set ist nicht richtig, push?
          await firebase.texts().push({
            // automatically create ID 
            mainText,
            publishedAt: {
              server_timestamp:{  
                ".sv":"timestamp"
             },
            },
            authorID: firebase.currentUser(),
            authorName: myUsername,
            title,
            challenged,
            stream,
          });
          
          // console.log(myArray);
          // await firebase.streams().set({
          //   createdAt: {
          //     server_timestamp:{  
          //       ".sv":"timestamp"
          //    },
          //   },
          //   authorID: firebase.currentUser(),
          //   authorName: myUsername,
          //   streamName: stream,
          //   // should contain {"id": "name"}
          //   texts: []
          // });
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

      const getCurrentUsername = async () => {
        await firebase.users().once('value', snapshot => setMyUsername(snapshot.val().find(item => item.id === firebase.currentUser()).username));
      };
      getCurrentUsername();

      let myArray = [];
      const getAllStreams = async () => {
        await firebase.texts().orderByChild('stream').once('value', (snapshot) => {
          for (let [key, value] of Object.entries(snapshot.val())) {
            myArray.push(value.stream);
          }});
          const uniqueStreams = [...new Set(myArray)]
          setAllStreams(uniqueStreams);
      };
      getAllStreams();
    }, [firebase, users]);

    return (
      <div className="pageWrapper">
        <h1>{'WRITE'}</h1>
        <div className="inputWrapper">
          <input
            value={stream}
            // TODO: throw an error, when stream already exists
            onChange={ event => setStream(event.target.value) }
            placeholder="Stream"
          />
          <input
            value={title}
            onChange={ event => setTitle(event.target.value) }
            placeholder="Title"
          />
          <AutoSuggest
            className="react-autosuggest"
            values={users && users}
            placeholder="Who do you want to challenge?"
            onChange={ value => setChallenged(value) }
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