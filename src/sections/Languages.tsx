import { useLabels, useLinks, type Card } from "../api";
import LinkedCard from "../components/LinkedCard";
import Section from "../components/Section";

// The same card in other languages.
// A card's print in its painting's file has its `counterparts`, by catalog: `counterparts.french`
// is a pointer to its French print, which is in the same file.
export default function Languages({ card }: { card: Card }) {
  const label = useLabels();
  const counterparts = Object.values(useLinks(card)?.counterparts ?? {});
  if (counterparts.length === 0) return null;

  return (
    <Section title="In other languages" hint="paintings/{id}.json links.counterparts">
      <div className="flex flex-wrap gap-4">
        {counterparts.map((pointer) => (
          <LinkedCard key={`${pointer.set}/${pointer.id}`} pointer={pointer} from={card}>
            {(other) => (
              <>
                <div>{label("language", other.language)}</div>
                <div className="text-muted-foreground">
                  {pointer.printCount} {pointer.printCount === 1 ? "print" : "prints"} in this language
                </div>
              </>
            )}
          </LinkedCard>
        ))}
      </div>
    </Section>
  );
}
