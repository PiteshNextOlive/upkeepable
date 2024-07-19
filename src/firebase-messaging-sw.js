importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
firebase.initializeApp({
    apiKey: "AIzaSyDLwkwEaeBXQTFeSg1yjlGX3yDgJZ0v9SE",
    authDomain: "traver-lamp.firebaseapp.com",
    projectId: "traver-lamp",
    storageBucket: "traver-lamp.appspot.com",
    messagingSenderId: "15520629438",
    appId: "1:15520629438:web:cd59191af4d6ad997394ef",
    measurementId: "G-8GZTCP8V3F"
});
const messaging = firebase.messaging();