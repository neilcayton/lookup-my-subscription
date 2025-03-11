import { db } from "../firebaseConfig";
import {
    collection,
    addDoc,
    doc,
    getDocs,
    updateDoc,
    deleteDoc,
    getDoc
} from "firebase/firestore"

import { Subscription } from "../types/Subscription";  
import { constants } from "buffer";

const SUBSCRIPTION_COLLECTION = "subscriptions"

// Create (Add)
// The function returns the new subscription's ID as a Promise<string>.
export async function createSubscription(
    sub: Omit<Subscription,"id"> // this argument sub is a subscription object without an id field (since Firestore will generate it automatically).
): Promise<string> {
 const coldRef = collection(db,SUBSCRIPTION_COLLECTION); // fetches a reference to the "subscriptions" collection in Firestore.
 const docRef = await addDoc(coldRef, sub); // inserts the sub object into Firestore.
 return docRef.id;
}

// Read (Get All for user "THE SUBCRIPTIONS OWNED")
export async function getSubscriptionByUserId(userId: string): Promise<Subscription[]> {
    const colRef = collection(db,SUBSCRIPTION_COLLECTION);
    const snapshot = await getDocs(colRef);
    const subscriptions: Subscription[] = [];


    snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<Subscription, "id">;
        
        // belongs to he user

        if(data.userId === userId) {
            subscriptions.push({...data, id: docSnap.id})
        }
    });
    
    return subscriptions;

}


export async function getSubscriptionById(id: string): Promise<Subscription | null> {
    const docRef = doc(db, SUBSCRIPTION_COLLECTION, id)
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) 
        return null; // promise null    
    return { id: docSnap.id, ...docSnap.data() } as Subscription; //promise subscription id

}


export async function updateSubsription(sub: Subscription): Promise<void> {
    const docRef = doc(db,SUBSCRIPTION_COLLECTION, sub.id)
    const {id, ...rest} = sub
    await updateDoc(docRef, rest)
    
}

export async function deleteSubscription(id: string): Promise<void> {
    const docRef = doc(db, SUBSCRIPTION_COLLECTION, id)
    await deleteDoc(docRef)
}