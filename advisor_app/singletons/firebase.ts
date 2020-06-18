import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

export const advisorsCollectionRef = firestore().collection('advisors');
export const tagsCollectionRef = firestore().collection('tags');
export const conversationsCollectionRef = firestore().collection(
  'conversations',
);

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();
