import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

export const usersCollectionRef = firestore().collection('users');
export const tagsCollectionRef = firestore().collection('tags');
export const advisorsCollectionRef = firestore().collection('advisors');
export const conversationsCollectionRef = firestore().collection(
  'conversations',
);

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();

export default firebase;
