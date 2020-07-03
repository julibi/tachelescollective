import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../Components/Firebase/context';
import { withAuthentication } from '../../Components/Session';
import history from '../../history';
import './TextDetail.css';

const TextDetail = ({ firebase, location }) => {
  const [text, setText] = useState(null)
  useEffect(() => {
    const textId = location.pathname.slice(6, location.pathname.length);
    const getText = async () => {
      await firebase.text(textId).once('value', snapshot => setText(snapshot.val()));
    };
    getText();
  }, [firebase, location.pathname]);

  if (!text) return <div>'LOADING'</div>;

  return (
    <div className="container">
      <button onClick={() => history.push('/texts/')}>
        'Go Back'
      </button>
      <div key={text.id}>
        {text.title && <h2>{text.title}</h2>}
        <h3>{text.authorName}</h3>
        <p className="textContent">{text.mainText}</p>
      </div>
    </div> 
  );
}

export default withRouter(withAuthentication(withFirebase(TextDetail)));