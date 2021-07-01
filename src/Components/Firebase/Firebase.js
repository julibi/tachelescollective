import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import firebaseConfig from '../../apiKeys';

// const prodConfig = {
//   apiKey: process.env.REACT_APP_PROD_API_KEY,
//   authDomain: process.env.REACT_APP_PROD_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_PROD_DATABASE_URL,
//   projectId: process.env.REACT_APP_PROD_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_PROD_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_PROD_MESSAGING_SENDER_ID,
// };

// const config =
//   process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export const Firebase = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.database();

const doSignInWithEmailAndPassword = (email, password) =>
    auth.signInWithEmailAndPassword(email, password);

const doSignOut = () => auth.signOut();

const doPasswordReset = email => auth.sendPasswordResetEmail(email);

const doPasswordUpdate = password => auth.currentUser?.updatePassword(password);

const users = () => db.ref('/users');

const texts = () => db.ref('/texts');

const stream = () => db.ref('/streams');

const currentUser = () => auth.currentUser?.uid;

const text = (textId) => db.ref('/texts' + textId);

export const firebaseFunctions = {
    doSignInWithEmailAndPassword,
    doSignOut,
    doPasswordReset,
    doPasswordUpdate,
    users,
    texts,
    stream,
    currentUser,
    text
};
