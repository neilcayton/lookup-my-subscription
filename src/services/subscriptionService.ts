import { db } from "../firebaseConfig";
import {
    collection,
    addDoc,
    doc,
    getDocs,
    updateDoc,
    deleteDoc,
    getDoc,
    query,
    where
} from "firebase/firestore"

import { Subscription } from "../types/Subscription";  

const SUBSCRIPTION_COLLECTION = "subscriptions"

// Create (Add)
// The function returns the new subscription's ID as a Promise<string>.
export async function createSubscription(
    sub: Omit<Subscription,"id"> // this argument sub is a subscription object without an id field (since Firestore will generate it automatically).
): Promise<string> {
    try {
        console.log("Creating subscription:", sub);
        const colRef = collection(db, SUBSCRIPTION_COLLECTION); // fetches a reference to the "subscriptions" collection in Firestore.
        const docRef = await addDoc(colRef, sub); // inserts the sub object into Firestore.
        console.log("Subscription created with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error creating subscription:", error);
        throw new Error(`Failed to create subscription: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// Read (Get All for user "THE SUBCRIPTIONS OWNED")
export async function getSubscriptionByUserId(userId: string): Promise<Subscription[]> {
    try {
        console.log("Fetching subscriptions for user:", userId);
        const colRef = collection(db, SUBSCRIPTION_COLLECTION);
        
        // Using a query with where clause is more efficient than filtering client-side
        const q = query(colRef, where("userId", "==", userId));
        const snapshot = await getDocs(q);
        
        const subscriptions: Subscription[] = [];
        snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Omit<Subscription, "id">;
            subscriptions.push({...data, id: docSnap.id});
        });
        
        console.log(`Found ${subscriptions.length} subscriptions for user ${userId}`);
        return subscriptions;
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        throw new Error(`Failed to fetch subscriptions: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function getSubscriptionById(id: string): Promise<Subscription | null> {
    try {
        console.log("Fetching subscription by ID:", id);
        const docRef = doc(db, SUBSCRIPTION_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            console.log("No subscription found with ID:", id);
            return null; // promise null    
        }
        
        console.log("Subscription found:", docSnap.id);
        return { id: docSnap.id, ...docSnap.data() } as Subscription; //promise subscription id
    } catch (error) {
        console.error("Error fetching subscription by ID:", error);
        throw new Error(`Failed to fetch subscription: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function updateSubsription(sub: Subscription): Promise<void> {
    try {
        console.log("Updating subscription:", sub.id);
        const docRef = doc(db, SUBSCRIPTION_COLLECTION, sub.id);
        const {id, ...rest} = sub;
        await updateDoc(docRef, rest);
        console.log("Subscription updated successfully:", sub.id);
    } catch (error) {
        console.error("Error updating subscription:", error);
        throw new Error(`Failed to update subscription: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function deleteSubscription(id: string): Promise<void> {
    try {
        console.log("Deleting subscription:", id);
        const docRef = doc(db, SUBSCRIPTION_COLLECTION, id);
        await deleteDoc(docRef);
        console.log("Subscription deleted successfully:", id);
    } catch (error) {
        console.error("Error deleting subscription:", error);
        throw new Error(`Failed to delete subscription: ${error instanceof Error ? error.message : String(error)}`);
    }
}