// services/profileService.ts
import {
    getAuth,
    updateEmail,
    updateProfile,
    User as FirebaseUser,
} from "firebase/auth";
import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";
import { User } from "@/types/user";

/**
 * Update Firebase user profile (Auth + Firestore)
 */
export const updateUserProfile = async (
    displayName: string,
    email: string,
    photoURL?: string
): Promise<User> => {
    const auth = getAuth();
    const db = getFirestore();
    const currentUser: FirebaseUser | null = auth.currentUser;

    if (!currentUser) {
        throw new Error("No user is logged in");
    }

    // ✅ Update display name + photo
    if (displayName || photoURL) {
        await updateProfile(currentUser, {
            displayName: displayName || currentUser.displayName || "",
            photoURL: photoURL || currentUser.photoURL || "",
        });
    }

    // ✅ Update email
    if (email && email !== currentUser.email) {
        await updateEmail(currentUser, email);
    }

    // ✅ Sync to Firestore
    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(
        userRef,
        {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );

    return {
        uid: currentUser.uid,
        email: currentUser.email || "",
        displayName: currentUser.displayName || undefined,
        photoURL: currentUser.photoURL || undefined,
        createdAt: undefined,
        updatedAt: new Date(),
    };
};
