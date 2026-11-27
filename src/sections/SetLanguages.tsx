import { Link } from "react-router-dom";
import { imageUrl, useApi, useLabels, type CardCorpusSet } from "../api";
import Section from "../components/Section";

type SetLink = NonNullable<CardCorpusSet["links"]>[number];

// The sets in other languages that this set's cards are in.
// A set's file lists its `links` to other sets, already in the order to show
// them: each a pointer with the other set's `catalog`, a `relation`
// (vocabulary.json `setLink`), the way it reads (`direction`) and how many
// cards the two sets share (`sameCardCount`). Links to sets in the same
// catalog are left out here.
export default function SetLanguages({ set }: { set: CardCorpusSet }) {
  const { setLink } = useApi("vocabulary.json");
  const others = (set.links ?? []).filter((link) => link.catalog !== set.catalog);
  if (others.length === 0) return null;

  // One group a heading, as vocabulary.json words it: "Same set", "Cards released again in", "Has cards from".
  const groups = Map.groupBy(others, (link: SetLink) => {
    const words = setLink[link.relation];
    return (link.direction === "incoming" && words?.incoming) || words?.label || link.relation;
  });

  return (
    <Section title="In other languages" hint="sets/{catalog}/{slug}.json links, names from sets/{catalog}.json">
      {[...groups].map(([title, links]) => (
        <div key={title} className="mb-6">
          <h3 className="mb-2 text-sm text-muted-foreground">{title}</h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
            {links.map((link) => (
              <LinkedSet key={link.id} link={link} />
            ))}
          </div>
        </div>
      ))}
    </Section>
  );
}

// A link names only the set's id. Its name and symbol are in its catalog's
// list of sets, sets/{catalog}.json: one request a language, shared by every
// link to that language.
function LinkedSet({ link }: { link: SetLink }) {
  const label = useLabels();
  const other = useApi(`sets/${link.catalog}.json`).sets.find((set) => set.id === link.id);
  if (!other) return null;

  return (
    <Link to={`/sets/${link.id}`} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted">
      {other.symbol && <img src={imageUrl(other.symbol, 240)} alt="" loading="lazy" className="h-6 w-6 object-contain" />}
      <div className="min-w-0">
        <div className="truncate font-medium">{other.name}</div>
        {other.englishName && other.englishName !== other.name && (
          <div className="truncate text-sm text-muted-foreground">{other.englishName}</div>
        )}
        <div className="text-sm text-muted-foreground">
          {label("catalog", link.catalog)}
          {link.sameCardCount > 0 && ` · ${link.sameCardCount} ${link.sameCardCount === 1 ? "card" : "cards"} in common`}
        </div>
      </div>
    </Link>
  );
}
