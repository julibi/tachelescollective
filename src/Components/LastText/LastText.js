import React, { useState, useEffect } from 'react';
import { withFirebase } from '../Firebase/context';

export const LastTextContext = React.createContext(null);

const LastText = Component => {
  const LastTextProv = ({firebase}) => {
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
 
  return withFirebase(LastTextProv);
};
 
export default LastText;

