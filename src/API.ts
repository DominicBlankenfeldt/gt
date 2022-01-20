import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { deleteDoc, DocumentData, getFirestore, QueryDocumentSnapshot, doc, DocumentReference, UpdateData, setDoc, getDoc } from 'firebase/firestore';
import { collection, addDoc, getDocs, updateDoc } from 'firebase/firestore';
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
  export async function getAPI<T extends { id: string }>(docName: string): Promise<T> {
    const docs: QueryDocumentSnapshot<DocumentData>[] = [];
    const querySnapshot = await getDocs(collection(getFirestore(), docName));
    querySnapshot.forEach(doc => {
      docs.push(doc);
    });
    return docs.map(player => ({ ...player.data()})).splice(0,1)[0] as T;
  }
  export async function addPlayer(player: type.Player): Promise<void> {
    const id = getAuth().currentUser?.uid;
    if (id) {
      await updateDoc(doc(getFirestore(), 'users', id), {
        player: player,
      });
    }
  }


  export async function getPlayer(): Promise<any|null> {
    const id = getAuth().currentUser?.uid;
    return id ? ((await getDoc(doc(getFirestore(), 'users', id))).data() as any) : null
  }