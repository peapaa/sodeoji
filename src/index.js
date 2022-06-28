import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import FirebaseContext from './context/firebase'
import { firebase, database, storage} from './lib/firebase'
import './styles/app.css';

ReactDOM.render(
  < FirebaseContext.Provider value = {{firebase, database, storage}}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById('root')
);

reportWebVitals();
