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
    where,
    arrayUnion,
    arrayRemove,
} from 'firebase/firestore'
import { collection, addDoc, getDocs, updateDoc, query, orderBy, limit } from 'firebase/firestore'
import { currentUser } from './router'
import * as type from '@/types'
import router from './router'
//general
export async function addAPI<T>(docName: string, data: T): Promise<DocumentReference<T>> {
    //plz remove
    const docRef = await addDoc(collection(getFirestore(), docName), data)
    return docRef as DocumentReference<T>
}

export async function updateAPI<T>(docName: string, id: string, data: UpdateData<T>): Promise<void> {
    await updateDoc(doc(getFirestore(), docName, id) as DocumentReference<T>, data)
}

// export async function getAPI<T extends { id: string }>(docName: string): Promise<T[]> {
//     const docs: QueryDocumentSnapshot<DocumentData>[] = []
//     const querySnapshot = await getDocs(collection(getFirestore(), docName))
//     querySnapshot.forEach(doc => {
//         docs.push(doc)
//     })
//     return docs.map(spaceFleet => ({
//         ...spaceFleet.data(),
//         id: spaceFleet.id,
//     })) as T[]
// }

//account
export async function login(email: string, password: string): Promise<void> {
    const auth = getAuth()
    await signInWithEmailAndPassword(auth, email, password)
}

export async function logout(): Promise<void> {
    const auth = getAuth()
    await signOut(auth)
    currentUser.value = null
    router.push('/')
}

export async function register(email: string, password: string, player: type.Player): Promise<void> {
    const auth = getAuth()
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await setDoc(doc(getFirestore(), 'users', userCredential.user.uid), {
        email: email,
        role: 'user',
        player: player,
    })
}

//player
export async function getBestPlayers(sortBy: string) {
    const docs: QueryDocumentSnapshot<DocumentData>[] = []
    const querySnapshot = await getDocs(query(collection(getFirestore(), 'users'), orderBy(sortBy), limitToLast(5)))
    querySnapshot.forEach(doc => {
        docs.push(doc)
    })
    return docs.map(bestPlayers => ({ ...bestPlayers.data(), id: bestPlayers.id }))
}
export async function addPlayer(player: type.Player): Promise<void> {
    //plz rename to "updatePlayer"
    const id = getAuth().currentUser?.uid
    if (id) {
        await updateDoc(doc(getFirestore(), 'users', id), {
            player: player,
        })
    }
}
export async function getPlayer(): Promise<type.User | null> {
    const id = getAuth().currentUser?.uid
    return id ? ((await getDoc(doc(getFirestore(), 'users', id))).data() as type.User) : null
}

//spaceFleet
export async function addSpaceFleet(fleet: type.SpaceFleet) {
    return (await addAPI('spaceFleets', fleet)).id
}
export async function deleteSpaceFleet(id: string) {
    await deleteDoc(doc(getFirestore(), 'spaceFleets', id))
}

export async function getPlayerSpaceFleet(id: string) {
    const querySnapshot = await getDoc(doc(getFirestore(), 'spaceFleets', id))
    return { ...querySnapshot.data(), id: querySnapshot.id } as type.SpaceFleet
}

export async function getFleetPlayer(id: string) {
    return (await getDoc(doc(getFirestore(), 'users', id))).data() as type.User
}

export async function getFleetMembers(spaceFleet: string): Promise<type.User[]> {
    const docs: QueryDocumentSnapshot<DocumentData>[] = []
    const querySnapshot = await getDocs(query(collection(getFirestore(), 'users'), where('player.spaceFleet', '==', spaceFleet)))
    querySnapshot.forEach(doc => {
        docs.push(doc)
    })
    return docs.map(members => ({ ...(members.data() as type.User), id: members.id }))
}
export async function searchSpaceFleet(name: string) {
    const docs: QueryDocumentSnapshot<DocumentData>[] = []
    const querySnapshot = await getDocs(query(collection(getFirestore(), 'spaceFleets'), where('name', '<=', name + '~'), where('name', '>=', name)))
    querySnapshot.forEach(doc => {
        docs.push(doc)
    })
    return docs.map(spaceFleet => ({ ...spaceFleet.data(), id: spaceFleet.id }))
}
export async function addFleetMember(fleetID: string, playerId: string) {
    await updateDoc(doc(getFirestore(), 'spaceFleets', fleetID), {
        members: arrayUnion(playerId),
    })
}
export async function removeFleetMember(fleetID: string, playerId: string) {
    await updateDoc(doc(getFirestore(), 'spaceFleets', fleetID), {
        members: arrayRemove(playerId),
    })
}
export async function lvlFleetSkill(fleetID: string, skills: type.FleetSkill[]) {
    await updateDoc(doc(getFirestore(), 'spaceFleets', fleetID), {
        skills: skills,
    })
}
export async function updateFleetInfo(fleetID: string, fleetInfo: type.FleetInfo) {
    await updateDoc(doc(getFirestore(), 'spaceFleets', fleetID), {
        fleetInfo: fleetInfo,
    })
}
