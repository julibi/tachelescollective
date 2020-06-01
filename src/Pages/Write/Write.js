import React, { useEffect, useMemo, useState } from "react";

import { withFirebase } from '../../Components/Firebase/context';
import AutoSuggest from '../../Components/AutoSuggest';
import './style.css';

const Write = ({ firebase }) => {
    const MAX_LENGTH = 10;
    const [mainText, setMainText] = useState('')
    // it should reset, when clicking back space - if it is not anymore
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [users, setUsers] = useState([]);
    const test = (value) => {
      if (value.length === MAX_LENGTH) {
        setError('Your text length exceeds the maximum of allowed characters.');
      }
      setMainText(value);
    };

    useEffect(() => {
      const getUsers = async () => {
        await firebase.users().once('value', snapshot => setUsers(snapshot.val()));
      };
   
      getUsers();
    }, [firebase, users]);

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
          />
          <textarea
            className="editor"
            maxLength={MAX_LENGTH}
            onChange={ event => test(event.target.value) }
          >
            {mainText}
          </textarea>
          <p className="error">{error ? error : ''}</p>
          <button>{'Submit'}</button>
        </div>
      </div>
    );
}

export default withFirebase(Write);
