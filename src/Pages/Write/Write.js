import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import classNames from "classnames";
import { useAuthUser } from "../../Components/Session";
import { useFirebase } from "../../Components/Firebase";
import AutoSuggest from "../../Components/AutoSuggest";
import "./Write.css";
const condition = (authUser) => !!authUser;
const Write = ({ match }) => {
  const authUser = useAuthUser();
  const firebase = useFirebase();
  const history = useHistory();
  const location = useLocation();
  const MIN_LENGTH = 33;
  const MAX_LENGTH = 800;
  const clearState = () => {
    setMainText("");
    setError("");
    setTitle("");
    setUsers("");
    setMyUsername("");
    setChallenged("");
  };
  const [mainText, setMainText] = useState("");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [users, setUsers] = useState([]);
  const [myUsername, setMyUsername] = useState("");
  const [challenged, setChallenged] = useState("");
  const [writerName, setWriterName] = useState(null);
  const [permittedToWrite, setPermittedToWrite] = useState(true);
  const handleTextareaChange = (value) => {
    if (value.length === MAX_LENGTH) {
      setError("Dein Text sollte nicht länger als 800 Zeichen sein.");
    } else if (value.length < MIN_LENGTH) {
      setError("Dein Text sollte mindestens 33 Zeichen haben.");
    } else {
      setError("");
    }

    setMainText(value);
  };
  const handleTextSubmit = async (event) => {
    event.preventDefault();
    if (mainText.length < MIN_LENGTH) {
      setError(`Your text needs to be at least${MIN_LENGTH} characters.`);
    } else if (!error.length) {
      try {
        await firebase.texts().push({
          mainText,
          publishedAt: {
            server_timestamp: {
              ".sv": "timestamp",
            },
          },
          authorID: firebase.currentUser(),
          authorName: myUsername,
          title,
          challenged,
          stream: "livijulitest",
        });
        clearState();
        history.push("/texts");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const isSubmitDisabled = () => {
    return (
      error.length ||
      !challenged.length ||
      mainText.length < MIN_LENGTH ||
      mainText.length > MAX_LENGTH
    );
  };

  useEffect(() => {
    const abortController = new AbortController();
    const getUsers = async () => {
      // TODO: sort yourself out of that array
      // TODO: throw an error when submitting with wrong username
      await firebase
        .users()
        .once("value", (snapshot) =>
          setUsers(
            snapshot.val().filter((item) => item.id !== firebase.currentUser())
          )
        );
    };
    getUsers();

    const getCurrentUsername = async () => {
      await firebase
        .users()
        .once("value", (snapshot) =>
          setMyUsername(
            snapshot.val().find((item) => item.id === firebase.currentUser())
              ?.username
          )
        );
    };
    getCurrentUsername();

    const textId = location.pathname.slice(6, location.pathname.length);
    const getWriterName = async () => {
      await firebase
        .text(textId)
        .once("value", (snapshot) => setWriterName(snapshot.val()?.challenged));
    };

    getWriterName();
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (!condition(authUser) ) {
      history.push('/login');
    }
  }, [authUser]);

  useEffect(() => {
    if (!permittedToWrite) {
      // prevent user's whose turn has not come yet, to access the write route by copy pasting
      history.push("/nomatch");
    }
  }, [permittedToWrite]);

  useEffect(() => {
    const abortController = new AbortController();
    // TODO: in write sollte man sehen, auf welchen Text man antwortet (wie genau?)
    // mithilfe der TextId, alle Daten von ChallengerText getten
    return () => {
      abortController.abort();
    };
  }, [match]);

  useEffect(() => {
    if (writerName?.length && myUsername?.length) {
      if (writerName !== myUsername) {
        setPermittedToWrite(false);
      }
    }
  }, [writerName, myUsername]);

  return (
    <>{
        (writerName === myUsername && permittedToWrite) &&
          (
            <div className="pageWrapper">
              <form
                onSubmit={(event) => handleTextSubmit(event)}
                className="form"
              >
                <label type="text" name="title" className="titleLabel">
                  {"TITEL:"}
                </label>
                <input
                  className="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
                <label
                  type="text"
                  name="challengee"
                  className="challengeeLabel"
                >
                  {"WEN WILLST DU CHALLENGEN?"}
                </label>
                <AutoSuggest
                  className="react-autosuggest"
                  values={users && users}
                  onChange={(value) => setChallenged(value)}
                />
                <label type="text" name="text" className="textLabel">
                  {"DEIN TEXT:"}
                </label>
                <textarea
                  value={mainText}
                  className="editor"
                  maxLength={MAX_LENGTH}
                  onChange={(event) => handleTextareaChange(event.target.value)}
                />
                <p className="error">{error ? error : ""}</p>
                <button
                  type="submit"
                  className={classNames(
                    "submitButton",
                    isSubmitDisabled() && "submitDisabled"
                  )}
                  disabled={isSubmitDisabled()}
                >
                  {"ANTWORTEN"}
                </button>
              </form>
            </div>
          )}
    </>
  );
};

export default Write;
