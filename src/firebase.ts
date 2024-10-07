import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQ56RiwizbXhk9PGf_yNSqI26GnLLpKeY",
  authDomain: "test-operand.firebaseapp.com",
  projectId: "test-operand",
  storageBucket: "test-operand.appspot.com",
  messagingSenderId: "275246957587",
  appId: "1:275246957587:web:bba771d8ddbffd664bebe6",
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
