import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { currentCreator, formatCompactNumber, portrait, t, tokens } from "@vira/core";
import { Card, Chip, LabelCaps, Numeric, ProgressBar } from "../../src/ui";

const { colors } = tokens;

/**
 * The AI Creator Portrait — the demo's "wow" screen.
 *
 * Two rules from CLAUDE.md are visible in the markup: every claim renders its
 * proving clip (no evidence, no render), and the confidence tier is always on
 * screen so an early portrait never reads as settled fact. No letter grades — a
 * score without a receipt is exactly what this product refuses to ship.
 */
export default function PortraitScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16, paddingBottom: 32 }}
    >
      {/* Identity */}
      <View className="flex-row items-center gap-4">
        <View className="h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
          <Text className="text-[28px] font-bold text-primary">
            {currentCreator.displayName.charAt(0)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-[24px] font-bold text-on-surface">
            {currentCreator.displayName}
          </Text>
          <Text className="mt-0.5 text-on-surface-variant">{currentCreator.handle}</Text>
          <View className="mt-2">
            <Chip tone="primary">
              {`${formatCompactNumber(currentCreator.followerCount)} ${t.portrait.followers}`}
            </Chip>
          </View>
        </View>
      </View>

      {/* Archetype */}
      <Card className="mt-6 overflow-hidden p-6">
        <View className="flex-row items-center gap-3">
          <LabelCaps>{t.portrait.archetype}</LabelCaps>
          <Chip tone="amber">{t.portrait.preliminary}</Chip>
        </View>
        <Text className="mt-3 text-[30px] font-bold leading-9 text-on-surface">
          {portrait.archetype}
        </Text>
        <Text className="mt-3 text-[16px] italic leading-6 text-on-surface-variant">
          {`„${portrait.tagline}”`}
        </Text>
        <Text className="mt-5 text-[12px] leading-5 text-on-surface-variant/70">
          {t.portrait.preliminaryNote}
        </Text>
      </Card>

      {/* Style dimensions */}
      <Card className="mt-4 p-5">
        <LabelCaps>{t.portrait.styleDimensions}</LabelCaps>
        <View className="mt-4 gap-3">
          {portrait.dimensions.map((dimension) => (
            <View key={dimension.key}>
              <View className="flex-row items-baseline justify-between">
                <Text className="text-[13px] text-on-surface">{dimension.label}</Text>
                <Numeric className="text-[13px] text-on-surface-variant">
                  {String(dimension.value)}
                </Numeric>
              </View>
              <View className="mt-1.5">
                <ProgressBar percent={dimension.value} />
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* Evidence — the part that makes the portrait credible. */}
      <Text className="mt-8 text-[22px] font-semibold text-on-surface">{t.portrait.evidence}</Text>
      <Text className="mt-1.5 text-[13px] text-on-surface-variant">
        {t.portrait.evidenceNote}
      </Text>

      <View className="mt-4 gap-3">
        {portrait.claims.map((claim) => (
          <Card key={claim.id} className="p-5">
            <Text className="text-[15px] leading-6 text-on-surface">{claim.statement}</Text>

            {/* Receipt. Required by the type — a claim cannot exist without it. */}
            <View className="mt-4 flex-row items-center gap-3 rounded-md border border-white/5 bg-surface-container-lowest/60 p-3">
              <View className="h-12 w-9 items-center justify-center rounded border border-white/10 bg-primary/10">
                <MaterialIcons name="play-arrow" size={18} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-[12px] font-semibold text-on-surface">
                  {claim.evidence.clipTitle}
                </Text>
                <Numeric className="text-[11px] text-on-surface-variant">
                  {`${claim.evidence.clipDate} · ${claim.evidence.timestamp}`}
                </Numeric>
              </View>
            </View>
          </Card>
        ))}
      </View>

      {/* Growth tip */}
      <Card className="mt-4 border-primary/20 bg-primary/5 p-5">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="lightbulb" size={18} color={colors.primary} />
          <LabelCaps className="text-primary">{t.portrait.growthTip}</LabelCaps>
        </View>
        <Text className="mt-2 text-[15px] leading-6 text-on-surface">{portrait.growthTip}</Text>
      </Card>
    </ScrollView>
  );
}
