import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { imageUrl, type CardSummary } from "../api";

// A grid of cards. Every list of cards in the API holds the same summary of a card,
// and each says where it lives with `set` and `card`.
export default function CardGrid({ cards }: { cards: CardSummary[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
      {cards.map((card) => (
        <CardTile key={`${card.set}/${card.id}`} card={card} set={card.set} id={card.id} />
      ))}
    </div>
  );
}

type TileProps = { card: Pick<CardSummary, "name" | "number" | "picture">; set: string; id: string; children?: ReactNode };

export function CardTile({ card, set, id, children }: TileProps) {
  const image = card.picture?.front?.image;
  return (
    <Link to={`/sets/${set}/${id}`} className="text-sm">
      {image ? (
        <img src={imageUrl(image, 240)} alt="" loading="lazy" className="aspect-[5/7] w-full rounded-lg" />
      ) : (
        <div className="aspect-[5/7] w-full rounded-lg bg-muted" />
      )}
      <div className="mt-1 font-medium">{card.name}</div>
      <div className="text-muted-foreground">{card.number?.printed}</div>
      {children}
    </Link>
  );
}
