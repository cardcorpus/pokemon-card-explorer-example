import { useParams } from "react-router-dom";
import { useApi } from "../api";
import CardGrid from "../components/CardGrid";
import CatalogTabs, { useCatalog } from "../components/CatalogTabs";

// Every card one artist drew in one catalog: artists/{catalog}/{id}.json
// artists.json says which catalogs they have cards in.
export default function ArtistPage() {
  const { artist } = useParams();
  const entry = useApi("artists.json").artists.find((a) => a.id === artist);
  const catalog = useCatalog(entry?.catalogs);
  const data = useApi(`artists/${catalog}/${artist}.json`);
  const cards = data.cards ?? [];

  return (
    <>
      <h1 className="text-2xl font-semibold">{data.name}</h1>
      <p className="mb-4 text-muted-foreground">{cards.length} cards</p>
      <CatalogTabs catalogs={entry?.catalogs} />
      <CardGrid cards={cards} />
    </>
  );
}
