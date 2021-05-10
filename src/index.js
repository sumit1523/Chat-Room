import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase';
import { Provider } from 'react-redux';
import store from './store';

const firebaseConfig = {
	apiKey: "AIzaSyBvZyBFadLLMCmz3_W69YL7t4zTi9qlV7s",
	authDomain: "chat-app-d0c55.firebaseapp.com",
	projectId: "chat-app-d0c55",
	storageBucket: "chat-app-d0c55.appspot.com",
	messagingSenderId: "164558948936",
	appId: "1:164558948936:web:085625deccfeaa10de267d"
};


firebase.initializeApp(firebaseConfig);

window.store = store;

ReactDOM.render(
	<Provider store={store}>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
