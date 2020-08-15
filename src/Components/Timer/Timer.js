import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { withFirebase } from '../Firebase/context';
import Skeleton from '../../Components/Skeleton';

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

const Timer = ({ firebase, children, page, className }) => {
  const [texts, setTexts] = useState([]);
  const [countdown, setCountdown] = useState(null);
  // TODO: refactor, exact same fetching method inside Write.js
  // const getCurrentUsername = async () => {
  //   await firebase.users().once('value', snapshot => console.log(snapshot.val().find(item => item.id === myUserId)?.username));
  // };
  useEffect(() => {
    const getTexts = async () => {
      await firebase.texts().on('value', snapshot => {
        let formattedTextlist = [];
        for (let i = 0; i < Object.values(snapshot.val()).length; i++) {
          formattedTextlist.push({id: Object.keys(snapshot.val())[i], ...Object.values(snapshot.val())[i]})
        }
        setTexts(formattedTextlist.reverse());
      });
    };

    // getTexts();
  }, [firebase]);

  useEffect(() => {
    const createdAt = texts[0] ? texts[0].publishedAt.server_timestamp : null;
    if(createdAt) {
      const deadline = Math.floor(createdAt / 1000) + 172800;
      const now = Math.floor(new Date().getTime() / 1000);
      const currentCount = toHHMMSS(deadline - now);

      setTimeout(() => {
        setCountdown(currentCount)
      }, 1000);
    }
}, [null, countdown, texts]);

  return(
    <div className={classNames("timerContainer", className)}>
      {countdown && <p className="timerText">{children}</p>}
      {!countdown && <Skeleton className={"timerTextSkeleton"} />}
      { page === "texts" && <div className="timerDivider" />}
      {countdown && <p className="timerCountdown">{countdown}</p>}
      {!countdown && <Skeleton className={"timerCountdownSkeleton"} />}
    </div>
  );
}

export default withFirebase(Timer);
