import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCCAH3RhZ3NFp_fAJlizINeeSrdgVSktvg',
  authDomain: 'graphics-social.firebaseapp.com',
  projectId: 'graphics-social',
  storageBucket: 'graphics-social.appspot.com',
  messagingSenderId: '1013765507298',
  appId: '1:1013765507298:web:dfa5392bae55d9d83db6bb',
  measurementId: 'G-KBVJ0Z9VSM',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
