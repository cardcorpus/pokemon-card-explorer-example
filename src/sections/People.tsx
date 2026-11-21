import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { parseSetId, type Card } from "../api";
import Section from "../components/Section";

// Who is on the card and who drew it. Each is a pointer with a name to show:
// card.species (Pokémon), card.characters (people), card.artists.
// Their cards come a catalog at a time, so the links ask for the card's own.
export default function People({ card }: { card: Card }) {
  const { catalog } = parseSetId(card.set);
  return (
    <Section title="On this card" hint="card.species, card.characters, card.artists">
      <div className="flex flex-wrap gap-2">
        {card.species?.map((p) => (
          <Badge key={p.id} asChild>
            <Link to={`/pokemon/${p.id}?catalog=${catalog}`}>{p.name}</Link>
          </Badge>
        ))}
        {card.characters?.map((p) => (
          <Badge key={p.id} variant="secondary" asChild>
            <Link to={`/characters/${p.id}?catalog=${catalog}`}>{p.name}</Link>
          </Badge>
        ))}
        {card.artists?.map((p) => (
          <Badge key={p.id} variant="outline" asChild>
            <Link to={`/artists/${p.id}?catalog=${catalog}`}>Art: {p.name}</Link>
          </Badge>
        ))}
      </div>
    </Section>
  );
}
