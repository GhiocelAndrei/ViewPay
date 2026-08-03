import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { t, tokens } from "@vira/core";

const { colors } = tokens;

/** Same Material Symbols set the web app uses, so the two surfaces read alike. */
const icons = {
  feed: "dynamic-feed",
  campaigns: "campaign",
  portrait: "account-circle",
  earnings: "payments",
  assistant: "smart-toy",
} as const;

/**
 * Bottom tabs — the creator's whole app.
 *
 * The web build renders these too (React Native Web), so the demo can be shown
 * in a browser first and on a phone second, from one codebase.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors["on-surface-variant"],
        tabBarStyle: {
          backgroundColor: colors["surface-container-lowest"],
          borderTopColor: "rgba(255,255,255,0.06)",
          borderTopWidth: 1,
          height: 62,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.nav.feed,
          tabBarIcon: ({ color }) => <MaterialIcons name={icons.feed} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="campaigns"
        options={{
          title: t.nav.campaigns,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name={icons.campaigns} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="portrait"
        options={{
          title: t.nav.profile,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name={icons.portrait} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: t.nav.earnings,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name={icons.earnings} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: t.nav.assistant,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name={icons.assistant} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
