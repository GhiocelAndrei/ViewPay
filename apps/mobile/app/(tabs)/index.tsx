import { useCallback, useRef, useState } from "react";
import { Dimensions, FlatList, Pressable, Text, View, type ViewToken } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { feedCampaigns, formatMoney, t, tokens, type FeedCampaign } from "@vira/core";
import { LabelCaps, Numeric } from "../../src/ui";

const { colors } = tokens;

/**
 * Creator home — a vertical feed of *campaigns*, one per screen.
 *
 * `FlatList` with `pagingEnabled` replaces the web build's CSS scroll-snap, and
 * gives real native momentum instead of an emulated one. There is no video and
 * no like/share rail on purpose: the creator is shopping for briefs, so each
 * card leads with the offer.
 */
export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);

  // Full screen minus the tab bar and the safe areas.
  const height = Dimensions.get("window").height - insets.top - insets.bottom - 56;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]?.index != null) setActiveIndex(viewableItems[0].index);
  }).current;

  const renderItem = useCallback(
    ({ item, index }: { item: FeedCampaign; index: number }) => (
      <CampaignSlide campaign={item} height={height} isActive={index === activeIndex} />
    ),
    [height, activeIndex],
  );

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <FlatList
        data={feedCampaigns}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
      />
    </View>
  );
}

function CampaignSlide({
  campaign,
  height,
  isActive,
}: {
  campaign: FeedCampaign;
  height: number;
  isActive: boolean;
}) {
  const [saved, setSaved] = useState(false);

  return (
    <View style={{ height }} className="px-4 py-3">
      <LinearGradient
        colors={[...campaign.gradientStops, colors["surface-container-lowest"]]}
        locations={[0, 0.48, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        className="flex-1 overflow-hidden rounded-xl border border-white/10"
        style={{ borderRadius: 24 }}
      >
        {/* Brand mark + hook */}
        <View className="flex-1 items-center justify-center px-8">
          <View
            className="h-24 w-24 items-center justify-center rounded-full border"
            style={{
              backgroundColor: `${campaign.accent}22`,
              borderColor: `${campaign.accent}55`,
            }}
          >
            <Text className="text-[26px] font-bold" style={{ color: campaign.accent }}>
              {campaign.brandInitials}
            </Text>
          </View>

          <Text className="mt-7 text-center text-[27px] font-bold leading-8 text-white">
            „{campaign.hook}”
          </Text>
          <Text className="mt-2 text-center text-[15px] text-white/60">
            {campaign.hookSubtitle}
          </Text>
        </View>

        {/* Offer */}
        <View className="px-5 pb-5">
          <Text className="text-[17px] font-bold text-white">{campaign.brandName}</Text>
          <Text className="mt-0.5 text-[13px] leading-5 text-white/55">
            {campaign.description}
          </Text>

          <View
            className="mt-4 flex-row items-baseline gap-2 rounded-md border px-4 py-3"
            style={{
              backgroundColor: `${campaign.accent}14`,
              borderColor: `${campaign.accent}33`,
            }}
          >
            <Numeric className="text-[23px] font-bold" style={{ color: campaign.accent }}>
              {formatMoney(campaign.ratePerMilleMinor)}
            </Numeric>
            <Text className="text-[12px] text-white/55">la 1.000 de vizualizări validate</Text>
          </View>

          <Text className="mt-3 text-[12.5px] text-white/55">
            Câștig estimat la audiența ta:{" "}
            <Text className="font-semibold text-white/85">
              {formatMoney(campaign.estimatedMinMinor, { compactZeroCents: true })}–
              {formatMoney(campaign.estimatedMaxMinor, { compactZeroCents: true })}
            </Text>
          </Text>
          <Text className="mt-1 text-[12.5px] text-white/55">
            Buget rămas:{" "}
            <Text className="text-white/85">
              {formatMoney(campaign.budgetRemainingMinor, { compactZeroCents: true })}
            </Text>
            {"  ·  "}
            <Text className="text-white/85">{campaign.slotsLeft} locuri rămase</Text>
          </Text>

          <Pressable
            onPress={() => router.push("/campaigns")}
            className="mt-4 items-center rounded py-3 active:opacity-80"
            style={{ backgroundColor: campaign.accent }}
          >
            <Text className="text-[14px] font-bold" style={{ color: colors.background }}>
              Vezi campania
            </Text>
          </Pressable>
        </View>

        {/* Right rail — match score and the two actions that matter. */}
        <View className="absolute right-3 top-1/3 items-center gap-6">
          <View className="items-center gap-1">
            <View
              className="h-14 w-14 items-center justify-center rounded-full border"
              style={{
                backgroundColor: `${campaign.accent}1a`,
                borderColor: `${campaign.accent}44`,
              }}
            >
              <Numeric className="text-[15px] font-bold" style={{ color: campaign.accent }}>
                {`${campaign.matchPercent}%`}
              </Numeric>
            </View>
            <LabelCaps className="text-[9px] text-white/60">potrivire</LabelCaps>
          </View>

          <Pressable onPress={() => setSaved((v) => !v)} className="items-center gap-1">
            <MaterialIcons
              name={saved ? "bookmark" : "bookmark-border"}
              size={26}
              color={saved ? colors.primary : "#ffffff99"}
            />
            <LabelCaps className="text-[9px] text-white/60">salvează</LabelCaps>
          </Pressable>

          <Pressable className="items-center gap-1">
            <MaterialIcons name="send" size={24} color="#ffffff99" />
            <LabelCaps className="text-[9px] text-white/60">trimite</LabelCaps>
          </Pressable>
        </View>

        {isActive ? (
          <View className="absolute bottom-1 left-0 right-0 items-center opacity-30">
            <MaterialIcons name="expand-more" size={22} color="#ffffff" />
          </View>
        ) : null}
      </LinearGradient>
    </View>
  );
}
