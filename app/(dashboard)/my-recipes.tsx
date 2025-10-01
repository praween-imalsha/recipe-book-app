import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
} from "react-native";
import { addRecipe } from "@/services/RecipeService";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

const categories = ["Breakfast", "Lunch", "Dinner", "Dessert"];

const AddRecipe = () => {
    const navigation = useNavigation<any>();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Breakfast");
    const [imageUrl, setImageUrl] = useState("");
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [instructions, setInstructions] = useState<string[]>([]);

    const [ingredientInput, setIngredientInput] = useState("");
    const [instructionInput, setInstructionInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddIngredient = () => {
        if (ingredientInput.trim()) {
            setIngredients((prev) => [...prev, ingredientInput.trim()]);
            setIngredientInput("");
        }
    };

    const handleAddInstruction = () => {
        if (instructionInput.trim()) {
            setInstructions((prev) => [...prev, instructionInput.trim()]);
            setInstructionInput("");
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setCategory("Breakfast");
        setImageUrl("");
        setIngredients([]);
        setInstructions([]);
        setIngredientInput("");
        setInstructionInput("");
    };

    const handleSave = async () => {
        if (!title || !description) {
            Alert.alert("Error", "Please fill all required fields");
            return;
        }

        try {
            setLoading(true);
            const userId = getAuth().currentUser?.uid || "guest";

            await addRecipe({
                title,
                description,
                category,
                imageUrl,
                ingredients,
                instructions,
                authorId: userId,
                favorites: [],
            });

            Alert.alert("Success", "Recipe added successfully");
            resetForm(); // 🔥 clear form after save
            navigation.goBack();
        } catch (error) {
            console.error("Error adding recipe:", error);
            Alert.alert("Error", "Something went wrong while saving recipe");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
            <Text style={styles.header}>Add New Recipe</Text>

            <TextInput
                style={styles.input}
                placeholder="Recipe Title"
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[
                            styles.categoryChip,
                            category === cat && styles.categoryChipActive,
                        ]}
                        onPress={() => setCategory(cat)}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                category === cat && styles.categoryTextActive,
                            ]}
                        >
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TextInput
                style={styles.input}
                placeholder="Image URL"
                value={imageUrl}
                onChangeText={setImageUrl}
            />

            <Text style={styles.label}>Ingredients</Text>
            <View style={styles.row}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Add ingredient"
                    value={ingredientInput}
                    onChangeText={setIngredientInput}
                />
                <TouchableOpacity style={styles.addBtn} onPress={handleAddIngredient}>
                    <Text style={styles.addBtnText}>+</Text>
                </TouchableOpacity>
            </View>
            {ingredients.map((ing, idx) => (
                <Text key={idx} style={styles.listItem}>
                    • {ing}
                </Text>
            ))}

            <Text style={styles.label}>Instructions</Text>
            <View style={styles.row}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Add step"
                    value={instructionInput}
                    onChangeText={setInstructionInput}
                />
                <TouchableOpacity style={styles.addBtn} onPress={handleAddInstruction}>
                    <Text style={styles.addBtnText}>+</Text>
                </TouchableOpacity>
            </View>
            {instructions.map((step, idx) => (
                <Text key={idx} style={styles.listItem}>
                    {idx + 1}. {step}
                </Text>
            ))}

            <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                disabled={loading}
            >
                <Text style={styles.saveBtnText}>
                    {loading ? "Saving..." : "Save Recipe"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white" },
    header: { fontSize: 28, fontWeight: "700", marginBottom: 16 },
    input: {
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
        backgroundColor: "#F8FAFC",
    },
    label: { fontSize: 16, fontWeight: "600", marginVertical: 8 },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#E2E8F0",
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 12,
    },
    categoryChipActive: { backgroundColor: "#3B82F6" },
    categoryText: { fontSize: 14, color: "#334155" },
    categoryTextActive: { color: "white", fontWeight: "700" },
    row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    addBtn: {
        marginLeft: 8,
        backgroundColor: "#3B82F6",
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    addBtnText: { color: "white", fontSize: 18, fontWeight: "700" },
    listItem: { fontSize: 15, marginBottom: 6, color: "#475569" },
    saveBtn: {
        backgroundColor: "#10B981",
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
    },
    saveBtnText: { color: "white", fontWeight: "700", fontSize: 16 },
});

export default AddRecipe;
