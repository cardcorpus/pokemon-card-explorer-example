import { Link } from "react-router-dom";
import { imageUrl, useApi, type Card } from "../api";
import Section from "../components/Section";

// A LEGEND is printed as two cards and a V-UNION as four. Each piece is its own card,
// and lists every piece of the whole in reading order: `card.pieces`.
// The pieces are in the card's own set, so their pictures are in the same file.
export default function Pieces({ card }: { card: Card }) {
  const set = useApi(`sets/${card.set}.json`);
  const vocabulary = useApi("vocabulary.json");
  const pieces = card.pieces;
  if (!pieces) return null;

  const format = vocabulary.piece[pieces.format];

  const cards = pieces.cards.map((pointer) => set.cards?.find((c) => c.id === pointer.id));
  // A LEGEND's halves lie on their sides, one above the other. A V-UNION is two by two.
  const legend = pieces.format === "legend";

  return (
    <Section
      title={`${format.label}: ${format.positions?.[pieces.position - 1]}`}
      hint="card.pieces"
    >
      <div className={`grid w-80 ${legend ? "grid-cols-1" : "grid-cols-2"}`}>
        {cards.map((piece) =>
          piece ? (
            <Link
              key={piece.id}
              to={`/sets/${piece.set}/${piece.id}`}
              className={`relative block ${legend ? "aspect-[7/5]" : ""} ${piece.id === card.id ? "" : "opacity-60 hover:opacity-100"}`}
            >
              <img
                src={imageUrl(piece.picture?.front?.image ?? "", 480)}
                alt={piece.name}
                className={legend ? "absolute left-1/2 top-1/2 w-[71.43%] -translate-x-1/2 -translate-y-1/2 rotate-90" : "w-full"}
              />
            </Link>
          ) : null,
        )}
      </div>
    </Section>
  );
}
