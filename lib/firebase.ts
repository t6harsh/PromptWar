/**
 * Chronos Paradox — Firebase Integration
 *
 * Initializes Firebase services for analytics tracking, Firestore
 * game state persistence, and Vertex AI narrative generation.
 * @module lib/firebase
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, logEvent as fbLogEvent, type Analytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc, type Firestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/** Firebase app singleton */
let app: FirebaseApp | null = null;
/** Analytics instance (client-side only) */
let analytics: Analytics | null = null;
/** Firestore instance */
let db: Firestore | null = null;

/**
 * Initialize Firebase app and services.
 * Safe to call multiple times — returns cached instances.
 */
export function initFirebase(): FirebaseApp | null {
    if (!firebaseConfig.apiKey) return null;
    if (app) return app;

    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    if (typeof window !== "undefined") {
        try {
            analytics = getAnalytics(app);
        } catch {
            // Analytics may fail in dev/localhost
        }
    }

    db = getFirestore(app);
    return app;
}

/**
 * Log a game event to Firebase Analytics.
 * @param eventName - Name of the event (e.g., "era_travel", "action_performed")
 * @param params - Event parameters
 */
export function logGameEvent(eventName: string, params?: Record<string, string | number | boolean>): void {
    if (!analytics) return;
    try {
        fbLogEvent(analytics, eventName, params);
    } catch {
        // Silent fail — analytics is non-critical
    }
}

/**
 * Save game state snapshot to Firestore.
 * @param sessionId - Unique session identifier
 * @param state - Game state object to persist
 */
export async function saveGameState(
    sessionId: string,
    state: Record<string, unknown>
): Promise<void> {
    if (!db) return;
    try {
        await setDoc(doc(db, "game_sessions", sessionId), {
            ...state,
            updatedAt: new Date().toISOString(),
        });
    } catch (err) {
        console.warn("[Firebase] Failed to save game state:", err);
    }
}

/**
 * Load game state from Firestore.
 * @param sessionId - Session ID to load
 * @returns Saved game state or null
 */
export async function loadGameState(
    sessionId: string
): Promise<Record<string, unknown> | null> {
    if (!db) return null;
    try {
        const snap = await getDoc(doc(db, "game_sessions", sessionId));
        return snap.exists() ? (snap.data() as Record<string, unknown>) : null;
    } catch {
        return null;
    }
}
