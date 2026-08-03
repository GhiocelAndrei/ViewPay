import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { campaigns, currentCreator, formatMoney, t, tokens, type Campaign } from "@vira/core";
import { Button, Card, Chip, LabelCaps, Numeric, ScreenTitle } from "../../src/ui";

const { colors } = tokens;

/**
 * Campaign marketplace. Match strength is *information*, never a gate — the only
 * hard gate is the follower threshold on product-placement campaigns, where the
 * creator has to buy the product themselves.
 */
export default function CampaignsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16, paddingBottom: 32 }}
    >
      <ScreenTitle title={t.campaigns.title} subtitle={t.campaigns.subtitle} />
      <View className="gap-4">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </View>
    </ScrollView>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [reasonsOpen, setReasonsOpen] = useState(false);
  const locked = campaign.locked;

  return (
    <Card className={`p-5 ${locked ? "opacity-70" : ""}`}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 flex-row items-center gap-3">
          <View
            className="h-10 w-10 items-center justify-center rounded-md border"
            style={{ backgroundColor: `${campaign.accent}1a`, borderColor: `${campaign.accent}33` }}
          >
            <Text className="text-[15px] font-bold" style={{ color: campaign.accent }}>
              {campaign.brandName.charAt(0)}
            </Text>
          </View>
          <View className="flex-1">
            <LabelCaps className="text-[9px]">{campaign.brandName}</LabelCaps>
            <Text className="text-[19px] font-semibold text-on-surface">{campaign.title}</Text>
          </View>
        </View>

        <Chip tone={locked ? "neutral" : campaign.match === "strong" ? "mint" : "primary"}>
          {locked
            ? "Blocată"
            : campaign.match === "strong"
              ? t.campaigns.strongMatch
              : t.campaigns.worthTrying}
        </Chip>
      </View>

      {/* Structured brief requirements — machine-checkable, so they stay chips. */}
      <View className="mt-4 flex-row flex-wrap gap-2">
        {campaign.requirements.map((requirement) => (
          <View
            key={requirement}
            className="rounded-full border border-white/5 bg-white/5 px-2.5 py-1"
          >
            <Text className="text-[11px] text-on-surface-variant">{requirement}</Text>
          </View>
        ))}
      </View>

      <View className="mt-4 flex-row gap-4 rounded-md border border-white/5 bg-surface-container-lowest/60 p-4">
        <View className="flex-1">
          <LabelCaps className="text-[9px]">{t.campaigns.payoutRate}</LabelCaps>
          <Numeric className="mt-1 text-[17px] font-semibold text-primary">
            {`${formatMoney(campaign.ratePerMilleMinor)} / 1.000`}
          </Numeric>
        </View>
        <View className="flex-1">
          <LabelCaps className="text-[9px]">{t.campaigns.estimatedEarnings}</LabelCaps>
          <Numeric className="mt-1 text-[17px] font-semibold text-on-surface">
            {`${formatMoney(campaign.estimatedEarningsMinMinor, { compactZeroCents: true })}–${formatMoney(campaign.estimatedEarningsMaxMinor, { compactZeroCents: true })}`}
          </Numeric>
        </View>
      </View>

      {locked ? (
        <View className="mt-4 rounded-md border border-amber/20 bg-amber/5 p-4">
          <Text className="text-[13px] font-semibold text-amber">
            {t.campaigns.lockedFollowers(
              campaign.accessRule.minFollowerThreshold.toLocaleString("ro-RO"),
            )}
          </Text>
          <Text className="mt-2 text-[12px] leading-5 text-on-surface-variant">
            {t.campaigns.productPlacementNote}
          </Text>
          <Text className="mt-2 text-[11px] text-on-surface-variant/60">
            {`Ai ${currentCreator.followerCount.toLocaleString("ro-RO")} urmăritori.`}
          </Text>
        </View>
      ) : (
        <View className="mt-4">
          <Pressable
            onPress={() => setReasonsOpen((open) => !open)}
            className="flex-row items-center justify-between"
          >
            <LabelCaps className="text-[9px]">{t.campaigns.whyItMatches}</LabelCaps>
            <MaterialIcons
              name={reasonsOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={20}
              color={colors["on-surface-variant"]}
            />
          </Pressable>
          {reasonsOpen ? (
            <View className="mt-3 gap-2">
              {campaign.matchReasons.map((reason) => (
                <View key={reason.text} className="flex-row items-start gap-2">
                  <MaterialIcons name="check-circle" size={16} color={colors.mint} />
                  <Text className="flex-1 text-[13px] leading-5 text-on-surface-variant">
                    {reason.text}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      )}

      <View className="mt-5 flex-row items-end justify-between border-t border-white/5 pt-4">
        <View className="flex-row gap-6">
          <View>
            <LabelCaps className="text-[9px]">{t.campaigns.deadline}</LabelCaps>
            <Text className="mt-1 text-[13px] text-on-surface">{campaign.deadline}</Text>
          </View>
          <View>
            <LabelCaps className="text-[9px]">{t.campaigns.availability}</LabelCaps>
            <Numeric className="mt-1 text-[13px] text-on-surface">
              {String(campaign.slotsLeft)}
            </Numeric>
          </View>
        </View>
        <Button title={t.campaigns.apply} variant={locked ? "subtle" : "primary"} disabled={locked} />
      </View>
    </Card>
  );
}
