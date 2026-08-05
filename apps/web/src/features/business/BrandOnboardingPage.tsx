import { useState, type FormEvent, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "@vira/core";
import { cn } from "../../lib/cn";
import { Icon } from "../../components/Icon";
import { putJson } from "../../lib/api";
import { useSession } from "../../lib/session";
import type {
  AudienceAge,
  BudgetBand,
  BusinessProfileDto,
  CampaignObjective,
  CompanySize,
  CreatorCategory,
} from "../../lib/types";

const CATEGORIES: CreatorCategory[] = [
  "Food", "Sport", "Tech", "Beauty", "Travel", "Comedy", "Education", "Lifestyle", "Gaming", "Music",
];
const SIZES: CompanySize[] = ["Solo", "Small", "Medium", "Large"];
const BANDS: BudgetBand[] = ["Under1k", "From1kTo5k", "From5kTo20k", "Over20k"];
const AGES: AudienceAge[] = ["Teens", "A18_24", "A25_34", "A35_44", "A45Plus"];
const OBJECTIVES: CampaignObjective[] = ["Awareness", "Visits", "Offer", "Launch", "Community"];

const inputClass = cn(
  "w-full rounded border border-white/10 bg-surface-container-lowest px-4 py-3",
  "font-body text-[15px] text-on-surface placeholder:text-on-surface-variant/40",
  "outline-none transition-colors focus:border-primary/60",
);

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

/** Post-signup business questionnaire (separate from any campaign). Saved via PUT /brand/profile. */
export default function BrandOnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const setOnboardingComplete = useSession((s) => s.setOnboardingComplete);
  const tr = t.brandOnboarding;

  const prefillName = (location.state as { companyName?: string } | null)?.companyName ?? "";

  const [companyName, setCompanyName] = useState(prefillName);
  const [verticals, setVerticals] = useState<CreatorCategory[]>([]);
  const [companySize, setCompanySize] = useState<CompanySize>("Small");
  const [budgetBand, setBudgetBand] = useState<BudgetBand>("From1kTo5k");
  const [audienceAges, setAudienceAges] = useState<AudienceAge[]>([]);
  const [primaryGoal, setPrimaryGoal] = useState<CampaignObjective>("Awareness");
  const [avoidsAlcohol, setAvoidsAlcohol] = useState(false);
  const [avoidsGambling, setAvoidsGambling] = useState(false);
  const [avoidsPolitical, setAvoidsPolitical] = useState(false);
  const [description, setDescription] = useState("");
  const [valuesText, setValuesText] = useState("");
  const [website, setWebsite] = useState("");
  const [competitorsText, setCompetitorsText] = useState("");
  const [productsToPromote, setProductsToPromote] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = companyName.trim().length > 0 && verticals.length > 0;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!canSubmit) return;

    const dto: BusinessProfileDto = {
      companyName: companyName.trim(),
      verticals,
      companySize,
      budgetBand,
      targetAudienceAges: audienceAges,
      primaryGoal,
      avoidsAlcohol,
      avoidsGambling,
      avoidsPolitical,
      description: description.trim(),
      values: splitList(valuesText),
      website: website.trim(),
      competitorBrands: splitList(competitorsText),
      productsToPromote: productsToPromote.trim(),
    };

    setSubmitting(true);
    try {
      await putJson<void>("/brand/profile", dto);
      setOnboardingComplete(true); // let the brand area in before the me-refetch settles
      queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/brand", { replace: true });
    } catch {
      setError(tr.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl px-5 py-10">
      <h1 className="font-display text-[26px] text-on-surface">{tr.title}</h1>
      <p className="mt-2 text-[14px] text-on-surface-variant">{tr.subtitle}</p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-6">
        <Field label={tr.companyName}>
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClass} />
        </Field>

        <ChipGroup
          label={tr.verticals}
          options={CATEGORIES}
          selected={verticals}
          onToggle={(v) => setVerticals((prev) => toggle(prev, v))}
          renderLabel={(v) => tr.categories[v]}
        />

        <Field label={tr.companySize}>
          <select value={companySize} onChange={(e) => setCompanySize(e.target.value as CompanySize)} className={inputClass}>
            {SIZES.map((s) => (
              <option key={s} value={s}>{tr.companySizes[s]}</option>
            ))}
          </select>
        </Field>

        <Field label={tr.budgetBand}>
          <select value={budgetBand} onChange={(e) => setBudgetBand(e.target.value as BudgetBand)} className={inputClass}>
            {BANDS.map((b) => (
              <option key={b} value={b}>{tr.budgetBands[b]}</option>
            ))}
          </select>
        </Field>

        <ChipGroup
          label={tr.audienceAges}
          options={AGES}
          selected={audienceAges}
          onToggle={(v) => setAudienceAges((prev) => toggle(prev, v))}
          renderLabel={(v) => tr.audienceAgeLabels[v]}
        />

        <Field label={tr.primaryGoal}>
          <select value={primaryGoal} onChange={(e) => setPrimaryGoal(e.target.value as CampaignObjective)} className={inputClass}>
            {OBJECTIVES.map((o) => (
              <option key={o} value={o}>{tr.objectives[o]}</option>
            ))}
          </select>
        </Field>

        <fieldset className="flex flex-col gap-2">
          <span className="label-caps mb-1 block">{tr.brandSafety}</span>
          <Checkbox label={tr.avoidAlcohol} checked={avoidsAlcohol} onChange={setAvoidsAlcohol} />
          <Checkbox label={tr.avoidGambling} checked={avoidsGambling} onChange={setAvoidsGambling} />
          <Checkbox label={tr.avoidPolitical} checked={avoidsPolitical} onChange={setAvoidsPolitical} />
        </fieldset>

        <Field label={tr.description}>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder={tr.descriptionPlaceholder} className={inputClass} />
        </Field>

        <Field label={tr.values}>
          <input value={valuesText} onChange={(e) => setValuesText(e.target.value)} placeholder={tr.valuesPlaceholder} className={inputClass} />
        </Field>

        <Field label={tr.website}>
          <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" className={inputClass} />
        </Field>

        <Field label={tr.competitorBrands}>
          <input value={competitorsText} onChange={(e) => setCompetitorsText(e.target.value)} placeholder={tr.competitorBrandsPlaceholder} className={inputClass} />
        </Field>

        <Field label={tr.productsToPromote}>
          <textarea value={productsToPromote} onChange={(e) => setProductsToPromote(e.target.value)} rows={2} placeholder={tr.productsPlaceholder} className={inputClass} />
        </Field>

        {error && <p className="text-[13px] text-error">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className={cn(
            "mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5",
            "bg-primary font-body text-[15px] font-bold text-on-primary shadow-primary-glow",
            "transition-transform hover:bg-primary/90 active:scale-[0.99]",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          {submitting ? tr.submitting : tr.submit}
          <Icon name="arrow_forward" size={18} />
        </button>
      </form>
    </div>
  );
}

function splitList(text: string): string[] {
  return text.split(",").map((s) => s.trim()).filter(Boolean);
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label-caps mb-2 block">{label}</span>
      {children}
    </label>
  );
}

function ChipGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
  renderLabel,
}: {
  label: string;
  options: T[];
  selected: T[];
  onToggle: (value: T) => void;
  renderLabel: (value: T) => string;
}) {
  return (
    <div>
      <span className="label-caps mb-2 block">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[13px] transition-colors",
                active
                  ? "border-primary bg-primary/15 text-on-surface"
                  : "border-white/10 text-on-surface-variant hover:border-white/25",
              )}
            >
              {renderLabel(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 text-[14px] text-on-surface">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-primary" />
      {label}
    </label>
  );
}
