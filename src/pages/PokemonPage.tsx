import { useParams } from "react-router-dom";
import { useApi } from "../api";
import CardGrid from "../components/CardGrid";
import CatalogTabs, { useCatalog } from "../components/CatalogTabs";

// Every card of one Pokémon in one catalog, oldest first: pokemon-cards/{catalog}/{dex}.json
// pokemon.json says which catalogs have cards of it.
export default function PokemonPage() {
  const { dex } = useParams();
  const entry = useApi("pokemon.json").species.find((s) => String(s.dex) === dex);
  const catalog = useCatalog(entry?.catalogs);
  const data = useApi(`pokemon-cards/${catalog}/${dex}.json`);
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
