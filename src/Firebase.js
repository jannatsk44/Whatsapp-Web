import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCE3TD5x0cFnUXRPFr78i5Fap37K1A3p-0",
  authDomain: "whatsapp-cone-e9b21.firebaseapp.com",
  projectId: "whatsapp-cone-e9b21",
  storageBucket: "whatsapp-cone-e9b21.appspot.com",
  messagingSenderId: "356307571641",
  appId: "1:356307571641:web:13f2cba9815bb011511c68",
  measurementId: "G-L2WKPQV09Y"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;