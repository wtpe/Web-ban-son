
import { getStorage } from 'firebase/storage';

import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCPgpL6xzixLDKEATXqBB5kW2_PiVojko",
  authDomain: "sonimage-f9264.firebaseapp.com",
  projectId: "sonimage-f9264",
  storageBucket: "sonimage-f9264.appspot.com",
  messagingSenderId: "507458968110",
  appId: "1:507458968110:web:7b71b4787c9888fd1bddbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app ,'gs://sonimage-f9264.appspot.com');
