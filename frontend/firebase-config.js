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

// Firebase SDK غیرفعال شده - از JSONBin استفاده می‌شود
// اگر می‌خواهید Firebase را فعال کنید، SDK را از comment خارج کنید

// بررسی اینکه آیا Firebase SDK لود شده یا نه
if (typeof firebase !== 'undefined') {
    // Initialize Firebase (اگر قبلاً initialize نشده)
    if (!firebase.apps || firebase.apps.length === 0) {
        try {
            firebase.initializeApp(FIREBASE_CONFIG);
        } catch (error) {
            console.warn('Firebase initialize failed:', error);
        }
    }
    
    // Export database reference
    let database = null;
    if (typeof firebase.database !== 'undefined') {
        database = firebase.database();
    }
} else {
    // Firebase SDK لود نشده - این طبیعی است چون از JSONBin استفاده می‌کنیم
    // console.log('Firebase SDK لود نشده - از JSONBin استفاده می‌شود');
}

