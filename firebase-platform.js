import { firebaseConfig } from './firebase-config.js';
import { appCheckConfig } from './app-check-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-app-check.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
let appCheck = null;
let appCheckReady = false;

try {
  if (appCheckConfig.siteKey) {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(appCheckConfig.siteKey),
      isTokenAutoRefreshEnabled: true
    });
    appCheckReady = true;
  }
} catch (error) {
  console.warn('App Check could not initialize. Enforcement should remain off until this is resolved.', error);
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, appCheck, appCheckReady };
