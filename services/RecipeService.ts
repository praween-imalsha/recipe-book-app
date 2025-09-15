// src/services/RecipeService.ts
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    doc,
    getDoc,
    DocumentData,
    serverTimestamp,
    QuerySnapshot,
    DocumentSnapshot,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";
import { Recipe } from "@/types/Recipe";

const recipeCollection = collection(db, "recipes");

export const RecipeService = {
    async uploadImageToFirebase(localUri: string): Promise<string | null> {
        try {
            if (!localUri) return null;
            const response = await fetch(localUri);
            const blob = await response.blob();
            const filename = `recipes/${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 8)}.jpg`;

            const storageRef = ref(storage, filename);
            await uploadBytes(storageRef, blob);

            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error("🔥 Image upload failed:", error);
            return null;
        }
    },

    async addRecipe(recipe: Omit<Recipe, "id">): Promise<string> {
        const docRef = await addDoc(recipeCollection, {
            ...recipe,
            favorites: recipe.favorites ?? [], // 🔑 ensure field exists
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    },

    async getAllRecipes(): Promise<Recipe[]> {
        const snapshot: QuerySnapshot = await getDocs(recipeCollection);
        return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as DocumentData),
        })) as Recipe[];
    },

    async getRecipeById(id: string): Promise<Recipe | null> {
        if (!id) return null;
        const docRef = doc(db, "recipes", id);
        const snapshot: DocumentSnapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...(snapshot.data() as DocumentData) } as Recipe;
    },

    async toggleFavorite(recipeId: string, userId: string, isCurrentlyFavorite: boolean): Promise<void> {
        const recipeRef = doc(db, "recipes", recipeId);
        if (!isCurrentlyFavorite) {
            await updateDoc(recipeRef, {
                favorites: arrayUnion(userId),
                updatedAt: serverTimestamp(),
            });
        } else {
            await updateDoc(recipeRef, {
                favorites: arrayRemove(userId),
                updatedAt: serverTimestamp(),
            });
        }
    },
};
