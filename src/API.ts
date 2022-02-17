import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import {
    deleteDoc,
    DocumentData,
    getFirestore,
    QueryDocumentSnapshot,
    doc,
    DocumentReference,
    UpdateData,
    setDoc,
    getDoc,
    limitToLast,
    documentId,
} from 'firebase/firestore'
import { collection, addDoc, getDocs, updateDoc, query, orderBy, limit } from 'firebase/firestore'
import { currentUser } from './router'
import * as type from '@/types'

export async function login(email: string, password: string): Promise<void> {
    const auth = getAuth()
    await signInWithEmailAndPassword(auth, email, password)
}

export async function logout(): Promise<void> {
    const auth = getAuth()
    await signOut(auth)
    currentUser.value = null
}

export async function register(email: string, password: string): Promise<void> {
    const auth = getAuth()
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await setDoc(doc(getFirestore(), 'users', userCredential.user.uid), {
        email: email,
        role: 'user',
    })
}
export async function addSpaceFleet(fleet: type.SpaceFleet) {
    return (await addAPI('spaceFleets', fleet)).id
}
export async function addAPI<T>(docName: string, data: T): Promise<DocumentReference<T>> {
    const docRef = await addDoc(collection(getFirestore(), docName), data)
    return docRef as DocumentReference<T>
}

export async function updateAPI<T>(docName: string, id: string, data: UpdateData<T>): Promise<void> {
    await updateDoc(doc(getFirestore(), docName, id) as DocumentReference<T>, data)
}

export async function getAPI<T extends { id: string }>(docName: string): Promise<T[]> {
    const docs: QueryDocumentSnapshot<DocumentData>[] = []
    const querySnapshot = await getDocs(collection(getFirestore(), docName))
    querySnapshot.forEach(doc => {
        docs.push(doc)
    })
    return docs.map(spaceFleet => ({
        ...spaceFleet.data(),
        id: spaceFleet.id,
    })) as T[]
}

export async function getBestPlayers(sortBy: string) {
    const docs: QueryDocumentSnapshot<DocumentData>[] = []
    const querySnapshot = await getDocs(query(collection(getFirestore(), 'users'), orderBy(sortBy), limitToLast(5)))
    querySnapshot.forEach(doc => {
        docs.push(doc)
    })
    return docs.map(bestPlayers => ({ ...bestPlayers.data(), id: bestPlayers.id }))
}
export async function getPlayerSpaceFleet(id: string) {
    return (await (await getDoc(doc(getFirestore(), 'spaceFleets', id))).data()) as type.SpaceFleet
}
export async function addPlayer(player: type.Player): Promise<void> {
    const id = getAuth().currentUser?.uid
    if (id) {
        await updateDoc(doc(getFirestore(), 'users', id), {
            player: player,
        })
    }
}
export async function getFleetPlayer(id: string): Promise<type.User> {
    return (await getDoc(doc(getFirestore(), 'users', id))).data() as type.User
}

export async function getPlayer(): Promise<type.User | null> {
    const id = getAuth().currentUser?.uid
    return id ? ((await getDoc(doc(getFirestore(), 'users', id))).data() as type.User) : null
}
