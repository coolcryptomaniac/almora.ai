import { db, appCheckReady } from './firebase-platform.js';
import { addDoc, collection, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';

const firebaseReady = Boolean(db);

async function addTownReport(report) {
  if (!firebaseReady) throw new Error('Firebase not configured');
  return addDoc(collection(db, 'reports'), report);
}

function watchCollection(name, onData, onError = console.error) {
  if (!firebaseReady) return () => {};
  return onSnapshot(
    collection(db, name),
    snap => onData(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export { db, firebaseReady, appCheckReady, addTownReport, watchCollection };
