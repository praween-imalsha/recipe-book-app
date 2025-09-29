

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal,
    ScrollView,
} from "react-native";

import { Recipe } from "@/types/Recipe";
import { getAuth } from "firebase/auth";
import {deleteRecipe, getAllRecipes, updateRecipe} from "@/services/RecipeService";

const UserRecipes: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [form, setForm] = useState<{
        title: string;
        description: string;
        ingredients: string[];
        instructions: string[];
        imageUrl?: string;
    }>({
        title: "",
        description: "",
        ingredients: [],
        instructions: [],
        imageUrl: "",
    });

    const auth = getAuth();
    const user = auth.currentUser;

    // 🔄 Fetch recipes
    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const data = await getAllRecipes();
            setRecipes(data.filter((r) => r.authorId === user?.uid)); // ✅ Only user’s recipes
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);


    const handleUpdate = async () => {
        if (!selectedRecipe) return;

        try {
            await updateRecipe(selectedRecipe.id, {
                title: form.title,
                description: form.description,
                ingredients: form.ingredients,
                instructions: form.instructions,
                imageUrl: form.imageUrl,
            });
            Alert.alert("✅ Success", "Recipe updated successfully!");
            setEditModalVisible(false);
            fetchRecipes();
        } catch (error: any) {
            Alert.alert("Error", error.message);
        }
    };


    const handleDelete = async (id: string) => {
        Alert.alert("Confirm Delete", "Are you sure you want to delete?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteRecipe(id);
                        Alert.alert("✅ Deleted", "Recipe deleted successfully!");
                        fetchRecipes();
                    } catch (error: any) {
                        Alert.alert("Error", error.message);
                    }
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Recipes</Text>

            {loading ? (
                <Text style={styles.loading}>Loading...</Text>
            ) : (
                <FlatList
                    data={recipes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text>{item.description}</Text>

                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={styles.editBtn}
                                    onPress={() => {
                                        setSelectedRecipe(item);
                                        setForm({
                                            title: item.title,
                                            description: item.description,
                                            ingredients: item.ingredients || [],
                                            instructions: item.instructions || [],
                                            imageUrl: item.imageUrl || "",
                                        });
                                        setEditModalVisible(true);
                                    }}
                                >
                                    <Text style={styles.btnText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.deleteBtn}
                                    onPress={() => handleDelete(item.id)}
                                >
                                    <Text style={styles.btnText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}


            <Modal visible={editModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Recipe</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={form.title}
                            onChangeText={(text) => setForm({ ...form, title: text })}
                        />
                        <TextInput
                            style={[styles.input, { height: 80 }]}
                            placeholder="Description"
                            value={form.description}
                            onChangeText={(text) => setForm({ ...form, description: text })}
                            multiline
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Ingredients (comma separated)"
                            value={form.ingredients.join(", ")}
                            onChangeText={(text) =>
                                setForm({ ...form, ingredients: text.split(",").map((s) => s.trim()) })
                            }
                        />

                        <TextInput
                            style={[styles.input, { height: 80 }]}
                            placeholder="Instructions (comma separated)"
                            value={form.instructions.join(", ")}
                            onChangeText={(text) =>
                                setForm({ ...form, instructions: text.split(",").map((s) => s.trim()) })
                            }
                            multiline
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Image URL"
                            value={form.imageUrl}
                            onChangeText={(text) => setForm({ ...form, imageUrl: text })}
                        />

                        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                            <Text style={styles.btnText}>Save Changes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => setEditModalVisible(false)}
                        >
                            <Text style={styles.btnText}>Cancel</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

export default UserRecipes;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: "#fff" },
    header: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
    loading: { textAlign: "center", marginTop: 20 },
    card: {
        backgroundColor: "#f9f9f9",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 2,
    },
    title: { fontSize: 18, fontWeight: "bold" },
    actions: { flexDirection: "row", marginTop: 10, gap: 10 },
    editBtn: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
    },
    deleteBtn: {
        backgroundColor: "#dc3545",
        padding: 10,
        borderRadius: 5,
    },
    saveBtn: {
        backgroundColor: "green",
        padding: 12,
        marginTop: 15,
        borderRadius: 8,
    },
    cancelBtn: {
        backgroundColor: "gray",
        padding: 12,
        marginTop: 10,
        borderRadius: 8,
    },
    btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    modalContent: {
        backgroundColor: "#fff",
        margin: 20,
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
});
