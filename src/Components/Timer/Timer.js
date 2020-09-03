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
  const [timeValid, setTimeValid] = useState(true);
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
        setTimeValid(false);
        setCountdown('ZEIT IST ABGELAUFEN');
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
    if (shouldShowReplyButton && timeValid && myUsername) {
      return (
        <button onClick={() => history.push(`/write/${lastTextId}`)}>
          {`SCHREIB WAS, ${myUsername.toUpperCase()}!`}
        </button>
      );
    } else if (!shouldShowReplyButton && timeValid) {
      return (
        <p className="smallTimerText">{`${challengedName.toUpperCase()} IST DRAN IN`}</p>
      );
    } else if (shouldShowReplyButton && !timeValid) {
      return (
        <p>{`${challengedName.toUpperCase()}, ZU SPÄT! DEINE`}</p>
      );
    } else if (!shouldShowReplyButton && !timeValid) {
      return (
        <p>{`${challengedName.toUpperCase()}S`}</p>
      );
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
      {page === "texts" &&
        <Fragment>
          {countdown &&
            <div className="timerText">
              {renderRequestVersions()}
            </div>
          }
          {!countdown && <Skeleton className={"timerTextSkeleton"} />}
          {page === "texts" && <div className="timerDivider" />}
          {(countdown && timeValid) && <p className={classNames("timerCountdown", isUrgent && "timerPink", "blink")}>{countdown}</p>}
          {(countdown && !timeValid) && <p className={classNames("timerCountdown", "timerPink")}>{countdown}</p>}
          {!countdown && <Skeleton className={"timerCountdownSkeleton"} />}
        </Fragment>
      }
      {page !== "texts" &&
        <Fragment>
          {countdown &&
            <div className="smallTimer">
              {renderRequestVersions()}
            </div>
          }
          {!countdown && <Skeleton className={"smallTimerTextSkeleton"} />}
          {(countdown && timeValid) && <p className={classNames("smallTimerCountdown", isUrgent && "timerPink", "blink")}>{countdown}</p>}
          {(countdown && !timeValid) && <p className={classNames("smallTimerCountdown", "timerPink")}>{countdown}</p>}
          {!countdown && <Skeleton className={"smallTimerCountdownSkeleton"} />}
        </Fragment>
      }
    </div>
  );
}

export default withFirebase(Timer);
