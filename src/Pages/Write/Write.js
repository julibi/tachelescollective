import React, { useEffect, useMemo, useState } from "react";
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import { withFirebase } from '../../Components/Firebase/context';
import AutoComplete from '../../Components/AutoComplete';
import './style.css';

const Write = ({ firebase }) => {
    const editor = useMemo(() => withReact(createEditor()), [])
    const [mainText, setMainText] = useState([
      {
        type: 'paragraph',
        children: [{ text: 'A line of text in a paragraph.' }]
      }
    ])
    const [title, setTitle] = useState('');
    const [challengedUser, setchallengedUser] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
      const getUsers = async () => {
        await firebase.users().once('value', snapshot => setUsers(snapshot.val()));
      };
   
      getUsers();
    }, [firebase, users]);

    return (
      <div>
        <input value={title} onChange={ newValue=> setTitle(newValue) }/>
        <input value={challengedUser} onChange={ newValue=> setchallengedUser(newValue) }/>

        <AutoComplete />
        <div className="test">
          <Slate editor={editor} value={mainText} onChange={newValue => setMainText(newValue)}>
            <Editable />
          </Slate>
        </div>
      </div>
    );
}

export default withFirebase(Write);
