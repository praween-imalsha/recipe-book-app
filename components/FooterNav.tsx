import { View, Text, Pressable } from "react-native";
import React from "react";
import { useRouter, useSegments } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const tabs = [
    { label: "Home", path: "/(dashboard)/home", icon: "restaurant-menu" },
    { label: "My Recipes", path: "/(dashboard)/my-recipes", icon: "book" },
    { label: "Favorites", path: "/(dashboard)/favorites", icon: "favorite" },
    { label: "Profile", path: "/(dashboard)/profile", icon: "person" },
    { label: "User Recipes", path: "/(dashboard)/user-recipes", icon: "library-books" },
] as const;

const FooterNav = () => {
    const router = useRouter();
    const segments = useSegments(); // e.g. ["(dashboard)", "home"]
    const activeRouter = "/" + segments.join("/"); // convert -> "/(dashboard)/home"

    return (
        <View className="flex-row justify-around border-t border-gray-200 py-2 bg-white">
            {tabs.map((tab) => {
                const isActive = tab.path === activeRouter;

                return (
                    <Pressable
                        key={tab.path}
                        className={`flex-1 items-center py-2 ${
                            isActive ? "bg-green-600 rounded-lg mx-1" : ""
                        }`}
                        onPress={() => router.push(tab.path)}
                    >
                        <MaterialIcons
                            name={tab.icon as any}
                            size={24}
                            color={isActive ? "#fff" : "#6b7280"} // active=white, inactive=gray
                        />
                        <Text
                            className={`text-sm mt-1 ${
                                isActive ? "text-white font-bold" : "text-gray-600"
                            }`}
                        >
                            {tab.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};

export default FooterNav;
