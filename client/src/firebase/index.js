import {firebase} from '@firebase/app';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "alexandria-53ea0.firebaseapp.com",
    projectId: "alexandria-53ea0",
    storageBucket: "alexandria-53ea0.appspot.com",
    messagingSenderId: "399793836289",
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: "G-NRTW5NVMNN"
};
// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);
