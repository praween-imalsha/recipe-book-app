
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
} from "firebase/auth";
import {
    doc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";
import {auth, db} from "@/firebase";


/**
 * Register new user, update profile, and save to Firestore
 */
export const register = async (
    email: string,
    password: string,
    displayName?: string,
    photoURL?: string
) => {
    // 1. Create user with email/password
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user: User = userCred.user;

    // 2. Update Firebase Auth profile
    await updateProfile(user, {
        displayName: displayName || "New User",
        photoURL:
            photoURL || "https://i.ibb.co/2PNyHnZ/default-avatar.png",
    });

    // 3. Save user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName || "New User",
        photoURL:
            photoURL || "https://i.ibb.co/2PNyHnZ/default-avatar.png",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return user;
};

/**
 * Login existing user
 */
export const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Logout user
 */
export const logout = () => {
    return signOut(auth);
};
