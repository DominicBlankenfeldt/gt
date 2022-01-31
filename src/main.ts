import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import './registerServiceWorker';
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
  apiKey: "AIzaSyAIHyRSDHdsVy31WiuNDLdx98bJGvbw0tw",
  authDomain: "gamet-ff510.firebaseapp.com",
  projectId: "gamet-ff510",
  storageBucket: "gamet-ff510.appspot.com",
  messagingSenderId: "783380616589",
  appId: "1:783380616589:web:4c0bb0d9d1a182ea3319c4",
  measurementId: "G-46GYD944NN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

createApp(App).use(router).mount("#app");
