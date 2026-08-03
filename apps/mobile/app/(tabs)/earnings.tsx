import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { earnings, formatMoney, formatViews, t, type PayoutStatus } from "@vira/core";
import { Button, Card, Chip, LabelCaps, Numeric } from "../../src/ui";

const statusTone: Record<PayoutStatus, "mint" | "primary" | "neutral" | "amber"> = {
  paid: "mint",
  scheduledDay7: "primary",
  scheduledDay14: "primary",
  reserved: "neutral",
  underReview: "amber",
};

/**
 * Earnings. The hero number is the month's total; everything else exists to
 * explain why the payable figure differs from it — the 72h settling window and
 * the 20% reserve are stated on screen rather than discovered in a dispute.
 */
export default function EarningsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16, paddingBottom: 32 }}
    >
      <Text className="text-[30px] font-bold text-on-surface">{t.earnings.title}</Text>

      <Card className="mt-6 p-6">
        <LabelCaps>{t.earnings.thisMonth}</LabelCaps>
        <Numeric className="mt-2 text-[46px] font-bold text-primary">
          {formatMoney(earnings.thisMonthMinor)}
        </Numeric>
        <View className="mt-3">
          <Chip tone="mint">
            {`+${earnings.trendPercent.toLocaleString("ro-RO")}% ${t.common.vsLastMonth}`}
          </Chip>
        </View>
      </Card>

      {/* The three numbers that explain the hero. */}
      <View className="mt-4 gap-3">
        <Card className="p-5">
          <LabelCaps>{t.earnings.pendingValidation}</LabelCaps>
          <Numeric className="mt-2 text-[26px] font-semibold text-on-surface">
            {formatMoney(earnings.pendingValidationMinor)}
          </Numeric>
          <Text className="mt-2 text-[12px] leading-5 text-on-surface-variant/70">
            {t.earnings.pendingNote}
          </Text>
        </Card>

        <Card className="p-5">
          <LabelCaps>{t.earnings.reserve}</LabelCaps>
          <Numeric className="mt-2 text-[26px] font-semibold text-on-surface">
            {formatMoney(earnings.reserveMinor)}
          </Numeric>
          <Text className="mt-2 text-[12px] text-on-surface-variant/70">
            {t.earnings.reserveNote(earnings.reserveReleaseDate)}
          </Text>
        </Card>

        <Card className="border-primary/20 bg-primary/5 p-5">
          <LabelCaps className="text-primary">{t.earnings.available}</LabelCaps>
          <Numeric className="mt-2 text-[26px] font-semibold text-primary">
            {formatMoney(earnings.availableMinor)}
          </Numeric>
          <View className="mt-4">
            <Button title={t.earnings.withdraw} />
          </View>
        </Card>
      </View>

      {/* Payout rows — a list, not a table. */}
      <Text className="mt-8 text-[20px] font-semibold text-on-surface">
        {t.earnings.recentCampaigns}
      </Text>
      <Card className="mt-3">
        {earnings.rows.map((row, index) => (
          <View
            key={row.id}
            className={`p-4 ${index < earnings.rows.length - 1 ? "border-b border-white/[0.04]" : ""}`}
          >
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-[14px] font-semibold text-on-surface">
                  {row.campaignName}
                </Text>
                <Text className="text-[12px] text-on-surface-variant">{row.brandName}</Text>
              </View>
              <Chip tone={statusTone[row.status]}>{t.earnings.status[row.status]}</Chip>
            </View>
            <View className="mt-2 flex-row items-baseline justify-between">
              <Numeric className="text-[12px] text-on-surface-variant">
                {`${formatViews(row.validatedViews)} vizualizări validate`}
              </Numeric>
              <Numeric className="text-[16px] font-semibold text-on-surface">
                {formatMoney(row.amountMinor)}
              </Numeric>
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}
