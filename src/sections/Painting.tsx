import { printIn, usePainting, type Card } from "../api";
import CardGrid from "../components/CardGrid";
import Section from "../components/Section";

// The picture on the card, wherever it was printed: `painting`.
// A painting's file is named by its own id, paintings/{id}.json; `firstPrint` in it is the card that printed it first.
// Its `cards` list its prints, one list for each different card that uses the picture.
export default function Painting({ card }: { card: Card }) {
  const found = usePainting(card);
  if (!found) return null;

  return (
    <Section title={`Every print of this picture (${found.printCount})`} hint="card.painting">
      <div className="space-y-6">
        {found.cards.map((prints, i) => (
          <div key={i}>
            {found.cardCount > 1 && (
              <div className="mb-2 text-sm text-muted-foreground">
                {prints.some((p) => p.set === card.set && p.id === card.id)
                  ? "This card"
                  : "A different card with this picture"}
              </div>
            )}
            <CardGrid cards={prints.map((p) => printIn(found, p)!)} />
          </div>
        ))}
      </div>
    </Section>
  );
}
