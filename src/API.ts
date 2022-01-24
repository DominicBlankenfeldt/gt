import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { deleteDoc, DocumentData, getFirestore, QueryDocumentSnapshot, doc, DocumentReference, UpdateData, setDoc, getDoc } from 'firebase/firestore';
import { collection, addDoc, getDocs, updateDoc,query, orderBy, limit } from 'firebase/firestore';
import { currentUser } from './router';
import { ref } from 'vue';
import * as type from "@/types";


export async function login(email: string, password: string): Promise<void> {
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

export async function logout(): Promise<void> {
  const auth = getAuth();
  await signOut(auth);
  currentUser.value = null;
}

export async function register(email: string, password: string): Promise<void> {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(getFirestore(), 'users', userCredential.user.uid), {
    email: email,
    role: 'user',
  });
}

export async function addAPI<T>(docName: string, data: T): Promise<DocumentReference<T>> {
  const docRef = await addDoc(collection(getFirestore(), docName), data);
  return docRef as DocumentReference<T>;
}

export async function updateAPI<T>(docName: string, id: string, data: UpdateData<T>): Promise<void> {
  await updateDoc(doc(getFirestore(), docName, id) as DocumentReference<T>, data);
}

export async function getAPI<T extends { id: string }>(docName: string): Promise<T[]> {
  const docs: QueryDocumentSnapshot<DocumentData>[] = [];
  const querySnapshot = await getDocs(collection(getFirestore(), docName));
  querySnapshot.forEach(doc => {
    docs.push(doc);
  });
  return docs.map(exercises => ({ ...exercises.data(), id: exercises.id })) as T[];
}

// export async function updateBestPlayers(bestPlayers: type.Player[]): Promise<void> {
//   await updateAPI<type.Player[]>('bestPlayers', 'veaYiF5t1hObBq8ak9Ay', bestPlayers);
// }

// export async function getBestPlayers(): Promise<type.Player[] | null> {
//   const id = 'veaYiF5t1hObBq8ak9Ay';
//   return id ? ((await getDoc(doc(getFirestore(), 'bestPlayers', id))).data() as type.Player[]) : null;
// }

export async function getBestPlayers(){
  const docs: QueryDocumentSnapshot<DocumentData>[] = [];
  const querySnapshot =await getDocs(query(collection(getFirestore(),'users'), orderBy('player.highscore'), limit(5)))
  querySnapshot.forEach(doc => {
    docs.push(doc);
  });
  return docs.map(exercises => ({ ...exercises.data(), id: exercises.id })) ;
}

export async function addPlayer(player: type.Player): Promise<void> {
  const id = getAuth().currentUser?.uid;
  if (id) {
    await updateDoc(doc(getFirestore(), 'users', id), {
      player: player,
    });
  }
}

export async function getPlayer(): Promise<any | null> {
  const id = getAuth().currentUser?.uid;
  return id ? ((await getDoc(doc(getFirestore(), 'users', id))).data() as any) : null
}