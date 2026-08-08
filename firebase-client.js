let db=null;let firebaseReady=false;let addDoc=null;let collection=null;let onSnapshot=null;
try{
  const cfg=await import('./firebase-config.js');
  if(cfg.firebaseConfig?.projectId){
    const appSdk=await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js');
    const fsSdk=await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js');
    const app=appSdk.initializeApp(cfg.firebaseConfig);
    db=fsSdk.getFirestore(app);addDoc=fsSdk.addDoc;collection=fsSdk.collection;onSnapshot=fsSdk.onSnapshot;firebaseReady=true;
  }
}catch(e){console.info('Almora AI running without Firebase.',e);}

async function addTownReport(report){if(!firebaseReady)throw new Error('Firebase not configured');return addDoc(collection(db,'reports'),report)}
function watchCollection(name,onData,onError=console.error){if(!firebaseReady)return()=>{};return onSnapshot(collection(db,name),snap=>onData(snap.docs.map(d=>({id:d.id,...d.data()}))),onError)}

export{db,firebaseReady,addTownReport,watchCollection};