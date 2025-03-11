import { auth } from "../firebaseConfig";
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    AuthError,
    browserLocalPersistence,
    setPersistence
} from "firebase/auth";
import { useEffect, useState } from "react";

// Initialize persistence to local storage
// This can help with the auth/configuration-not-found error
try {
    setPersistence(auth, browserLocalPersistence);
} catch (error) {
    console.error("Error setting persistence:", error);
}

// Custom hook to get the current authenticated user
export function useAuthState() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            console.log("Setting up auth state listener");
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                console.log("Auth state changed:", user ? "User logged in" : "No user");
                setCurrentUser(user);
                setLoading(false);
            }, (authError) => {
                console.error("Auth state change error:", authError);
                setError(authError.message);
                setLoading(false);
            });
            
            return () => unsubscribe();
        } catch (error) {
            console.error("Auth state setup error:", error);
            setError(error instanceof Error ? error.message : "Unknown error occurred");
            setLoading(false);
        }
    }, []);

    return { currentUser, loading, error };
}

// Register a new user
export async function register(email: string, password: string) {
    try {
        console.log("Attempting to register user:", email);
        const result = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Registration successful:", result.user.uid);
        return result;
    } catch (error) {
        console.error("Registration error:", error);
        const authError = error as AuthError;
        
        // Provide more specific error messages
        if (authError.code === 'auth/configuration-not-found') {
            console.error("Firebase configuration error. Please check your Firebase console settings.");
            throw new Error("Firebase configuration error. Please check your Firebase settings and ensure Authentication is enabled.");
        }
        
        throw new Error(authError.message || "Failed to register");
    }
}

// Login an existing user
export async function login(email: string, password: string) {
    try {
        console.log("Attempting to login user:", email);
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful:", result.user.uid);
        return result;
    } catch (error) {
        console.error("Login error:", error);
        const authError = error as AuthError;
        
        // Provide more specific error messages
        if (authError.code === 'auth/configuration-not-found') {
            console.error("Firebase configuration error. Please check your Firebase console settings.");
            throw new Error("Firebase configuration error. Please check your Firebase settings and ensure Authentication is enabled.");
        }
        
        throw new Error(authError.message || "Failed to login");
    }
}

// Logout the current user
export async function logout() {
    try {
        console.log("Attempting to logout user");
        await signOut(auth);
        console.log("Logout successful");
        return true;
    } catch (error) {
        console.error("Logout error:", error);
        const authError = error as AuthError;
        throw new Error(authError.message || "Failed to logout");
    }
}