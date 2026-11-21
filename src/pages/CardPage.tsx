import { Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { imageUrl, useApi } from "../api";
import ErrorBoundary from "../components/ErrorBoundary";
import Variants from "../sections/Variants";
import Languages from "../sections/Languages";
import Reprints from "../sections/Reprints";
import Painting from "../sections/Painting";
import Prices from "../sections/Prices";
import PriceHistory from "../sections/PriceHistory";
import People from "../sections/People";
import Pieces from "../sections/Pieces";

// One card. It is already in the set's file, so no new request.
// Each section below is one component in src/sections: comment a line out to drop it.
export default function CardPage() {
  const { catalog, slug, card: cardId } = useParams();
  const setId = `${catalog}/${slug}`;
  const set = useApi(`sets/${setId}.json`);
  const card = set.cards?.find((card) => card.id === cardId);
  if (!card) return <p>No such card.</p>;

  return (
    <>
      <div className="flex flex-wrap gap-8">
        <img src={imageUrl(card.picture?.front?.image ?? "", 480)} alt="" className="w-80 rounded-2xl" />
        {/* Most cards share the usual back, so only an unusual one is listed. */}
        {card.picture?.back && (
          <img src={imageUrl(card.picture.back.image, 480)} alt="Back" className="w-80 rounded-2xl" />
        )}
        <div>
          <h1 className="text-3xl font-semibold">{card.name}</h1>
          {/* `name` is as printed; a Japanese or Chinese card also gets its English name. */}
          {card.englishName !== card.name && <p className="text-lg text-muted-foreground">{card.englishName}</p>}
          <Link to={`/sets/${setId}`} className="underline">{set.name}</Link>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
            <dt className="text-muted-foreground">Number</dt>
            <dd>{card.number?.printed}</dd>
            <dt className="text-muted-foreground">Rarity</dt>
            <dd>{card.rarity}</dd>
            <dt className="text-muted-foreground">Artist</dt>
            <dd>{card.credit}</dd>
            <dt className="text-muted-foreground">Released</dt>
            <dd>{card.released?.date}</dd>
          </dl>
        </div>
      </div>

      {/* Some sections fetch more files. The card shows at once; they follow. */}
      <ErrorBoundary>
        <Suspense fallback={<p className="mt-10">Loading…</p>}>
          <People card={card} />
          <Pieces card={card} />
          <Variants card={card} />
          <Prices card={card} />
          <PriceHistory card={card} />
          <Languages card={card} />
          <Reprints card={card} />
          <Painting card={card} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
