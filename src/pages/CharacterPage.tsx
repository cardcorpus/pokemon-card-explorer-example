import { useParams } from "react-router-dom";
import { useApi } from "../api";
import CardGrid from "../components/CardGrid";
import CatalogTabs, { useCatalog } from "../components/CatalogTabs";

// Every card a character is on in one catalog: Misty, and Misty's Staryu.
// characters/{catalog}/{id}.json; characters.json says which catalogs they have cards in.
export default function CharacterPage() {
  const { character } = useParams();
  const entry = useApi("characters.json").characters.find((c) => c.id === character);
  const catalog = useCatalog(entry?.catalogs);
  const data = useApi(`characters/${catalog}/${character}.json`);
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
