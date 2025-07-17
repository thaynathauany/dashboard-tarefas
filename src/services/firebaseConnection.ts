import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIXg83WvfA9WKcB01VFQmFWguolyaxXt4",
  authDomain: "dashboard-de-tarefas.firebaseapp.com",
  projectId: "dashboard-de-tarefas",
  storageBucket: "dashboard-de-tarefas.firebasestorage.app",
  messagingSenderId: "69290800410",
  appId: "1:69290800410:web:3e694d04f859db209168a3",
  measurementId: "G-RBVGC4E7P5"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };