import React, { useState, useEffect } from 'react';
import { useFirebase } from '../Firebase';

export const LastTextContext = React.createContext(null);

// TODO: finish this! Create a context just for fetching the last text and timer data

const LastText = Component => {
  const LastTextProv = () => {
    const firebase = useFirebase();
    const [lastText, setLastText] = useState(null);

    useEffect(() => {
      const getLastText = async () => {
        await firebase.texts().on('value', snapshot => {
          let formattedTextlist = [];
          for (let i = 0; i < Object.values(snapshot.val()).length; i++) {
            formattedTextlist.push({id: Object.keys(snapshot.val())[i], ...Object.values(snapshot.val())[i]})
          }
          setLastText(formattedTextlist.reverse()[0]);
       });
      };

      getLastText();
    }, [firebase]);
     
    return (
      <LastTextContext.Provider value={lastText}>
        <Component lastText={lastText}/>
      </LastTextContext.Provider>
    );
  }
 
  return LastTextProv;
};
 
export default LastText;

