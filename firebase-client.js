// Firebase web configuration is intentionally not hard-coded.
// Copy firebase-config.example.js to firebase-config.js and fill it with the
// PUBLIC Firebase web-app config shown in Firebase Console → Project settings.
// Access to data is enforced by firestore.rules, not by hiding this web config.

let db=null;let firebaseReady=false;let addDoc=null;let collection=null;
try{
  const cfg=await import('./firebase-config.js');
  if(cfg.firebaseConfig?.projectId){
    const appSdk=await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js');
    const fsSdk=await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js');
    const app=appSdk.initializeApp(cfg.firebaseConfig);db=fsSdk.getFirestore(app);addDoc=fsSdk.addDoc;collection=fsSdk.collection;firebaseReady=true;
  }
}catch(e){console.info('Almora AI running without Firebase. Add firebase-config.js to enable Firestore.');}
async function addTownReport(report){if(!firebaseReady)throw new Error('Firebase not configured');return addDoc(collection(db,'reports'),report)}
export{db,firebaseReady,addTownReport};