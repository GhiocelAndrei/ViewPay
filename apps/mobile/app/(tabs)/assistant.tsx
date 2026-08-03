import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { assistantThread, t, tokens } from "@vira/core";
import { Card } from "../../src/ui";

const { colors } = tokens;

interface Message {
  role: "user" | "assistant";
  text: string;
  /** Which of the creator's own clips this advice is grounded in. */
  evidence?: string;
}

/**
 * Content assistant. It coaches from the creator's own history rather than
 * generic advice, so every suggestion carries the clip it is based on.
 *
 * TODO(api): replace the canned thread with a streamed response from the .NET
 * gateway (which fronts ai-service). The app never calls ai-service directly.
 */
export default function AssistantScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([...assistantThread]);
  const [draft, setDraft] = useState("");

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    setDraft("");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}
    >
      <View className="px-5 pb-3 pt-3">
        <Text className="text-[24px] font-bold text-on-surface">{t.assistant.title}</Text>
        <Text className="mt-1 text-[13px] text-on-surface-variant">{t.assistant.subtitle}</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 16, gap: 12 }}>
        {messages.map((message, index) => (
          <View
            key={index}
            className={message.role === "user" ? "items-end" : "items-start"}
          >
            <Card
              className={`max-w-[85%] px-4 py-3 ${
                message.role === "user" ? "border-white/5 bg-white/5" : ""
              }`}
            >
              <Text className="text-[15px] leading-6 text-on-surface">{message.text}</Text>
            </Card>
            {message.evidence ? (
              <Text className="mt-1 text-[11px] text-on-surface-variant/70">
                {t.assistant.basedOn(message.evidence)}
              </Text>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <View className="px-5 pb-5" style={{ paddingBottom: insets.bottom + 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
          <View className="flex-row gap-2">
            {t.assistant.suggestions.map((suggestion) => (
              <Pressable
                key={suggestion}
                onPress={() => send(suggestion)}
                className="rounded-full border border-white/5 bg-white/5 px-3 py-2 active:opacity-70"
              >
                <Text className="text-[12px] text-on-surface-variant">{suggestion}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View className="flex-row items-center gap-2 rounded-lg border border-white/5 bg-surface-container-lowest p-2">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={t.assistant.placeholder}
            placeholderTextColor="rgba(201,196,216,0.5)"
            className="flex-1 px-3 py-2 text-[15px]"
            style={{ color: colors["on-surface"] }}
            onSubmitEditing={() => send(draft)}
            returnKeyType="send"
          />
          <Pressable
            onPress={() => send(draft)}
            disabled={!draft.trim()}
            className="h-10 w-10 items-center justify-center rounded bg-primary active:opacity-80"
            style={{ opacity: draft.trim() ? 1 : 0.4 }}
          >
            <MaterialIcons name="arrow-upward" size={20} color={colors["on-primary"]} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
