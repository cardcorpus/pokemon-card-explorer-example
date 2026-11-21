import { Badge } from "@/components/ui/badge";
import { useLabels, useLinks, type Card } from "../api";
import LinkedCard from "../components/LinkedCard";
import Section from "../components/Section";

// The same card, printed again in a later set of the same language.
// In the painting's file, an original lists `reprints`; a reprint names its original in `reprintOf`.
// Each one says what `differs` from the original.
export default function Reprints({ card }: { card: Card }) {
  const label = useLabels();
  const { reprintOf, reprints = [] } = useLinks(card) ?? {};
  if (!reprintOf && reprints.length === 0) return null;

  const differs = (pointer: { differs: string[] }) => (
    <div className="mt-1 flex flex-wrap gap-1">
      {pointer.differs.length === 0 && <Badge variant="outline">Identical</Badge>}
      {pointer.differs.map((code) => (
        <Badge key={code} variant="secondary">{label("differs", code)}</Badge>
      ))}
    </div>
  );

  return (
    <>
      {reprintOf && (
        <Section title="A reprint of" hint="paintings/{id}.json links.reprintOf">
          <LinkedCard pointer={reprintOf} from={card}>{differs(reprintOf)}</LinkedCard>
        </Section>
      )}
      {reprints.length > 0 && (
        <Section title="Reprints" hint="paintings/{id}.json links.reprints">
          <div className="flex flex-wrap gap-4">
            {reprints.map((pointer) => (
              <LinkedCard key={`${pointer.set}/${pointer.id}`} pointer={pointer} from={card}>
                {differs(pointer)}
              </LinkedCard>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
