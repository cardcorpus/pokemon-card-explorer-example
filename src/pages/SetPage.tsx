import { useParams } from "react-router-dom";
import { imageUrl, useApi } from "../api";
import CardGrid from "../components/CardGrid";

// One set and its cards. One request: sets/{catalog}/{slug}.json
// Its logo and symbol are pictures like a card's; its description is text.
// `backImage` is the back its cards share, where that is not the usual one.
// `printedCode` is the set code and language mark its cards print ("PBL FR").
export default function SetPage() {
  const { catalog, slug } = useParams();
  const setId = `${catalog}/${slug}`;
  const set = useApi(`sets/${setId}.json`);

  return (
    <>
      {/* Only a set whose cards have an unusual back lists one. */}
      {set.backImage && (
        <img src={imageUrl(set.backImage, 240)} alt="Card back" className="float-right ml-6 w-36 rounded-lg" />
      )}
      {set.logo && <img src={imageUrl(set.logo, 480)} alt="" className="mb-4 max-h-28" />}
      <h1 className="flex items-center gap-2 text-2xl font-semibold">
        {set.symbol && <img src={imageUrl(set.symbol, 240)} alt="" className="h-6" />}
        {set.name}
      </h1>
      <p className="mb-6 text-muted-foreground">
        {set.released?.date} · {set.cardCount} cards{set.printedCode && ` · ${set.printedCode}`}
      </p>
      {set.description && (
        <div className="mb-8 max-w-prose space-y-3">
          {set.description.text.split("\n\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
      <div className="clear-both" />
      <CardGrid cards={set.cards ?? []} />
    </>
  );
}
