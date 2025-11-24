// ============================================
// تنظیمات Firebase
// ============================================

// TODO: این مقادیر را با اطلاعات پروژه Firebase خود جایگزین کنید
// برای ساخت پروژه: https://console.firebase.google.com/

const FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// بررسی اینکه آیا Firebase SDK لود شده یا نه
if (typeof firebase === 'undefined') {
    console.error('Firebase SDK لود نشده است!');
}

// Initialize Firebase (اگر قبلاً initialize نشده)
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
}

// Export database reference
let database = null;
if (typeof firebase !== 'undefined') {
    database = firebase.database();
}

