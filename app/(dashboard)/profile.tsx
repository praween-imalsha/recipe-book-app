import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { updateUserProfile } from "@/services/profileService";
import { getAuth } from "firebase/auth";

const Profile = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    const [name, setName] = useState(user?.displayName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [photo, setPhoto] = useState(user?.photoURL || "");
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            allowsEditing: true,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            await updateUserProfile(name, email, photo);
            Alert.alert("✅ Success", "Profile updated successfully!");
        } catch (error: any) {
            Alert.alert("❌ Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white p-6">
            <Text className="text-2xl font-bold text-gray-800 mb-4">My Profile</Text>

            {/* Profile Photo */}
            <TouchableOpacity onPress={pickImage} className="items-center mb-6">
                <Image
                    source={
                        photo ? { uri: photo } : require("@/assets/images/download (4).jpeg")
                    }
                    className="w-24 h-24 rounded-full mb-2"
                />
                <Text className="text-green-600">Change Photo</Text>
            </TouchableOpacity>

            {/* Full Name */}
            <Text className="text-gray-600 mb-2">Full Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter full name"
                className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />

            {/* Email */}
            <Text className="text-gray-600 mb-2">Email</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-gray-300 rounded-lg px-4 py-2 mb-6"
            />

            {/* Save Button */}
            <TouchableOpacity
                onPress={handleUpdate}
                disabled={loading}
                className={`rounded-xl py-3 ${
                    loading ? "bg-green-400" : "bg-green-600"
                }`}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-center text-lg">
                        Update Profile
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
};
export default Profile;