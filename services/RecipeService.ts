// src/services/recipeService.ts

import { db } from "@/firebase";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
    query,
    where,
    getDoc,
} from "firebase/firestore";
import { Recipe } from "@/types/Recipe";
import { getAuth } from "firebase/auth";

const recipesRef = collection(db, "recipes");

// ✅ CREATE
export const addRecipe = async (recipe: Omit<Recipe, "id">) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    await addDoc(recipesRef, {
        ...recipe,
        authorId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
};

// ✅ READ (All)
export const getAllRecipes = async (): Promise<Recipe[]> => {
    const snapshot = await getDocs(recipesRef);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Recipe));
};

// ✅ READ (By Category)
export const getRecipesByCategory = async (
    category: string
): Promise<Recipe[]> => {
    if (category === "All") return await getAllRecipes();

    const q = query(recipesRef, where("category", "==", category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Recipe));
};

// ✅ READ (By Search - title/description contains query)
export const searchRecipes = async (keyword: string): Promise<Recipe[]> => {
    if (!keyword.trim()) return await getAllRecipes();

    const allRecipes = await getAllRecipes();
    return allRecipes.filter(
        (recipe) =>
            recipe.title.toLowerCase().includes(keyword.toLowerCase()) ||
            recipe.description.toLowerCase().includes(keyword.toLowerCase())
    );
};

// ✅ READ (By ID)
export const getRecipeById = async (id: string): Promise<Recipe | null> => {
    const docRef = doc(db, "recipes", id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as Recipe;
};

// ✅ UPDATE (Only Owner can update)
export const updateRecipe = async (id: string, recipe: Partial<Recipe>) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const docRef = doc(db, "recipes", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) throw new Error("Recipe not found");
    const data = snapshot.data() as Recipe;

    if (data.authorId !== user.uid)
        throw new Error("You are not allowed to update this recipe");

    await updateDoc(docRef, { ...recipe, updatedAt: new Date() });
};

// ✅ DELETE (Only Owner can delete)
export const deleteRecipe = async (id: string) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const docRef = doc(db, "recipes", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) throw new Error("Recipe not found");
    const data = snapshot.data() as Recipe;

    if (data.authorId !== user.uid)
        throw new Error("You are not allowed to delete this recipe");

    await deleteDoc(docRef);
};

// ✅ FAVORITE toggle
export const toggleFavorite = async (
    id: string,
    userId: string,
    favorites: string[] = []
): Promise<string[]> => {
    const docRef = doc(db, "recipes", id);
    let updatedFavorites = [...favorites];

    if (favorites.includes(userId)) {
        updatedFavorites = updatedFavorites.filter((uid) => uid !== userId);
    } else {
        updatedFavorites.push(userId);
    }

    await updateDoc(docRef, { favorites: updatedFavorites });
    return updatedFavorites;
};
