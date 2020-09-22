import React, { useEffect, useState, Fragment } from 'react';
import classNames from 'classnames';
import { withFirebase } from '../Firebase/context';
import Skeleton from '../Skeleton';
import { AuthUserContext } from '../Session';
import history from '../../history';

import './Timer.css';

export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const datevalues = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  return `${datevalues[2]}.${datevalues[1]}.${datevalues[0]} - ${datevalues[3]}:${datevalues[4]}`
};

const toHHMMSS = (secs) => {
  var hours = Math.floor(secs / 3600)
  var minutes = Math.floor(secs / 60) % 60
  var seconds = secs % 60

  return [hours, minutes, seconds]
    .map(v => v < 10 ? "0" + v : v)
    .filter((v, i) => v !== "00" || i > 0)
    .join(":")
}

const Timer = ({ firebase, lastText, page, className }) => {
  const [myUserId, setUserId] = useState(null);
  const [myUsername, setMyUsername] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [lastTextId, setLastTextId] = useState('');
  const [challengedName, setChallengedName] = useState('');
  const [shouldShowReplyButton, setShouldShowReplyButton] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const createdAt = lastText ? lastText.publishedAt.server_timestamp : null;
    const getCurrentUsername = async () => {
      await firebase.users().on('value', snapshot => setMyUsername(snapshot.val().find(user => user.id === myUserId)?.username));
    };
    getCurrentUsername();

    if (createdAt) {
      const deadline = Math.floor(createdAt / 1000) + 172800;
      const now = Math.floor(new Date().getTime() / 1000);
      const currentCount = toHHMMSS(deadline - now);

      if (deadline > now) {
        if ((deadline - now) <= 7200) {
          setIsUrgent(true);
        }
        setTimeout(() => {
          setCountdown(currentCount);
        }, 1000);
      } else {
        setIsTimeUp(true);
        setCountdown('00:00:00');
      }
    }

    if (lastText) {
      setLastTextId(lastText.id);
      setChallengedName(lastText.challenged);
      if (lastText.challenged === myUsername) {
        setShouldShowReplyButton(true);
      } else {
        setShouldShowReplyButton(false);
      }
    }
  }, [null, firebase, lastText, myUserId, lastText, myUsername, countdown]);

  const renderRequestVersions = () => { 
    if (isTimeUp) {
      if (myUsername) {
        return (
          <p className="pink">{`${challengedName.toUpperCase()}, DEINE ZEIT IST UM... NEXT!`}</p>
        );
      }
      else {
        return (
          <p className="pink">{`${challengedName.toUpperCase()}'S ZEIT IST UM... NEXT!`}</p>
        );
      }
    } else {
      if (myUsername === challengedName) {
        return (
          <p>{`${challengedName.toUpperCase()}! DU BIST DRAN IN`}</p>
        );
      } else {
        return (
          <p>{`${challengedName.toUpperCase()} IST DRAN IN`}</p>
        );
      }
    }
  };

  const ReplyButton = () => {
    if (shouldShowReplyButton && !isTimeUp) {
      return (
        <button
          className={classNames("replyButton", (page !== "texts") && "smallReplyButton")}
          onClick={() => history.push(`/write/${lastTextId}`)}
        >
          <span className="buttonArrows">{">>>> "}</span>
          <span className={classNames("buttonText", isUrgent && "pink")}>{"SCHREIB"}</span>
        </button>
      );
    } else {
      return null;
    }
  };
  
  return (
    <div className={classNames("timerContainer", className)}>
      <AuthUserContext.Consumer>
        {authUser => {
          if (authUser) {
            setUserId(authUser.uid);
          } else {
            setUserId(null);
          }
        }}
      </AuthUserContext.Consumer>
      {countdown &&
        <div className={page === "texts" ? "timerText" : "smallTimerText"}>
          {renderRequestVersions()}
        </div>
      }
      {!countdown &&
        <Skeleton className={page === "texts" ? "timerTextSkeleton" : "smallTimerTextSkeleton"} />}
      {page === "texts" && <div className="timerDivider" />}
      {countdown &&
        <div className="CTA">
          <p className={classNames(
            page === "texts" ? "timerCountdown" : "smallTimerCountdown",
            (isUrgent || isTimeUp) && "pink",
            (isUrgent && !isTimeUp) && "blink"
            )}
          >
            {countdown}
          </p>
          {ReplyButton()}
        </div>
      }
      {!countdown &&
        <Skeleton className={page === "texts" ? "timerCountdownSkeleton" : "smallTimerCountdownSkeleton"} />}
    </div>
  );
}

export default withFirebase(Timer);
