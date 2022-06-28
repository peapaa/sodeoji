import Firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBeC-c6MADBtwt71QFsV7uVhW7JjHS4F00",
    authDomain: "sodeoji-project.firebaseapp.com",
    databaseURL: "https://sodeoji-project-default-rtdb.firebaseio.com",
    projectId: "sodeoji-project",
    storageBucket: "sodeoji-project.appspot.com",
    messagingSenderId: "490911698729",
    appId: "1:490911698729:web:541f65e4e34cbd346eb138",
    measurementId: "G-11LQRQG8KY"
  };

const firebase = Firebase.initializeApp(firebaseConfig);
const database = Firebase.database();
const storage = Firebase.storage();
const auth = Firebase.auth();

// Create Seed data
// seedDatabase(firebase);
export { firebase, database, storage, auth };

export const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
        Firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        Firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
  };


