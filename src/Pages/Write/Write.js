import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import NoMatch from "../NoMatch";
import history from "../../history";
import { withAuthorization, AuthUserContext } from "../../Components/Session";
import { withFirebase } from "../../Components/Firebase/context";
import AutoSuggest from "../../Components/AutoSuggest";
import "./style.css";

const Write = ({ firebase, match, location }) => {
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
      setError("Your text length exceeds the maximum of allowed characters.");
    } else {
      setError("");
    }
    setMainText(value);
  };
  const handleTextSubmit = async () => {
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

  useEffect(() => {
    const abortController = new AbortController();
    const getUsers = async () => {
      // TODO: sort yourself out of that array
      // TODO: throw an error when submitting with wrong username
      // await firebase
      //   .users()
      //   .once("value", (snapshot) =>
      //     setUsers(
      //       snapshot.val().filter((item) => item.id !== firebase.currentUser())
      //     )
      //   );

      setUsers([
        { username: "Testino" },
        { username: "Teineken" },
        { username: "Tarantino" },
        { username: "Tarantula" },
      ]);
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
    debugger;
  }, []);

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
    <AuthUserContext.Consumer>
      {(authUser) => {
        // prevent user's whose turn has not come yet, to access the write route by copy pasting
        if (!permittedToWrite) {
          history.push("/nomatch");
        }
        if (writerName === myUsername && permittedToWrite) {
          return (
            <div className="pageWrapper">
              <form onSubmit={() => handleTextSubmit()} className="form">
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
                <button type="submit" className="submitButton">
                  {"ANTWORTEN"}
                </button>
              </form>
            </div>
          );
        }
      }}
    </AuthUserContext.Consumer>
  );
};

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(withRouter(withFirebase(Write)));
