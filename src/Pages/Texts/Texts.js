import React, { useEffect, useState } from 'react';
import { withFirebase } from '../../Components/Firebase/context';

const Texts = ({ firebase }) => {
  const [texts, setTexts] = useState([]);

  useEffect(() => {
    const getTexts = async () => {
      const results = await firebase.texts().once('value', snapshot => snapshot);
      let formattedTextlist = [];
      for (let i = 0; i < Object.values(results.val()).length; i++) {
        formattedTextlist.push({id: Object.keys(results.val())[i], ...Object.values(results.val())[i]})
      }
      setTexts(formattedTextlist);
    };

    getTexts();
  }, [firebase])
  return (
    <div>
      <ul>
        {texts.length > 0 && texts.map(text => <li>{text.mainText}</li>)}
      </ul>
    </div>
  );
}

export default withFirebase(Texts);