import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDrX1iz_c6dClz4ZvNNfQ5xen12cNLpiF0",
    authDomain: "wlln-mimecoin.firebaseapp.com",
    databaseURL: "https://wlln-mimecoin-default-rtdb.firebaseio.com",
    projectId: "wlln-mimecoin",
    storageBucket: "wlln-mimecoin.appspot.com",
    messagingSenderId: "935752454010",
    appId: "1:935752454010:web:0c8338d042febc978750c3",
    measurementId: "G-34P6C2LS1J"
};

let firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebaseApp;