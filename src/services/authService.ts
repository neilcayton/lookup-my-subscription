import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signOut,
        onAuthStateChanged,
        User
 } from "firebase/auth";

 import { useEffect, useState } from "react";

 export function useAuthState(){
    const [ currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    return currentUser;
}

export async function register(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password)
}

export async function login(email: string, password: string) {
    return await signInWithEmailAndPassword(auth,email,password)   
}

export async function logout(){
    return await signOut(auth)
}