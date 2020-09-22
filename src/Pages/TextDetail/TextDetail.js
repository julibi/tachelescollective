import React, { useEffect, useState, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../Components/Firebase/context';
import { withAuthentication, AuthUserContext } from '../../Components/Session';
import Timer from '../../Components/Timer';
import history from '../../history';
import { toHHMMSS, formatTime } from '../../lib/timeStampConverter';
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
    setSplitText(splitted);   
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
    <Fragment>
      <div className="container">
        {/* it should only show the timer on textdetail, if it is the last text
        -find out the smoothest way to do so */}
        <Timer page={"textDetail"} lastText={text} />
        <div key={text.id} className="textContent">      
          {splitText && 
            <p>
              <span className="textTitle">{`${text.title.toUpperCase()}`}</span>{splitText[0]}<span className="authorAndDate">{`${text.authorName}-${formatTime(text.publishedAt.server_timestamp)}`}</span>{splitText[1]}
            </p>
          }
          <button onClick={() => history.push('/texts/')} className="goBack">
            {'<<<<'}
          </button>
        </div>
      </div>
    </Fragment>
  );
}

export default withRouter(withAuthentication(withFirebase(TextDetail)));