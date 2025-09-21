import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const tabs = [
    { label: "Home", name: "home", icon: "restaurant-menu" }, // 🍴 Recipe Home
    { label: "MyRecipes", name: "my-recipes", icon: "menu-book" }, // 📖 User recipes
    { label: "Favorites", name: "favorites", icon: "favorite" }, // ❤️ Saved recipes
    { label: "UserRecipes", name: "user-recipes", icon: "library-books" },
    { label: "Profile", name: "profile", icon: "person" }, // 👤 User profile
] as const;

const DashboardLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#16a34a", // Green highlight
                tabBarInactiveTintColor: "#9ca3af", // Gray inactive
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#f9fafb",
                    borderTopWidth: 1,
                    borderTopColor: "#e5e7eb",
                    height: 60,
                    paddingBottom: 6,
                    paddingTop: 6,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                },
            }}
        >
            {tabs.map(({ name, icon, label }) => (
                <Tabs.Screen
                    key={name}
                    name={name}
                    options={{
                        title: label,
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name={icon as any} color={color} size={size} />
                        ),
                    }}
                />
            ))}
        </Tabs>
    );
};

export default DashboardLayout;
