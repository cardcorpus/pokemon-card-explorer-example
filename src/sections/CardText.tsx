import { Badge } from "@/components/ui/badge";
import { useCardText, type Card } from "../api";
import Section from "../components/Section";

// What the card prints, word for word, from text/{set}.json: its HP and types,
// abilities, attacks, trainer or energy text, rule boxes, weakness, resistance,
// retreat and flavor text. It is the print, not how the card plays now: official
// errata are in its play (the Play section). `checked` says how the text is known.
// Energy symbols are written as {Fire}, {Colorless}. A GX or VSTAR attack prints
// its mark beside its name, which the file gives as `label`.
export default function CardText({ card }: { card: Card }) {
  const entry = useCardText(card);
  if (!entry) return null;
  const { text, checked } = entry;
  const stats = [
    text.stage,
    text.evolvesFrom && `Evolves from ${text.evolvesFrom}`,
    text.hp && `${text.hp} HP`,
    text.types?.join(", "),
  ].filter(Boolean);
  const line = (label: string, parts?: { type?: string; value?: string }[]) =>
    parts && parts.length > 0 && (
      <span>
        {label} {parts.map((part) => [part.type, part.value].filter(Boolean).join(" ")).join(", ")}
      </span>
    );

  return (
    <Section title="Printed text" hint="text/{set}.json">
      <div className="max-w-2xl space-y-3 rounded-lg border p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{text.name}</span>
          {text.subtype && <Badge variant="secondary">{text.subtype}</Badge>}
          <Badge variant="outline">{checked === "source" ? "From card lists, not yet checked" : "Read off the card"}</Badge>
        </div>
        {stats.length > 0 && <p className="text-sm text-muted-foreground">{stats.join(" · ")}</p>}
        {text.abilities?.map((ability) => (
          <p key={ability.name}>
            <span className="font-medium">{[ability.label, ability.name].filter(Boolean).join(": ")}</span> {ability.text}
          </p>
        ))}
        {text.attacks?.map((attack) => (
          <p key={attack.name}>
            <span className="text-muted-foreground">{attack.cost?.map((type) => `{${type}}`).join("")}</span>{" "}
            <span className="font-medium">{attack.name}</span>
            {attack.label && <Badge variant="secondary" className="mx-1">{attack.label}</Badge>} {attack.damage}
            {attack.text && <span className="block">{attack.text}</span>}
          </p>
        ))}
        {text.effect?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {text.rules?.map((rule) => (
          <p key={rule.text} className="text-sm italic">
            {rule.label && <span className="font-medium">{rule.label}: </span>}
            {rule.text}
          </p>
        ))}
        <p className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
          {line("Weakness", text.weakness)}
          {line("Resistance", text.resistance)}
          {text.kind === "pokemon" && <span>Retreat {text.retreat}</span>}
        </p>
        {text.flavor && <p className="text-sm italic text-muted-foreground">{text.flavor}</p>}
      </div>
    </Section>
  );
}
