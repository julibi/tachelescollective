import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../Components/Firebase/context';
import { withAuthentication, AuthUserContext } from '../../Components/Session';
import Pagegrid from '../../Components/Pagegrid';
import Timer from '../../Components/Timer';
import history from '../../history';
import './TextDetail.css';

const splitInHalf = str => {
  let middle = Math.floor(str.length / 2);
  return [str.slice(0, middle), str.slice(middle, str.length).trim()]
}

const TextDetail = ({ firebase, location }) => {
  const [text, setText] = useState(null);
  const [textIds, setTextIds] = useState([]);
  const [textIdWithoutSlash, setTextIdWithoutSlash] = useState(null);
  const [splitText, setSplitText] = useState(null);
  
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
  },[firebase, location.pathname]);

  useEffect(() => {
    const splitted = text?.mainText && splitInHalf(text.mainText);
    setSplitText(splitted)
  }, [text]);

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
        <Timer page={"textDetail"} lastText={text} />
        <div key={text.id} className="textContent">
        
          {splitText && 
            <p>
              <span className="textTitle">{`${text.title.toUpperCase()}`}</span>{splitText[0]}<span className="testo">{text.authorName}</span>{splitText[1]}
            </p>
          }
        </div>
      </div>
      <button onClick={() => history.push('/texts/')}>
        {'Go Back'}
      </button>
    </Pagegrid>
  );
}

export default withRouter(withAuthentication(withFirebase(TextDetail)));