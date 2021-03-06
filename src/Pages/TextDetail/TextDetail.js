import React, { useEffect, useState, Fragment } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useFirebase } from '../../Components/Firebase';
import Timer from '../../Components/Timer';
import { formatTime } from '../../lib/timeStampConverter';
import './TextDetail.css';

const splitInHalf = str => {
  let middle = Math.floor(str.length / 2);
  return [str.slice(0, middle), str.slice(middle, str.length).trim()]
}

const TextDetail = () => {
  const { firebaseFunctions } = useFirebase();
  const history = useHistory();
  const location = useLocation();
  const [text, setText] = useState(null);
  const [lastTextId, setLastTextId] = useState([]);
  const [formattedText, setFormattedText] = useState(null);
  const [textIds, setTextIds] = useState([]);
  const [texts, setTexts] = useState([]);
  const [shouldShowTimer, setShouldShowTimer] = useState(false);
  const [textIdWithoutSlash, setTextIdWithoutSlash] = useState(null);
  const [splitText, setSplitText] = useState(null);
  
  useEffect(() => {
    const getTexts = async () => {
      // TODO: refactor, exact same fetching method inside Write.js
      await firebaseFunctions.texts().on('value', snapshot => {
        let formattedTextlist = [];
        for (let i = 0; i < Object.values(snapshot.val()).length; i++) {
          formattedTextlist.push({id: Object.keys(snapshot.val())[i], ...Object.values(snapshot.val())[i]})
        }
        setTexts(formattedTextlist.reverse());
      });

    };
    getTexts();
  }, [firebaseFunctions])
  
  useEffect(() => {
    const textId = location.pathname.slice(6, location.pathname.length);
    // because textId has the slash in front
    setTextIdWithoutSlash(textId.substr(1, textId.length - 1));
    const getText = async () => {
      await firebaseFunctions.text(textId).once('value', snapshot => setText(snapshot.val()));
    };

    getText();
    const getTextIds = async () => {
      await firebaseFunctions.texts().on('value', snapshot => {
        let formattedTextlist = [];
        for (let i = 0; i < Object.values(snapshot.val()).length; i++) {
          formattedTextlist.push(Object.keys(snapshot.val())[i])
        }
        setTextIds(formattedTextlist);
      });
    };
   
    getTextIds();
  },[firebaseFunctions, location.pathname]);

  useEffect(() => {
    const splitted = text?.mainText && splitInHalf(text.mainText);
    setSplitText(splitted);  

  }, [text]);

  useEffect(() => {
    if (texts.length) {
      setLastTextId(texts[0].id); 
    }
  }, [texts]);

  useEffect(() => {
    if (text && textIdWithoutSlash && lastTextId) {
      const formattedText = { ...text, id: textIdWithoutSlash };
      setFormattedText(formattedText);
      if (lastTextId === textIdWithoutSlash) {
        setShouldShowTimer(true);
      }
    }
  }, [text, textIdWithoutSlash, lastTextId]);

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
        {shouldShowTimer && <Timer page={"textDetail"} lastText={formattedText} />}
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

export default TextDetail;