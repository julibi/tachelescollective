import React, { useEffect, useState, Fragment } from 'react';
import classNames from 'classnames';
import { withFirebase } from '../../Components/Firebase/context';
import Skeleton from '../../Components/Skeleton';
import { AuthUserContext } from '../../Components/Session';
import history from '../../history';

import './Timer.css';

export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const datevalues = [
    date.getFullYear(),
    date.getMonth()+1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  return `${datevalues[2]}.${datevalues[1]}.${datevalues[0]} - ${datevalues[3]}:${datevalues[4]}`
  };

const toHHMMSS = (secs) => {
  var hours   = Math.floor(secs / 3600)
  var minutes = Math.floor(secs / 60) % 60
  var seconds = secs % 60

  return [hours,minutes,seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v,i) => v !== "00" || i > 0)
      .join(":")
}

const Timer = ({ firebase, lastText, page, className }) => {
  const [text, setText] = useState(lastText);
  const [myUserId, setUserId] = useState(null);
  const [myUsername, setMyUsername] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [lastTextId, setLastTextId] = useState('');
  const [challengedName, setChallengedName] = useState('');
  const [shouldShowReplyButton, setShouldShowReplyButton] = useState(false);

  useEffect(() => {
    setText(lastText);
    const createdAt = text ? text.publishedAt.server_timestamp : null;
    const getCurrentUsername = async () => {
      await firebase.users().once('value', snapshot => setMyUsername(snapshot.val().find(user => user.id === myUserId)?.username));
    };
    getCurrentUsername();

    if(createdAt) {
      const deadline = Math.floor(createdAt / 1000) + 172800;
      const now = Math.floor(new Date().getTime() / 1000);
      const currentCount = toHHMMSS(deadline - now);

      setTimeout(() => {
        setCountdown(currentCount)
      }, 1000);
    }

    if (text) {
      setLastTextId(text.id);
      setChallengedName(text.challenged);

      if (text.challenged === myUsername) {
        setShouldShowReplyButton(true)
      }
    } 
  }, [null, firebase, countdown, text, lastText]);

  return(
      <div className={classNames("timerContainer", className)}>
        <AuthUserContext.Consumer>
          {authUser => {  
            if(authUser) {
              setUserId(authUser.uid);
            }
          }}
        </AuthUserContext.Consumer>
        { page === "texts" &&
          <Fragment>
            {countdown && <div className="timerText">
              {shouldShowReplyButton ?
                <button onClick={() => history.push(`/write/${lastTextId}`)}>
                  {`SCHREIB WAS, ${myUsername}!`}
                </button>:
                <Fragment>
                {`${challengedName.toUpperCase()} IST DRAN IN`}
                </Fragment>
              }
            </div>}
            {!countdown && <Skeleton className={"timerTextSkeleton"} />}
            { page === "texts" && <div className="timerDivider" />}
            {countdown && <p className="timerCountdown">{countdown}</p>}
            {!countdown && <Skeleton className={"timerCountdownSkeleton"} />}
          </Fragment>
        }
        { page !== "texts" &&
          <div className="smallTimer">
            {countdown &&
              <Fragment>
                {shouldShowReplyButton ? 
                  <button onClick={() => history.push(`/write/${lastTextId}`)}>{`SCHREIB WAS, ${myUsername}!`}</button> :
                  <p className="smallTimerText">{`${challengedName.toUpperCase()} IST DRAN IN`}</p>
                }
              </Fragment>
            }
            {!countdown && <Skeleton className={"smallTimerTextSkeleton"} />}
            {countdown && <p className="smallTimerCountdown">{countdown}</p>}
            {!countdown && <Skeleton className={"smallTimerCountdownSkeleton"} />}
          </div>
        }
      </div>
  );
}

export default withFirebase(Timer);
