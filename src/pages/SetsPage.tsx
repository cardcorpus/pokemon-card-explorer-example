import { Link } from "react-router-dom";
import CatalogTabs, { useCatalog } from "../components/CatalogTabs";
import { imageUrl, useApi, type SetSummary } from "../api";

// The sets of one catalog, an era at a time, newest first.
// Two requests: index.json names the catalogs, sets/{catalog}.json lists a catalog's sets.
export default function SetsPage() {
  const catalogs = useApi("index.json").catalogs.map((catalog) => catalog.id);
  const catalog = useCatalog(catalogs);
  const { sets } = useApi(`sets/${catalog}.json`);
  const eras = Object.groupBy(sets.toReversed(), (set) => set.era?.name ?? "Other sets");

  return (
    <>
      <CatalogTabs catalogs={catalogs} />
      {Object.entries(eras).map(([name, sets]) => (
        <Era key={name} name={name} sets={sets!} />
      ))}
    </>
  );
}

// Expansions get a tile with their logo. Every other type of set
// (decks, boxes, promos, prizes) is a short list of names under them.
const TILES = ["expansion", "special_expansion"];

function Era({ name, sets }: { name: string; sets: SetSummary[] }) {
  const { setType } = useApi("vocabulary.json");
  const tiles = sets.filter((set) => TILES.includes(set.type));
  const lists = Object.entries(setType)
    .filter(([type]) => !TILES.includes(type))
    .map(([type, { label }]) => ({ label, sets: sets.filter((set) => set.type === type) }))
    .filter((list) => list.sets.length > 0);

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-xl font-semibold">{name}</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
        {tiles.map((set) => (
          <Link key={set.id} to={`/sets/${set.id}`} className="rounded-lg border p-3 hover:bg-muted">
            <div className="flex h-16 items-center justify-center">
              {set.logo && <img src={imageUrl(set.logo, 240)} alt="" loading="lazy" className="max-h-16" />}
            </div>
            <div className="mt-2 font-medium">{set.name}</div>
            <div className="text-sm text-muted-foreground">
              {set.released?.date} · {set.cardCount} cards
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
        {lists.map((list) => (
          <div key={list.label}>
            <h3 className="mb-1 text-sm text-muted-foreground">{list.label}</h3>
            <Rows sets={list.sets} />
          </div>
        ))}
      </div>
    </section>
  );
}

// Some sets came out as one product, like the four decks of a World Championships year.
// Those share a `line`, and go on one row: the line's name, then a link to each part.
function Rows({ sets }: { sets: SetSummary[] }) {
  const rows = Map.groupBy(sets, (set) => set.line?.id ?? set.id);

  return [...rows].map(([id, parts]) =>
    parts.length === 1 ? (
      <Link key={id} to={`/sets/${parts[0].id}`} className="block hover:underline">
        {parts[0].name}
      </Link>
    ) : (
      <div key={id}>
        {parts[0].line!.name}
        <div className="mb-1 flex flex-wrap gap-x-3 pl-3 text-sm text-muted-foreground">
          {parts.toReversed().map((set) => (
            <Link key={set.id} to={`/sets/${set.id}`} className="hover:underline">
              {set.line!.part}
            </Link>
          ))}
        </div>
      </div>
    ),
  );
}
