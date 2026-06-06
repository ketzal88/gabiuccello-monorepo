import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile } from "./firestore";

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase not configured");
  const result = await signInWithPopup(auth, googleProvider);
  await createUserProfile(result.user);
  return result.user;
}

export async function signInWithEmail(email: string, password: string) {
  if (!auth) throw new Error("Firebase not configured");
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  if (!auth) throw new Error("Firebase not configured");
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  await createUserProfile(result.user);
  return result.user;
}

export async function signOut() {
  if (!auth) return;
  return firebaseSignOut(auth);
}

export function getCurrentUser(): User | null {
  return auth?.currentUser || null;
}
