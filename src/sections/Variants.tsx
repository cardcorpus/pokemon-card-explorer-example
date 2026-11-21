import { Badge } from "@/components/ui/badge";
import { imageUrl, useLabels, type Card } from "../api";
import Section from "../components/Section";

// Every version of the card you could own: 1st Edition, reverse holo, a stamped promo.
// They are on the card already, in `card.variants`. Every card has at least one;
// a card with only one has nothing to choose between, so the section is left out.
export default function Variants({ card }: { card: Card }) {
  const label = useLabels();
  if (card.variants.length < 2) return null;
  const nameOf = (id: string) => card.variants.find((v) => v.id === id)?.name;

  return (
    <Section title="Variants" hint="card.variants">
      <div className="flex flex-wrap gap-4">
        {card.variants.map((variant) => (
          <div key={variant.id} className="w-[150px] text-sm">
            <img
              src={imageUrl(variant.picture?.front?.image ?? card.picture?.front?.image ?? "", 240)}
              alt=""
              className="aspect-[5/7] w-full rounded-lg"
            />
            {/* A variant with no picture of its own yet borrows another's: `of` names it. */}
            {variant.picture?.front?.of && (
              <div className="mt-1 text-xs text-muted-foreground">
                Picture of the {nameOf(variant.picture.front.of.id)} variant
              </div>
            )}
            <div className="mt-1 font-medium">{variant.name}</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {variant.role === "error" && <Badge variant="destructive">{label("role", variant.role)}</Badge>}
              {(variant.role === "test" || variant.role === "oversized") && <Badge>{label("role", variant.role)}</Badge>}
              {variant.finish && <Badge variant="secondary">{label("finish", variant.finish)}</Badge>}
              {variant.edition && <Badge variant="secondary">{label("edition", variant.edition)}</Badge>}
              {variant.stamp && <Badge variant="secondary">{label("stamp", variant.stamp)}</Badge>}
            </div>
            {variant.tell && <div className="mt-1 text-muted-foreground">{variant.tell.text}</div>}
            {variant.distributions?.map((d) => (
              <div key={d.id} className="mt-1 text-muted-foreground">{d.name}</div>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}
