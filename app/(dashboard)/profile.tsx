import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image,
    ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getAuth, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

const Profile = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    const [name, setName] = useState(user?.displayName || "");
    const [email] = useState(user?.email || ""); // Firebase email changes require verification → keep readonly for now
    const [photo, setPhoto] = useState(user?.photoURL || "");
    const [loading, setLoading] = useState(false);

    // Password change states
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Pick Profile Photo
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


    const handleUpdateProfile = async () => {
        if (!user) return;

        try {
            setLoading(true);
            await updateProfile(user, {
                displayName: name,
                photoURL: photo || user.photoURL,
            });
            Alert.alert("✅ Success", "Profile updated successfully!");
        } catch (error: any) {
            Alert.alert("❌ Error", error.message);
        } finally {
            setLoading(false);
        }
    };


    const reauthenticate = async (currentPassword: string) => {
        if (!user?.email) throw new Error("No user logged in.");
        const cred = EmailAuthProvider.credential(user.email, currentPassword);
        return await reauthenticateWithCredential(user, cred);
    };


    const handleUpdatePassword = async () => {
        if (!user) return;
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("⚠️ Missing Fields", "Please fill all password fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("⚠️ Error", "New passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            await reauthenticate(currentPassword); // re-authenticate before password change
            await updatePassword(user, newPassword);
            Alert.alert("✅ Success", "Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            Alert.alert("❌ Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-white p-6">
            <Text className="text-2xl font-bold text-gray-800 mb-4">My Profile</Text>

            <TouchableOpacity onPress={pickImage} className="items-center mb-6">
                <Image
                    source={
                        photo ? { uri: photo } : require("@/assets/images/download (4).jpeg")
                    }
                    className="w-24 h-24 rounded-full mb-2"
                />
                <Text className="text-green-600">Change Photo</Text>
            </TouchableOpacity>


            <Text className="text-gray-600 mb-2">Full Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter full name"
                className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />

            {/* Email (read-only) */}
            <Text className="text-gray-600 mb-2">Email</Text>
            <TextInput
                value={email}
                editable={false}
                className="border border-gray-300 rounded-lg px-4 py-2 mb-6 bg-gray-100"
            />


            <TouchableOpacity
                onPress={handleUpdateProfile}
                disabled={loading}
                className={`rounded-xl py-3 ${loading ? "bg-green-400" : "bg-green-600"}`}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-center text-lg">
                        Update Profile
                    </Text>
                )}
            </TouchableOpacity>


            <View className="mt-10">
                <Text className="text-xl font-bold text-gray-800 mb-4">Change Password</Text>

                <Text className="text-gray-600 mb-2">Current Password</Text>
                <TextInput
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Enter current password"
                    secureTextEntry
                    className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
                />

                <Text className="text-gray-600 mb-2">New Password</Text>
                <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    secureTextEntry
                    className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
                />

                <Text className="text-gray-600 mb-2">Confirm New Password</Text>
                <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    secureTextEntry
                    className="border border-gray-300 rounded-lg px-4 py-2 mb-6"
                />

                <TouchableOpacity
                    onPress={handleUpdatePassword}
                    disabled={loading}
                    className={`rounded-xl py-3 ${loading ? "bg-blue-400" : "bg-blue-600"}`}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-center text-lg">
                            Update Password
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Profile;
