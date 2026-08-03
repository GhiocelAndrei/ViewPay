import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from "../../components/Icon";
import { Card, PageHeader } from "../../components/ui";
import { cn } from "../../lib/cn";
import { t } from "@vira/core";
import { assistantThread, feedCampaigns } from "@vira/core";

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
 * TODO(api): replace the canned reply with a streamed response from the .NET
 * gateway (which fronts ai-service). The frontend never calls ai-service directly.
 */
export default function AssistantPanel() {
  const location = useLocation();

  /**
   * Arriving from a feed card carries that campaign in as context, so the
   * assistant opens on the creator's actual question instead of a blank thread.
   * The campaign is resolved from its id rather than passed whole — router
   * state survives a refresh and must not be trusted to still be accurate.
   */
  const campaignId = (location.state as { campaignId?: string } | null)?.campaignId;
  const campaign = campaignId
    ? feedCampaigns.find((item) => item.id === campaignId) ?? null
    : null;

  const [messages, setMessages] = useState<Message[]>(() =>
    campaign
      ? [{ role: "user", text: t.assistant.campaignQuestion(campaign.hook) }]
      : [...assistantThread],
  );
  const [draft, setDraft] = useState("");

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    setDraft("");
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-70px)] max-w-4xl flex-col px-6 py-10 md:px-12">
      <PageHeader title={t.assistant.title} subtitle={t.assistant.subtitle} />

      {campaign && (
        <div
          className="mt-6 flex items-center gap-3 rounded-lg border px-4 py-3"
          style={{
            borderColor: `${campaign.accent}33`,
            backgroundColor: `${campaign.accent}12`,
          }}
        >
          <Icon name="campaign" size={18} style={{ color: campaign.accent }} />
          <div className="min-w-0">
            <p className="truncate font-body text-[13px] font-semibold text-on-surface">
              {t.assistant.campaignContext(campaign.brandName)}
            </p>
            <p className="truncate text-[12px] text-on-surface-variant">„{campaign.hook}”</p>
          </div>
        </div>
      )}

      <div className="mt-8 flex-1 space-y-4 overflow-y-auto pr-1">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}
          >
            <div
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-full border",
                message.role === "assistant"
                  ? "border-primary/25 bg-primary/10 text-primary"
                  : "border-white/10 bg-white/5 text-on-surface-variant",
              )}
            >
              <Icon name={message.role === "assistant" ? "smart_toy" : "person"} size={18} />
            </div>

            <div className={cn("max-w-[80%]", message.role === "user" && "text-right")}>
              <Card
                glass={message.role === "assistant"}
                className={cn(
                  "px-4 py-3 text-left",
                  message.role === "user" && "border-white/5 bg-white/5",
                )}
              >
                <p className="text-body-md leading-relaxed text-on-surface">{message.text}</p>
              </Card>

              {message.evidence && (
                <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-on-surface-variant/70">
                  <Icon name="link" size={12} />
                  {t.assistant.basedOn(message.evidence)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 shrink-0">
        <div className="mb-3 flex flex-wrap gap-2">
          {t.assistant.suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => send(suggestion)}
              className={cn(
                "rounded-full border border-white/5 bg-white/5 px-3 py-1.5",
                "font-body text-[12px] text-on-surface-variant transition-colors",
                "hover:border-primary/30 hover:text-primary",
              )}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            send(draft);
          }}
          className="flex items-center gap-2 rounded-lg border border-white/5 bg-surface-container-lowest p-2 focus-within:border-primary/50"
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={t.assistant.placeholder}
            className="flex-1 bg-transparent px-3 py-2 text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/50"
          />
          <button
            type="submit"
            aria-label={t.assistant.send}
            className="grid h-10 w-10 place-items-center rounded bg-primary text-on-primary transition-transform active:scale-95 disabled:opacity-40"
            disabled={!draft.trim()}
          >
            <Icon name="arrow_upward" size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
