import { Badge } from "@/components/ui/badge";
import { parseSetId, usePlay, type Card } from "../api";
import Section from "../components/Section";
import { CardTile } from "../components/CardGrid";

// Every card that plays the same as this one, whatever its picture or wording,
// from plays/{id}.json (the card's `play`). Each card says why it is in the play
// (`basis`): its text is identical, worded differently but the same in play, or
// changed by an official erratum, which the play lists in `errata`.
const BASIS = { identical: "Same text", wording: "Reworded", errata: "By erratum", unread: "Text not read" };
const SHOWN = 24;

export default function Play({ card }: { card: Card }) {
  const play = usePlay(card);
  if (!play) return null;
  const others = play.cards.filter((other) => other.set !== card.set || other.id !== card.id);

  return (
    <Section title={`Plays the same (${play.cardCount} cards)`} hint="plays/{id}.json">
      {play.errata?.map((erratum) => (
        <div key={erratum.id} className="mb-4 max-w-2xl rounded-lg border p-4 text-sm">
          <div className="font-medium">Official erratum, listed {erratum.listed}</div>
          <p>{erratum.change}</p>
          {erratum.text?.map((paragraph) => <p key={paragraph} className="mt-1 italic">{paragraph}</p>)}
        </div>
      ))}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
        {others.slice(0, SHOWN).map((other) => (
          <CardTile key={`${other.set}/${other.id}`} card={other} set={other.set} id={other.id}>
            <div className="text-muted-foreground">{parseSetId(other.set).slug}</div>
            {other.basis && <Badge variant="secondary" className="mt-1">{BASIS[other.basis]}</Badge>}
          </CardTile>
        ))}
      </div>
      {others.length > SHOWN && <p className="mt-3 text-sm text-muted-foreground">and {others.length - SHOWN} more</p>}
    </Section>
  );
}
