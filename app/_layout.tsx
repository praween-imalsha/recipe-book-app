import React from "react"
import "./../global.css"
import { Slot, Stack } from "expo-router"

import { LoaderProvider } from "@/context/LoaderContext"
import {AuthProvider} from "@/context/AuthContex";

const RootLayout = () => {
    return (
        <LoaderProvider>
            <AuthProvider>
                <Slot />
            </AuthProvider>
        </LoaderProvider>
    )
}

export default RootLayout