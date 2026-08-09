import { auth, db } from './firebase-platform.js';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';

const role=document.body.dataset.role||'resident';
const status=document.querySelector('#authStatus');
const email=()=>document.querySelector('#email')?.value.trim()||'';
const password=()=>document.querySelector('#password')?.value||'';
const destinations={resident:'./account.html',business:'./businesses.html',government:'./admin.html'};
const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});

function friendly(err){const code=err?.code||'';if(code.includes('popup-closed'))return 'Google sign-in was closed before completion.';if(code.includes('account-exists'))return 'This email already uses another sign-in method.';if(code.includes('invalid-credential'))return 'Email or password was not accepted.';if(code.includes('weak-password'))return 'Use a stronger password with at least 6 characters.';if(code.includes('unauthorized-domain'))return 'This hostname must be added to Firebase Authentication authorised domains.';return 'Sign-in could not be completed. Please try again.'}
async function authorize(user){if(role==='government'){const allowed=await getDoc(doc(db,'moderators',user.uid));if(!allowed.exists()){await signOut(auth);throw new Error('not-authorized-government')}}return destinations[role]||destinations.resident}
async function finish(user){status.textContent='Checking access…';try{location.href=await authorize(user)}catch(e){if(e.message==='not-authorized-government'){status.textContent='This Google/Firebase account is not on the government/moderator allowlist.';return}throw e}}

document.querySelector('#googleLogin')?.addEventListener('click',async()=>{status.textContent='Opening Google…';try{const result=await signInWithPopup(auth,provider);await finish(result.user)}catch(e){console.error(e);status.textContent=friendly(e)}});
document.querySelector('#emailLogin')?.addEventListener('click',async()=>{if(!email()||!password()){status.textContent='Enter email and password.';return}status.textContent='Signing in…';try{const result=await signInWithEmailAndPassword(auth,email(),password());await finish(result.user)}catch(e){console.error(e);status.textContent=e.message==='not-authorized-government'?'This account is not authorised for government access.':friendly(e)}});
document.querySelector('#emailSignup')?.addEventListener('click',async()=>{if(role==='government')return;if(!email()||password().length<6){status.textContent='Enter a valid email and a password of at least 6 characters.';return}status.textContent='Creating account…';try{const result=await createUserWithEmailAndPassword(auth,email(),password());await finish(result.user)}catch(e){console.error(e);status.textContent=friendly(e)}});
