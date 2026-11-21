import type { ReactNode } from "react";
import { parseSetId, useLinkedCard, type Card, type CardPointer, type CardSummary } from "../api";
import { CardTile } from "./CardGrid";

// A link is only a pointer ({ set, id }); `from` is the card it is a link of, whose
// painting file has the card it names (see useLinkedCard).
// `children` can be a function of the linked card, to show more of it.
type Props = { pointer: CardPointer; from: Card; children?: ReactNode | ((card: CardSummary) => ReactNode) };
export default function LinkedCard({ pointer, from, children }: Props) {
  const card = useLinkedCard(pointer, from);
  if (!card) return null;
  return (
    <div className="w-[150px]">
      <CardTile card={card} set={pointer.set} id={pointer.id}>
        <div className="text-muted-foreground">{parseSetId(pointer.set).slug}</div>
        {typeof children === "function" ? children(card) : children}
      </CardTile>
    </div>
  );
}
