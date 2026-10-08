import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  type Firestore,
  type Unsubscribe,
} from 'firebase/firestore';

export interface FirebaseSyncConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  syncKey?: string;
}

const FIREBASE_CONFIG_STORAGE_KEY = 'RESET_WEEK_FIREBASE_CONFIG';
const DEFAULT_SYNC_KEY = 'personal_reset_week';

// 1. Get stored or environment configuration
export const getStoredFirebaseConfig = (): FirebaseSyncConfig | null => {
  // Check localStorage first
  try {
    const saved = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId && parsed.appId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read firebase config from localStorage:', e);
  }

  // Check Vite environment variables
  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const envAppId = import.meta.env.VITE_FIREBASE_APP_ID;

  if (envApiKey && envProjectId && envAppId) {
    return {
      apiKey: envApiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: envAppId,
      syncKey: import.meta.env.VITE_FIREBASE_SYNC_KEY || DEFAULT_SYNC_KEY,
    };
  }

  return null;
};

export const saveFirebaseConfig = (config: FirebaseSyncConfig) => {
  localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
};

export const clearFirebaseConfig = () => {
  localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
};

// 2. Initialize Firebase App & Firestore
let firebaseAppInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;

export const getFirebaseServices = (customConfig?: FirebaseSyncConfig | null) => {
  const config = customConfig || getStoredFirebaseConfig();
  if (!config) {
    return { app: null, db: null, config: null };
  }

  try {
    if (!firebaseAppInstance) {
      const existingApps = getApps();
      if (existingApps.length > 0) {
        firebaseAppInstance = getApp();
      } else {
        firebaseAppInstance = initializeApp({
          apiKey: config.apiKey,
          authDomain: config.authDomain,
          projectId: config.projectId,
          storageBucket: config.storageBucket,
          messagingSenderId: config.messagingSenderId,
          appId: config.appId,
        });
      }
    }

    if (!firestoreInstance && firebaseAppInstance) {
      try {
        firestoreInstance = initializeFirestore(firebaseAppInstance, {
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
          }),
        });
      } catch {
        firestoreInstance = getFirestore(firebaseAppInstance);
      }
    }

    return {
      app: firebaseAppInstance,
      db: firestoreInstance,
      config,
    };
  } catch (error) {
    console.error('Failed to initialize Firebase services:', error);
    return { app: null, db: null, config, error };
  }
};

// 3. Realtime Firestore Sync Methods
export const subscribeToCloudResetWeek = (
  syncKey: string = DEFAULT_SYNC_KEY,
  onRemoteUpdate: (remoteState: any) => void,
  onError?: (err: Error) => void
): Unsubscribe | null => {
  const { db } = getFirebaseServices();
  if (!db) return null;

  try {
    const docRef = doc(db, 'reset_week_sync', syncKey);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && data.state) {
            onRemoteUpdate(data.state);
          }
        }
      },
      (error) => {
        console.error('Firestore Realtime sync subscription error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.error('Error starting snapshot listener:', err);
    if (onError) onError(err);
    return null;
  }
};

export const pushToCloudResetWeek = async (
  state: any,
  syncKey: string = DEFAULT_SYNC_KEY
): Promise<{ success: boolean; error?: string }> => {
  const { db } = getFirebaseServices();
  if (!db) {
    return { success: false, error: 'Firebase is not configured or connected.' };
  }

  try {
    const docRef = doc(db, 'reset_week_sync', syncKey);
    await setDoc(
      docRef,
      {
        state,
        updatedAt: new Date().toISOString(),
        clientVersion: '1.0.0',
      },
      { merge: true }
    );
    return { success: true };
  } catch (error: any) {
    console.error('Failed to save to Firestore:', error);
    return { success: false, error: error.message || 'Failed to save to cloud.' };
  }
};

export const fetchCloudResetWeek = async (
  syncKey: string = DEFAULT_SYNC_KEY
): Promise<{ success: boolean; data?: any; error?: string }> => {
  const { db } = getFirebaseServices();
  if (!db) {
    return { success: false, error: 'Firebase is not configured.' };
  }

  try {
    const docRef = doc(db, 'reset_week_sync', syncKey);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return { success: true, data: data?.state };
    }
    return { success: true, data: null };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch cloud data.' };
  }
};
