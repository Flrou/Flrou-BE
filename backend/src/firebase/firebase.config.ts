// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging";

import admin, { ServiceAccount } from "firebase-admin"
import * as serviceAccount from "./admin_private_key/firebase_service_key.json";

console.log(serviceAccount)
const serviceAccountKey: ServiceAccount = serviceAccount as ServiceAccount;
const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});

// const firebaseConfig = {
//   apiKey: "AIzaSyACyqV7saLjgGdrFscSemsklVxPeWGuOOo",
//   authDomain: "flrou-b06fd.firebaseapp.com",
//   projectId: "flrou-b06fd",
//   storageBucket: "flrou-b06fd.appspot.com",
//   messagingSenderId: "11065318805",
//   appId: "1:11065318805:web:e6312a746c6628246e6a9c",
//   measurementId: "G-JN2MZFJTDJ",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

// export { adminApp, app, messaging }
export { admin, adminApp }