import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyAiNCZ_3CDNXynFas4b1UsHI6XdQwT6YcY",
  authDomain: "campus42.firebaseapp.com",
  databaseURL: "https://campus42.firebaseio.com",
  projectId: "campus42",
  storageBucket: "campus42.appspot.com",
  messagingSenderId: "1053546856481",
  appId: "1:1053546856481:web:305a5b1fc54af3550ea360",
  measurementId: "G-Q5M3Y49YF7",
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export default firebaseApp;

export const firestore = firebaseApp.firestore();

export const collections: {
  societies: (campus: string) => firebase.firestore.CollectionReference;
  blogs: (campus: string) => firebase.firestore.CollectionReference;
  events: (campus: string) => firebase.firestore.CollectionReference;
  reports: (campus: string) => firebase.firestore.CollectionReference;
  users: (campus: string) => firebase.firestore.Query;
} = {
  societies: (campus) => firestore.collection(`campuses/${campus}/societies`),
  blogs: (campus) => firestore.collection(`campuses/${campus}/blogs`),
  events: (campus) => firestore.collection(`campuses/${campus}/events`),
  reports: (campus) =>
    firestore.collection(`campuses/${campus}/reports_of_behaviour`),
  users: (campus) =>
    firestore.collection(`users`).where("campus", "==", campus),
};

(window as any).firebaseApp = firebaseApp;
