import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { tokens } from "@vira/core";
import "../global.css";

/**
 * Root layout for the creator app.
 *
 * Everything below is the creator surface — there is no brand role here. Brands
 * live in `apps/web`, which keeps campaign funding in a browser and Apple's IAP
 * rule out of the conversation (BUILD_PLAN D13).
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: tokens.colors.background },
        }}
      />
    </SafeAreaProvider>
  );
}
