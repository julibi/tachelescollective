import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../Components/Firebase/context';
import { withAuthentication, AuthUserContext } from '../../Components/Session';
import Pagegrid from '../../Components/Pagegrid';
import Timer from '../../Components/Timer';
import history from '../../history';
import './TextDetail.css';

const TextDetail = ({ firebase, location }) => {
  const [text, setText] = useState(null);
  const [textIds, setTextIds] = useState([]);
  const [textIdWithoutSlash, setTextIdWithoutSlash] = useState(null);

  useEffect(() => {
    const textId = location.pathname.slice(6, location.pathname.length);
    // because textId has the slash in front
    setTextIdWithoutSlash(textId.substr(1, textId.length - 1));
    const getText = async () => {
      await firebase.text(textId).once('value', snapshot => setText(snapshot.val()));
    };
    getText();

    const getTextIds = async () => {
      await firebase.texts().on('value', snapshot => {
        let formattedTextlist = [];
        for (let i = 0; i < Object.values(snapshot.val()).length; i++) {
          formattedTextlist.push(Object.keys(snapshot.val())[i])
        }
        setTextIds(formattedTextlist);
      });
    };

    getTextIds();
    

  }, [firebase, location.pathname]);

  if (!text) {
    if (textIds.length) {
      // in case the user accesses a route like /texts/bullshit
      if (!textIds.includes(textIdWithoutSlash)) {
        return <div>'SORRY THE TEXT YOU ARE LOOKING FOR DOES NOT EXIST'</div>;
      }
    }
    return <div>'LOADING'</div>;
  }

  return (
    <Pagegrid>
    <div className="container">
      <Timer />
      <button onClick={() => history.push('/texts/')}>
        'Go Back'
      </button>
      <div key={text.id}>
        {text.title && <h2>{text.title}</h2>}
        <h3>{text.authorName}</h3>
        <p className="textContent">{text.mainText}</p>
      </div>
    </div> 
    </Pagegrid>
  );
}

export default withRouter(withAuthentication(withFirebase(TextDetail)));