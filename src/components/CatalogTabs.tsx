import { Link, useSearchParams } from "react-router-dom";
import { useLabels } from "../api";

// Card lists come a catalog at a time (english, japanese, zh-hans, french).
// The page says which with ?catalog=, else it shows the first the list comes in.
export function useCatalog<C extends string>(catalogs: C[] = []) {
  const [params] = useSearchParams();
  return (params.get("catalog") as C | null) ?? catalogs[0];
}

// The catalogs a list comes in, as links to the same page in each.
export default function CatalogTabs({ catalogs = [] }: { catalogs?: string[] }) {
  const current = useCatalog(catalogs);
  const label = useLabels();
  if (catalogs.length < 2) return null;

  return (
    <nav className="mb-6 flex gap-4 border-b">
      {catalogs.map((catalog) => (
        <Link
          key={catalog}
          to={`?catalog=${catalog}`}
          className={`-mb-px border-b-2 pb-2 ${catalog === current ? "border-foreground font-medium" : "border-transparent text-muted-foreground"}`}
        >
          {label("catalog", catalog)}
        </Link>
      ))}
    </nav>
  );
}
